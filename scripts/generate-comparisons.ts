import dotenv from 'dotenv';
import Ajv from 'ajv';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, GenerativeModel } from '@google/generative-ai';
import fs from 'fs/promises'; // Use promises for async file operations
import path from 'path';
import { fileURLToPath } from 'url'; // Needed for __dirname in ES modules

// Load environment variables from .env file
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.0-flash"; // Changed model
//const MODEL_NAME = "gemini-2.5-pro-exp-03-25"; // Changed model


const OUTPUT_DIR = path.join(process.cwd(), 'public', 'data', 'comparisons');
const CARNEY_PROMISES_PATH = path.join(process.cwd(), 'src', 'data', 'carneyPromises.json');
const POILIEVRE_PROMISES_PATH = path.join(process.cwd(), 'src', 'data', 'poilievrePromises.json');

// --- Schema Loading Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, '..', 'src', 'schemas', 'comparison_output_schema.json'); 
let validate: ReturnType<Ajv["compile"]> | undefined; // Compiled validator function (initially undefined)
// --- End Schema Setup ---

const CATEGORIES = [
  "Economy",
  "Healthcare",
  "Environment",
  "Defense",
  "Education",
  "Immigration",
  "Housing",
  "Other"
];

interface PromiseItem {
  description: string;
  quote: string;
  category: string;
  id: string;
  // Add other relevant fields from your schema if needed later
}

interface ComparisonPoint {
    point: string;
    carney_stance: string;
    poilievre_stance: string;
    carney_citations: string[];
    poilievre_citations: string[];
}

interface ComparisonOutput {
    category: string;
    candidateA: {
        name: string;
        summary: string;
    };
    candidateB: {
        name: string;
        summary: string;
    };
    comparison: {
        differences: ComparisonPoint[];
        similarities: ComparisonPoint[];
    };
}

// Interface for structured input to Gemini
interface GeminiPromiseInput {
    id: string;
    text: string; // Combined description/quote
}

// Helper function to call Gemini and extract text response
async function callGemini(model: GenerativeModel, prompt: string): Promise<string> {
    try {
        // Config and safety are now part of the model instance passed in
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        // console.log("Gemini Raw Response:", text); // Debugging line
        return text;
    } catch (error) {
        console.error(`Error calling Gemini (text): ${error}`);
        return ""; // Return empty string on error
    }
}

// Helper function to call Gemini and expect a JSON response
async function callGeminiForJson<T>(model: GenerativeModel, prompt: string): Promise<T | null> {
    try {
        // Config (including responseMimeType) and safety are now part of the model instance
        const result = await model.generateContent(prompt);
        const response = result.response;
        const rawJsonText = response.text();
        console.log("Gemini Raw JSON Response:\n--START--\n", rawJsonText, "\n--END--"); // Uncommented and added markers for clarity

        // Clean the response text if necessary
        const cleanedJsonText = rawJsonText.replace(/^```json\n?|\n?```$/g, '').trim();

        return JSON.parse(cleanedJsonText) as T;
    } catch (error) {
        console.error(`Error calling Gemini or parsing JSON: ${error}`);
        console.error(`Prompt that caused error:\n${prompt}\n`); // Log the prompt too
        return null; // Return null on error
    }
}

async function generateCategoryComparison(category: string, carneyPromises: PromiseItem[], poilievrePromises: PromiseItem[]): Promise<ComparisonOutput | null> {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not defined in .env file");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);

    // Define safety settings and base generation config once - SAFETY SETTINGS REMOVED
    // const safetySettings = [
    //     { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    //     { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    //     { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    //     { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    // ];

    const baseGenerationConfig = {
        temperature: 0.6,
        topK: 1,
        topP: 1,
        maxOutputTokens: 4096,
    };

    // Initialize two model instances with different configurations
    const textModel = genAI.getGenerativeModel({
        model: MODEL_NAME,
        // safetySettings, // REMOVED
        generationConfig: baseGenerationConfig
    });

    const jsonModel = genAI.getGenerativeModel({
        model: MODEL_NAME,
        // safetySettings, // REMOVED
        generationConfig: {
            ...baseGenerationConfig,
            responseMimeType: "application/json",
        }
    });


    console.log(`Processing category: ${category}...`);

    // 1. Filter promises and format *with ID* for Gemini input
    const formatForGemini = (promises: PromiseItem[], cat: string): GeminiPromiseInput[] => {
        return promises
            .filter(p => p.category === cat)
            .map(p => ({
                id: p.id, // Assuming p.id is reliable (from Index.tsx memoization)
                text: `- Description: ${p.description}\n  Quote: ${p.quote}`
            }));
    };

    const carneyGeminiInput = formatForGemini(carneyPromises, category);
    const poilievreGeminiInput = formatForGemini(poilievrePromises, category);

    if (carneyGeminiInput.length === 0 && poilievreGeminiInput.length === 0) {
        console.log(`  Skipping ${category}: No promises found for either candidate.`);
        return null;
    }

    // 2. Construct Prompts
    const baseContext = `Context: Comparing political promises for the category "${category}".\nInput promises are provided as JSON arrays...

Mark Carney Promises Input:
${JSON.stringify(carneyGeminiInput)}

Pierre Poilievre Promises Input:
${JSON.stringify(poilievreGeminiInput)}

`;

    // Summary prompts remain text-based, using simplified text input for context
    const simplifiedCarneyText = carneyGeminiInput.map(p => p.text).join('\n\n') || '[No promises provided]';
    const simplifiedPoilievreText = poilievreGeminiInput.map(p => p.text).join('\n\n') || '[No promises provided]';
    const summaryContext = `Context: Comparing political promises for the category "${category}".\n\nMark Carney Promises:\n${simplifiedCarneyText}\n\nPierre Poilievre Promises:\n${simplifiedPoilievreText}\n\n`;
    const summaryPromptA = `${summaryContext}Task: Generate a concise, neutral summary (2-3 sentences) of Mark Carney's main policy stances or commitments within the "${category}" category based *only* on the promises provided above.`;
    const summaryPromptB = `${summaryContext}Task: Generate a concise, neutral summary (2-3 sentences) of Pierre Poilievre's main policy stances or commitments within the "${category}" category based *only* on the promises provided above.`;

    // Updated prompt requesting citations and adding schema description
    const differencesPrompt = `${baseContext}Task: Identify the key policy differences between Mark Carney and Pierre Poilievre regarding "${category}", based *only* on the Input Promises provided above. Only include differences where *both* candidates address the specific point. Do *not* include points mentioned by only one candidate.

Use this JSON Schema for the output array items:
ComparisonPoint = {
  "point": str,               // Description of the difference
  "carney_stance": str,       // Carney's specific stance on this point
  "poilievre_stance": str,    // Poilievre's specific stance on this point
  "carney_citations": list[str], // List of supporting Carney promise IDs
  "poilievre_citations": list[str] // List of supporting Poilievre promise IDs
}
Return: list[ComparisonPoint]

Output Format: Respond *only* with a valid JSON array of objects matching the schema above. If no such differences are found, return an empty array [].`;

    // Updated prompt requesting citations and adding schema description
    const similaritiesPrompt = `${baseContext}Task: Identify any significant policy similarities or shared goals between Mark Carney and Pierre Poilievre regarding "${category}", based *only* on the Input Promises provided above. Only include similarities where *both* candidates address the specific point. Do *not* include points mentioned by only one candidate.

Use this JSON Schema for the output array items:
ComparisonPoint = {
  "point": str,               // Description of the similarity
  "carney_stance": str,       // Carney's specific stance on this point
  "poilievre_stance": str,    // Poilievre's specific stance on this point
  "carney_citations": list[str], // List of supporting Carney promise IDs
  "poilievre_citations": list[str] // List of supporting Poilievre promise IDs
}
Return: list[ComparisonPoint]

Output Format: Respond *only* with a valid JSON array of objects matching the schema above. If no such similarities are found, return an empty array [].`;

    // 3. Call Gemini API (Removed call for unique policies)
    console.log(`  Calling Gemini for ${category}...`);
    const [summaryA, summaryB, diffResult, simResult] = await Promise.all([
        callGemini(textModel, summaryPromptA),
        callGemini(textModel, summaryPromptB),
        callGeminiForJson<ComparisonPoint[]>(jsonModel, differencesPrompt),
        callGeminiForJson<ComparisonPoint[]>(jsonModel, similaritiesPrompt)
    ]);
    console.log(`  Received Gemini responses for ${category}.`);

    // Handle potential nulls, ensuring citation arrays and required fields exist
    // Adding more explicit checks for potentially missing fields from Gemini
    const differences = (diffResult ?? []).map(d => ({
        point: d?.point ?? '',
        carney_stance: d?.carney_stance ?? '',
        poilievre_stance: d?.poilievre_stance ?? '',
        carney_citations: d?.carney_citations ?? [],
        poilievre_citations: d?.poilievre_citations ?? []
    }));
    const similarities = (simResult ?? []).map(s => ({
        point: s?.point ?? '',
        carney_stance: s?.carney_stance ?? '',
        poilievre_stance: s?.poilievre_stance ?? '',
        carney_citations: s?.carney_citations ?? [],
        poilievre_citations: s?.poilievre_citations ?? []
    }));

    // 4. Format Output
    const outputData: ComparisonOutput = {
        category: category,
        candidateA: { name: "Mark Carney", summary: summaryA || "[AI summary not available]" },
        candidateB: { name: "Pierre Poilievre", summary: summaryB || "[AI summary not available]" },
        comparison: {
            differences: Array.isArray(differences) ? differences : [],
            similarities: Array.isArray(similarities) ? similarities : []
        },
    };

    // 5. Validate the assembled data against the schema
    if (validate) {
        const isValid = validate(outputData);
        if (!isValid) {
            // Explicitly assert the type to access errors
            console.error(`  Validation failed for category "${category}":`, JSON.stringify((validate as any).errors, null, 2)); 
            return null; // Don't proceed with invalid data
        }
    } else {
         console.warn(`  Schema validation function not available. Skipping validation for ${category}.`);
    }

    return outputData; // Return potentially valid data
}

async function main() {
    console.log("Starting comparison generation...");

    try {
        // --- Load and Compile Schema --- 
        const ajv = new Ajv({ allErrors: true }); // Enable detailed errors
        try {
            const schemaContent = await fs.readFile(schemaPath, 'utf-8');
            const schema = JSON.parse(schemaContent);
            validate = ajv.compile(schema); // Assign compiled validator to the global variable
            console.log("Successfully loaded and compiled comparison output schema.");
        } catch (schemaError) {
             console.error("Error loading or compiling schema:", schemaError);
             console.warn("Proceeding without schema validation.");
             // validate remains undefined
        }
        // --- End Schema --- 

        // Ensure output directory exists
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        console.log(`Output directory ensured: ${OUTPUT_DIR}`);

        // Read promise data
        const carneyData = JSON.parse(await fs.readFile(CARNEY_PROMISES_PATH, 'utf-8')) as PromiseItem[];
        const poilievreData = JSON.parse(await fs.readFile(POILIEVRE_PROMISES_PATH, 'utf-8')) as PromiseItem[];
        console.log("Successfully read promise data files.");

        for (const category of CATEGORIES) {
            const categorySlug = category.toLowerCase().replace(/\s+/g, '-'); // e.g., "Healthcare" -> "healthcare"
            const outputFilePath = path.join(OUTPUT_DIR, `${categorySlug}.json`);

            const comparisonData = await generateCategoryComparison(category, carneyData, poilievreData);

            // Only write file if data is not null (i.e., passed validation or validation was skipped)
            if (comparisonData) {
                await fs.writeFile(outputFilePath, JSON.stringify(comparisonData, null, 2));
                console.log(`  Successfully generated and saved comparison for ${category} to ${outputFilePath}`);
            } else {
                 console.warn(`  Skipped writing file for category "${category}" due to validation errors or lack of data.`);
            }
        }

        console.log("Comparison generation finished."); 

    } catch (error) {
        console.error("Error during comparison generation:", error);
        process.exit(1); // Exit with error code
    }
}

main(); 
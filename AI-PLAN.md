# AI-Powered Candidate Comparison Plan

**Project Goal:**

*   When a user selects a policy category, display an AI-generated comparison showing:
    *   Summaries of each candidate's stance/policies in that category.
    *   Key differences between their approaches.
    *   Key similarities, if any.
    
*   This comparison data should be pre-generated at build time for performance using Google Gemini.

**Implementation Plan:**

1.  **Data Sources:**
    *   Use existing promise data files: `src/data/carneyPromises.json` and `src/data/poilievrePromises.json`.
    *   Utilize the schema definition in `src/data/promises_schema.json` to understand data structure (especially the `category` field).

2.  **API Key Management:**
    *   Store the Google Gemini API Key in a `.env` file at the project root: `GEMINI_API_KEY=YOUR_KEY`.
    *   Add `.env` to the `.gitignore` file to prevent committing secrets.
    *   Use the `dotenv` package in the build script to load the key into `process.env`.
    *   Configure `GEMINI_API_KEY` as an environment variable in the deployment environment(s).

3.  **Build-Time Generation Script (`scripts/generate-comparisons.ts`):**
    *   **Setup:**
        *   Create the `scripts` directory if it doesn't exist.
        *   Install necessary Node.js packages:
            *   `npm install --save-dev @google/generative-ai dotenv typescript @types/node ts-node` (or use `yarn add --dev ...`)
    *   **Logic:**
        *   Load environment variables using `dotenv`.
        *   Validate that `GEMINI_API_KEY` is present.
        *   Initialize the Gemini client (`@google/generative-ai`).
        *   Read and parse `src/data/carneyPromises.json` and `src/data/poilievrePromises.json`.
        *   Define the list of categories (from `promises_schema.json`: "Economy", "Healthcare", "Environment", "Defense", "Education", "Immigration", "Housing", "Other").
        *   Loop through each category:
            *   Filter promises from both files matching the current category.
            *   Concatenate the relevant promise text (`description` or `quote`) for each candidate within that category.
            *   Construct specific prompts for the Gemini API to:
                1.  Summarize Candidate A's promises for the category.
                2.  Summarize Candidate B's promises for the category.
                3.  Identify key differences: For each difference, describe the point of divergence and briefly state the relevant stance of each candidate that illustrates this difference. Request output as a list of objects, each containing `point`, `carney_stance`, and `poilievre_stance`.
                4.  Identify key similarities: Similarly, for each similarity, describe the point of convergence and the relevant stance/approach of each candidate. Request output as a list of objects with `point`, `carney_stance`, and `poilievre_stance`.
            *   Make API calls to Gemini for each prompt.
            *   Implement appropriate error handling and potentially retries for API calls.
            *   Structure the results into the agreed-upon JSON format.
            *   Create a URL-friendly `category_slug` (e.g., "Healthcare" -> "healthcare").
            *   Ensure the output directory `public/data/comparisons/` exists (create if needed).
            *   Write the structured JSON output to `public/data/comparisons/{category_slug}.json`.
    *   **Execution:** This script will be run *before* the main application build step.

4.  **Output Data Structure (`public/data/comparisons/{category_slug}.json`):**
    *   Each file will contain:
        ```json
        {
          "category": "Category Name", // e.g., "Healthcare"
          "candidateA": {
            "name": "Mark Carney", // Hardcode or make dynamic
            "summary": "Overall AI-generated summary for Carney..."
          },
          "candidateB": {
            "name": "Pierre Poilievre", // Hardcode or make dynamic
            "summary": "Overall AI-generated summary for Poilievre..."
          },
          "comparison": {
            "differences": [
              {
                "point": "AI-identified point of difference",
                "carney_stance": "AI summary of Carney's stance on this specific point",
                "poilievre_stance": "AI summary of Poilievre's stance on this specific point"
              }
              // ... other difference objects
            ],
            "similarities": [
              {
                "point": "AI-identified point of similarity",
                "carney_stance": "AI summary of Carney's stance on this specific point",
                "poilievre_stance": "AI summary of Poilievre's stance on this specific point"
              }
              // ... other similarity objects
            ] // Similarities array might be empty
          }
        }
        ```

5.  **Frontend Integration (`src/components/CategoryComparison.tsx` or similar):**
    *   **Trigger:** User selects a category from the UI.
    *   **Data Fetching:**
        *   Get the `category_slug` corresponding to the selected category.
        *   Construct the path: `/data/comparisons/${category_slug}.json`.
        *   Use `fetch` API (e.g., in a `useEffect` hook) to load the JSON file.
    *   **State Management:** Use `useState` to store fetched data, loading status, and errors.
    *   **Rendering:** 
        *   Display the overall AI-generated summaries (`candidateA.summary`, `candidateB.summary`).
        *   Iterate through the `comparison.differences` array. For each object, display the `point`, and underneath or alongside it, display the `carney_stance` and `poilievre_stance`.
        *   Iterate through the `comparison.similarities` array similarly, displaying the `point`, `carney_stance`, and `poilievre_stance` for each.
        *   **Below the AI comparison section,** display the original two-column list showing the individual promises for each candidate in the selected category (similar to the current implementation, likely fetching/filtering from the original `carneyPromises.json`/`poilievrePromises.json` data if needed, or incorporating promise details into the generated JSON).
        *   Handle loading/error UI for both the AI comparison and the promise list.

6.  **Build Process Integration:**
    *   Add/modify scripts in `package.json`:
        ```json
        "scripts": {
          // ... other scripts
          "generate-comparisons": "ts-node ./scripts/generate-comparisons.ts",
          "build": "npm run generate-comparisons && next build" // Adjust build command as needed (e.g., vite build)
        }
        ```
    *   Ensure the build command in the deployment pipeline runs the combined command.

**Next Steps:**

*   Implement Step 3: Create and write the `scripts/generate-comparisons.ts` file.
*   Implement Step 5: Create or modify the frontend component to fetch and display the data.
*   Implement Step 6: Update `package.json`.
*   Test the build process and the frontend display. 
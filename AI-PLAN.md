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
        *   [X] Create the `scripts` directory if it doesn't exist.
        *   [X] Install necessary Node.js packages:
            *   `npm install --save-dev @google/generative-ai dotenv typescript @types/node ts-node` (or use `yarn add --dev ...`)
        *   [X] Create `scripts/generate-comparisons.ts` with initial boilerplate (imports, constants, basic structure).
    *   **Logic:**
        *   [X] Load environment variables using `dotenv`.
        *   [X] Validate that `GEMINI_API_KEY` is present.
        *   [X] Initialize the Gemini client (`@google/generative-ai`).
        *   [X] Read and parse `src/data/carneyPromises.json` and `src/data/poilievrePromises.json`.
        *   [ ] **Enhancement:** Ensure each promise has a unique, stable `id` (verify existing fallback or add to source data).
        *   [X] Define the list of categories (from `promises_schema.json`: "Economy", "Healthcare", "Environment", "Defense", "Education", "Immigration", "Housing", "Other").
        *   [X] Loop through each category:
            *   [X] Filter promises and format input for Gemini as structured data (including `id` and text).
            *   [X] Construct specific prompts for the Gemini API to:
                1.  Summarize Candidate A's promises.
                2.  Summarize Candidate B's promises.
                3.  Identify key differences: Ask for point, stances, and citation IDs. Constraint: Only points where both have positions.
                4.  Identify key similarities: Ask for point, stances, and citation IDs. Constraint: Only points where both have positions.
            *   [X] Make API calls to Gemini for summary, diffs, and sims prompts.
            *   [X] Implement appropriate error handling.
            *   [X] Structure the results into JSON, including citation fields.
            *   [X] Create a URL-friendly `category_slug` (e.g., "Healthcare" -> "healthcare").
            *   [X] Ensure the output directory `public/data/comparisons/` exists (create if needed).
            *   [X] Write the structured JSON output to `public/data/comparisons/{category_slug}.json`.
    *   **Execution:**
        *   [X] This script will be run *before* the main application build step.
        *   [X] Successfully tested script execution locally (`npx ts-node ...`).

4.  **Output Data Structure (`public/data/comparisons/{category_slug}.json`):**
    *   Each file will contain:
        ```json
        {
          "category": "Category Name",
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
                "poilievre_stance": "AI summary of Poilievre's stance on this specific point",
                "carney_citations": ["id1", "id2"],
                "poilievre_citations": ["id3"]
              }
              // ... other difference objects
            ],
            "similarities": [
              {
                "point": "AI-identified point of similarity",
                "carney_stance": "AI summary of Carney's stance on this specific point",
                "poilievre_stance": "AI summary of Poilievre's stance on this specific point",
                "carney_citations": ["id4"],
                "poilievre_citations": ["id5", "id6"]
              }
              // ... other similarity objects
            ] // Similarities array might be empty
          }
        }
        ```

5.  **Frontend Integration (`src/pages/Index.tsx`, `src/components/TopicComparison.tsx`, `src/components/CategoryDetailView.tsx`):**
    *   **State Management (in `src/pages/Index.tsx`):**
        *   [X] Add `useState` hooks to manage the fetched AI comparison data (`comparisonData`), loading state (`isComparisonLoading`), and potential fetch errors (`comparisonError`).
        *   [X] Add derived state (e.g., using `useMemo`) to hold the filtered lists of Carney and Poilievre promises based on the `selectedCategory`.
    *   **Data Fetching (in `src/pages/Index.tsx`):**
        *   [X] Add a `useEffect` hook that runs when the `selectedCategory` state changes.
        *   [X] Inside the `useEffect`, fetch the corresponding `/data/comparisons/{categorySlug}.json` file and manage loading/error states.
    *   **Props Drilling (from `src/pages/Index.tsx` to `src/components/CategoryDetailView.tsx`):**
        *   [ ] **New:** Pass the full `carneyPromises` and `poilievrePromises` lists down to `CategoryDetailView`.
    *   **New Component (`src/components/CategoryDetailView.tsx`):**
        *   [X] Update props interface to accept full promise lists.
        *   [X] Update internal interfaces (`ComparisonPoint`) to include citation arrays.
        *   [X] Implement rendering logic:
            *   [X] Handle loading/error states.
            *   [X] Display summaries, differences, similarities.
            *   [X] Within Differences/Similarities, render citations.
            *   [X] Display the two-column raw promise list.
    *   **URL Handling (in `src/pages/Index.tsx` and `src/components/TopicComparison.tsx`):**
        *   [X] Create `handleCategorySelect` in `Index.tsx` to update state and URL (`history.pushState`).
        *   [X] Pass `handleCategorySelect` to `TopicComparison` instead of `setSelectedCategory`.
        *   [X] Update `TopicComparison` props and `onClick` handlers to use `onCategorySelect`.
        *   [X] Read `?category=` URL parameter on initial load in `Index.tsx` and set initial state.
        *   [X] Add `popstate` event listener in `Index.tsx` to handle browser back/forward navigation.
    *   **Conditional Rendering (in `src/pages/Index.tsx`):**
        *   [X] Below the `<TopicComparison />` component, add a conditional block that renders `<CategoryDetailView />` *only when* `selectedCategory` is not null.
        *   [X] Pass the required props (`comparisonData`, `isComparisonLoading`, `comparisonError`, and the derived *filtered* promise lists) to `<CategoryDetailView />`.
    *   **Rendering (`src/components/TopicComparison.tsx`):**
        *   [X] This component remains largely unchanged, focusing on category selection/overview.
        *   [X] Ensure it correctly receives and uses `selectedCategory` and `setSelectedCategory` props.
    *   **Note:** The main page (`Index.tsx`) renders the full, unfiltered promise list when no category is selected.

6.  **Build Process Integration:**
    *   [X] Add/modify scripts in `package.json`:
        ```json
        "scripts": {
          // ... other scripts
          "generate-comparisons": "ts-node ./scripts/generate-comparisons.ts",
          "build": "npm run generate-comparisons && vite build" // Adjusted for Vite
        }
        ```
    *   [X] Ensure the build command in the deployment pipeline runs the combined command.

**Next Steps:**

*   [X] Implement Step 5: Create or modify the frontend component to fetch and display the data.
*   [X] Implement Step 6: Update `package.json`.
*   [X] Test the build process and the frontend display. 
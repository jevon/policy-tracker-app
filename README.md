# Policy Tracker

A modern web application that provides an AI-powered comparison of political candidates' policy positions. Currently focused on comparing Mark Carney and Pierre Poilievre's policy stances across various categories.

## Features

- 📊 Interactive policy comparisons across multiple categories:
  - Economy
  - Housing
  - Environment
  - Healthcare
  - Immigration
  - Defense
  - Education
  - Other

- 🤖 AI-Powered Analysis
  - Automated identification of key differences and similarities
  - Smart summarization of policy positions
  - Citation tracking to source materials

- 💡 User-Friendly Interface
  - Clean, modern design
  - Responsive layout for all devices
  - Collapsible sections for better readability
  - Interactive category selection
  - Citation tooltips

## Technology Stack

- **Frontend**: React + Vite
- **Styling**: TailwindCSS
- **AI Integration**: Google's Gemini AI
- **Build Process**: TypeScript
- **Deployment**: Vercel

## Development Workflow

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google AI API Key (for Gemini)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/jevon/policy-tracker-app.git
cd policy-tracker-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
GOOGLE_AI_API_KEY=your_api_key_here
```

4. Generate the comparisons (requires Gemini API key):
```bash
npm run generate-comparisons
```

5. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Updating Comparisons

When you want to update the policy comparisons:

1. Make sure your `.env` file has the Gemini API key
2. Run the comparison generator:
```bash
npm run generate-comparisons
```
3. Review the generated files in `public/data/comparisons/`
4. Commit the changes to the repository

### Building for Production

1. Build the application:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## Project Structure

```
policy-tracker-app/
├── public/
│   └── data/
│       └── comparisons/    # Generated JSON comparison files
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   └── schemas/          # JSON schemas for data validation
└── scripts/
    └── generate-comparisons.ts  # AI-powered comparison generator
```

## Deployment

The application is configured for deployment on Vercel:

1. Push your changes to GitHub
2. Connect your repository to Vercel
3. Deploy!

Note: The comparison data is generated locally and committed to the repository. The Vercel deployment will use the pre-generated comparison files, so no API calls are needed during deployment.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Powered by [Google's Gemini AI](https://ai.google.dev/)
- Styled with [TailwindCSS](https://tailwindcss.com/)

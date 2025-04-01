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

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google AI API Key (for Gemini)

### Installation

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

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

1. Generate the comparisons:
```bash
npm run generate-comparisons
```

2. Build the application:
```bash
npm run build
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
3. Configure environment variables in Vercel
4. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Powered by [Google's Gemini AI](https://ai.google.dev/)
- Styled with [TailwindCSS](https://tailwindcss.com/)

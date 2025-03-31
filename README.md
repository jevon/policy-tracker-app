# Policy Explorer

![Policy Explorer - Carney vs Poilievre](https://github.com/jevon/policy-explorer/blob/main/public/uploads/policy-explorer-header.png?raw=true "Policy Explorer Header")

A web application that tracks and compares political promises made by Canadian leaders Mark Carney and Pierre Poilievre during the 2025 election cycle. The platform allows users to see the exact moment each promise was made through video links and transcript references.

*Last updated: March 27, 2024*

## Features

- Track promises made by Canadian political leaders in real-time
- Compare promises side-by-side with responsive mobile and desktop views
- Filter promises by category
- Search functionality to find specific promises 
- Each promise includes:
  - Description
  - Direct quote
  - Category
  - Confidence level
  - Source transcript with date
  - Video timestamp link (when available)
- Mobile-responsive design with swipeable politician views
- Interactive hover effects and smooth animations

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router (HashRouter for GitHub Pages compatibility)
- **Styling**: Tailwind CSS with custom animations and responsive design
- **Build Tool**: Vite for fast development and optimized production builds
- **Deployment**: GitHub Pages with automated GitHub Actions workflow
- **Components**: Custom components with responsive design

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Build for local testing
npm run build:local

# Preview production build
npm run preview
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components for different routes
- `src/data/` - Promise data in JSON format
- `src/hooks/` - Custom React hooks
- `public/uploads/` - Static assets like images and backgrounds

## Mobile View

The application features a special mobile view where users can:
- Switch between politicians by tapping on their names in the header
- View indicators showing which politician's promises are currently displayed
- Get a focused view of one politician's promises at a time

## Deployment

This project is automatically deployed to GitHub Pages when changes are pushed to the main branch using GitHub Actions.

The deployment workflow:
1. Builds the React application
2. Creates necessary configuration for GitHub Pages
3. Deploys the built assets to GitHub Pages

Visit the live site at: [https://jevon.github.io/](https://jevon.github.io/)

## License

All rights reserved.

## Contributors

- Jevon MacDonald

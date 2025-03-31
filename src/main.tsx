import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Depending on what's in the file, we'll add URL parameter handling code

createRoot(document.getElementById("root")!).render(<App />);

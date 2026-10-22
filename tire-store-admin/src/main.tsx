import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './design.css';
import './extra.css';
import App from './App';
import { FeedbackProvider } from './lib/feedback';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FeedbackProvider>
      <App />
    </FeedbackProvider>
  </StrictMode>,
);

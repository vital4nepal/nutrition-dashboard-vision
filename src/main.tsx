import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/tabs-fix.css'
import { DataProvider } from './context/DataContext'

createRoot(document.getElementById("root")!).render(
  <DataProvider>
    <App />
  </DataProvider>
);

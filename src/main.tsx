// starter point for vite
import App from './App'
import { createRoot } from 'react-dom/client'

//use create root
const root = document.getElementById('root')
if (root) {
  createRoot(root).render(<App />)
}

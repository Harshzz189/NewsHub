import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import {Provider} from 'react-redux'
import App from './App.jsx'
import { Store } from './Redux/Store.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
      <BrowserRouter>
        <App />
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import Inicio from '../componentes/login.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
     <BrowserRouter>
    <App></App>
    <Inicio>
    </Inicio>
    </BrowserRouter>
  </React.StrictMode>,
)

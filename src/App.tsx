import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Login from './pages/login';
import Dashboard from "./pages/dashboard";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

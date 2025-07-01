import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Catalog from './pages/catalog'
import Mybooks from './pages/mybooks'
import SignUp from "./pages/Auth/signUp"; 
import Login from "./pages/Auth/login" // or ./pages/Auth/Register
// import Login from "./pages/Auth/Login"; ← add later

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/mybooks" element={<Mybooks/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

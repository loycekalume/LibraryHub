import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Catalog from './pages/catalog'
import Mybooks from './pages/mybooks'
import SignUp from "./pages/Auth/signUp"; 
import Login from "./pages/Auth/login"
import Books from "./pages/books"
import LibrarianDashboard from "./pages/librarianDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/mybooks" element={<Mybooks/>} />
        <Route path="/librariandashboard" element={<LibrarianDashboard />} />
        <Route path="/books" element={<Books />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

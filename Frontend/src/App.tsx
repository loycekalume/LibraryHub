import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Catalog from './pages/catalog'
import Mybooks from './pages/mybooks'
import SignUp from "./pages/Auth/signUp"; 
import Login from "./pages/Auth/login"
import Books from "./pages/books"
import LibrarianDashboard from "./pages/librarianDashboard";
import Borrowers from "./pages/borrowers";
import IssueBook from "./pages/issueBook";
import Adminbook from "./pages/adminbooks"
import Adminusers from "./pages/adminUsers"
import AdminDashboard from "./pages/adminDashboard";


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
         <Route path="/borrowers" element={<Borrowers />} />
          <Route path="/issuebook" element={<IssueBook />} />
         <Route path="/adminbooks" element={<Adminbook />} />
        <Route path="/adminusers" element={<Adminusers />} />
         <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

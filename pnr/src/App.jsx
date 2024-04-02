import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Menu from "./components/menu/Menu";
import Footer from "./components/footer/Footer";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Works from "./pages/works/Works";
import Profile from "./pages/profile/Profile";
import Blog from "./pages/blog/Blog";

import ConversationChoices from "./pages/conversationchoices/ConversationChoices";
import SampleBlog from "./pages/sampleblog/SampleBlog";

import Login from "./pages/login/Login";
import SignUp from "./pages/signup/Signup";

import { AnimatePresence } from "framer-motion";

import { useAuth } from './contexts/AuthContext';


function App() {
  const location = useLocation();
  const showFooter = location.pathname !== "/";
  const { isLoggedIn } = useAuth();

  return (
    <>
    <Menu />
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={isLoggedIn ? <Navigate replace to="/home" /> : <Login />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate replace to="/home" /> : <SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/works" element={<Works />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/conversationchoices" element={<ConversationChoices />} />
        <Route path="/sample-blog" element={<SampleBlog />} />
      </Routes>
    </AnimatePresence>
    <Footer />
  </>
  );
}

export default App;

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
import SignUp from "./pages/signup/SignUp";

import DailyWritingConversation from './pages/agents/daily/DailyWritingConversation';
import ProfessionalWritingConversation from './pages/agents/professional/ProfessionalWritingConversation';
import CulturalWritingConversation from './pages/agents/cultural/CulturalWritingConversation';

import AnalysisReport from './pages/analysisreport/AnalysisReport'

import { AnimatePresence } from "framer-motion";

import { useAuth } from './contexts/AuthContext';

function App() {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const isLoginPage = location.pathname === "/login" || location.pathname === "/signup";
  
  return (
    <>
      {!isLoginPage && <Menu />}
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
          <Route path="/analysispage" element={<AnalysisReport />} />
          <Route path="/daily" element={<DailyWritingConversation />} />
          <Route path="/professional" element={<ProfessionalWritingConversation />} />
          <Route path="/cultural" element={<CulturalWritingConversation />} />
          <Route path="/sample-blog/:id" element={<SampleBlog />} />
        </Routes>
      </AnimatePresence>
      {!isLoginPage && <Footer />}
    </>
  );
}

export default App;

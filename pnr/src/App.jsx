import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Menu from "./components/menu/Menu";
import Footer from "./components/footer/Footer";
import PasswordResetForm from "./pages/password-reset/PasswordReset";

import Home from "./pages/home/Home";
import About from "./pages/about/About";
import MinimapPage from "./pages/about/MinimapPage";
import Practice from "./pages/practice/Practice";
import Profile from "./pages/profile/Profile";
import Learn from "./pages/learn/Learn";

import ConversationChoices from "./pages/conversationchoices/ConversationChoices";
import SampleBlog from "./pages/sampleblog/SampleBlog";

import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";

import Reading from './pages/reading/Reading';

import DailyWritingConversation from './pages/agents/daily/DailyWritingConversation';
import ProfessionalWritingConversation from './pages/agents/professional/ProfessionalWritingConversation';
import CulturalWritingConversation from './pages/agents/cultural/CulturalWritingConversation';

import Listening from './pages/listening/Listening'

import Speaking from './pages/speaking/Speaking'

import AnalysisReport from './pages/analysisreport/AnalysisReport'

import StatisticsPage from "./pages/statistics/StatisticsPage";

import { AnimatePresence } from "framer-motion";

import { useAuth } from './contexts/AuthContext';

function App() {
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const isLoginPage = location.pathname === "/login" || location.pathname === "/signup";
  const isPasswordResetPage = location.pathname === "/password-reset";
  
  return (
    <>
      {!isLoginPage && !isPasswordResetPage && <Menu />}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/login" element={isLoggedIn ? <Navigate replace to="/home" /> : <Login />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate replace to="/home" /> : <SignUp />} />
          <Route path="/password-reset" element={<PasswordResetForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />

          <Route path="/minimap" element={<MinimapPage />} />

          <Route path="/practice" element={<Practice />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/conversationchoices" element={<ConversationChoices />} />
          <Route path="/analysispage" element={<AnalysisReport />} />
          <Route path="/reading" element={<Reading />} />
          <Route path="/daily" element={<DailyWritingConversation />} />
          <Route path="/professional" element={<ProfessionalWritingConversation />} />
          <Route path="/cultural" element={<CulturalWritingConversation />} />
          <Route path="/listening" element={<Listening />} />
          <Route path="/speaking" element={<Speaking />} />
          <Route path="/sample-blog/:id" element={<SampleBlog />} />

          <Route path="/statistics" element={<StatisticsPage />} />
        </Routes>
      </AnimatePresence>
      {!isLoginPage && !isPasswordResetPage && <Footer />}
    </>
  );
}

export default App;

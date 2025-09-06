import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; 
import Home from "./pages/Home";
import Emergency from "./pages/Emergency";
import Contacts from "./pages/Contacts";
import About from "./pages/About";
import AiChat from "./components/AiChat";

function App() {
  const [language, setLanguage] = useState("en"); // default English

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50 urdu-text">
        <Navbar language={language} setLanguage={setLanguage} />

        {/* Main content */}
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home language={language} />} />
            <Route path="/emergency" element={<Emergency language={language} />} />
            <Route path="/contacts" element={<Contacts language={language} />} />
            <Route path="/about" element={<About language={language} />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer language={language} />
      <AiChat language={language}/>
      </div>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Emergency from "./pages/Emergency";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

function App() {
  const [language, setLanguage] = useState("en"); // default English

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar language={language} setLanguage={setLanguage} />
        <main className="w-full pt-3">
          <Routes>
            <Route path="/" element={<Home language={language} />} />
            <Route path="/emergency" element={<Emergency language={language} />} />
            <Route path="/contacts" element={<Contacts language={language} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

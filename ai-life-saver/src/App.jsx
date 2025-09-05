import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Emergency from "./pages/Emergency";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        {/* Remove extra padding so sections handle layout themselves */}
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

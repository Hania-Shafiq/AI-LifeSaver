import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // ✅ Import the footer
import Home from "./pages/Home";
import Emergency from "./pages/Emergency";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
<<<<<<< HEAD
        
        {/* Main content */}
        <main className="flex-grow p-4">
=======
        {/* Remove extra padding so sections handle layout themselves */}
        <main className="w-full">
>>>>>>> 29d4f86b0e2f4b7a3abc89a97ab51618d2814765
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;


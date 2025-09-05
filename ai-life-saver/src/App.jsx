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
{/* Main content */}
<main className="flex-grow p-4">
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


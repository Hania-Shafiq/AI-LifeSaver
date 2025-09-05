import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-red-600 text-white p-4 shadow-lg flex justify-between items-center">
      <h1 className="font-bold text-xl">AI LifeSaver</h1>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/emergency" className="hover:underline">Emergency</Link>
        <Link to="/contacts" className="hover:underline">Contacts</Link>
      </div>
    </nav>
  );
}

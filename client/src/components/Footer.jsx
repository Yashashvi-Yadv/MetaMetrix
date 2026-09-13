import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800 mt-auto">
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <span>
          &copy; {new Date().getFullYear()} Meta Metrix Analytics. All rights
          reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;

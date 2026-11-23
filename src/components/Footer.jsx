function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 text-slate-500 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🎬</span>
          <span className="font-semibold text-slate-800">MovieApp</span>
          <span className="text-slate-400">| Full Stack MERN Application</span>
        </div>
        <p className="text-slate-400 text-center">
          &copy; {new Date().getFullYear()} MovieApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

const Navbar = ({ title, subtitle, onMenuClick, accent = 'slate' }) => {
  const subtitleColor = accent === 'emerald' ? 'text-emerald-600' : 'text-slate-500';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className={`text-xs ${subtitleColor}`}>{subtitle}</p>}
        </div>
      </div>
      <div className={`text-sm ${subtitleColor}`}>Library Management System</div>
    </header>
  );
};

export default Navbar;

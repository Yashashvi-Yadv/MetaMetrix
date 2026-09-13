import { Link } from "react-router-dom";

const MetaMetrixLanding = () => {
  return (
    <div className="flex-grow flex items-center justify-center px-6 py-20 md:py-32">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
          Unlock Data Insights with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Meta Metrix
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Stop struggling with raw datasets. Seamlessly upload your CSV files
          and instantly generate powerful data analytics, visualizations, and
          actionable metrics to drive your decisions forward.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
          >
            <svg
              className="w-6 h-6 group-hover:-translate-y-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Login to Upload
          </Link>

          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl text-lg font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MetaMetrixLanding;

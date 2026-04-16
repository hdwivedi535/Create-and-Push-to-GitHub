import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, LogIn } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("himprash_admin", "true");
      navigate("/admin-panel-himprash/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#0E1117] flex items-center justify-center px-4" data-testid="admin-login-page">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-[#0A84FF] rounded-sm flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-xl font-semibold text-[#E8E8ED]" style={{ fontFamily: 'Outfit, sans-serif' }}>
            HimPrash Admin
          </span>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-[#161B22] border border-[#1F2937] rounded-lg p-6"
          data-testid="admin-login-form"
        >
          <h2 className="text-lg font-medium text-[#E8E8ED] mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Sign in to Admin Panel
          </h2>

          {error && (
            <div data-testid="login-error" className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-3 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <label className="block mb-4">
            <span className="text-xs text-[#8B8B96] uppercase tracking-wider font-medium">Username</span>
            <input
              data-testid="admin-username"
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              className="mt-1.5 w-full bg-[#0E1117] border border-[#1F2937] text-[#E8E8ED] px-3 py-2.5 text-sm rounded-md focus:outline-none focus:border-[#0A84FF]"
              placeholder="Enter username"
              autoComplete="off"
            />
          </label>

          <label className="block mb-6">
            <span className="text-xs text-[#8B8B96] uppercase tracking-wider font-medium">Password</span>
            <input
              data-testid="admin-password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="mt-1.5 w-full bg-[#0E1117] border border-[#1F2937] text-[#E8E8ED] px-3 py-2.5 text-sm rounded-md focus:outline-none focus:border-[#0A84FF]"
              placeholder="Enter password"
            />
          </label>

          <button
            data-testid="admin-login-btn"
            type="submit"
            className="w-full bg-[#0A84FF] text-white hover:bg-[#339DFF] py-2.5 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" strokeWidth={1.5} />
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

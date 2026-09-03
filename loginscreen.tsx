import { useState, useEffect } from "react";
import { Loader2, WifiOff, BatteryWarning } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [batteryDrain, setBatteryDrain] = useState(87);

  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryDrain((prev) => Math.max(1, prev - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      const trollErrors = [
        "Wrong password. Or maybe wrong email. We can't tell you which.",
        "Account not found. Did you mean to use a different app?",
        "Too many attempts. Please wait 999 hours before trying again.",
        "Password must contain: 1 uppercase, 1 lowercase, 1 number, 1 symbol, 1 hieroglyph, 1 ancient rune, and the blood of a unicorn.",
        "Server is currently on break. Please try again never.",
        "Your keyboard layout suggests you're typing wrong. Try again.",
        "Captcha failed. We couldn't verify you're human. Are you?",
      ];

      if (attempts < 3) {
        setError(trollErrors[Math.floor(Math.random() * trollErrors.length)]);
        setAttempts((prev) => prev + 1);
      } else {
        setError("FINE. We'll let you in. But we're not happy about it.");
        setTimeout(() => onLogin(), 1500);
      }
    }, 2000);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-green-950 via-emerald-900 to-lime-950 overflow-hidden relative">
      {/* Chaotic background pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(34,197,94,0.15) 20px, rgba(34,197,94,0.15) 40px)",
      }} />

      {/* Battery warning */}
      <div className={`absolute top-4 right-4 flex items-center gap-2 text-sm font-bold ${batteryDrain < 20 ? "text-red-500 animate-pulse" : "text-green-400"}`}>
        <BatteryWarning size={20} />
        Battery: {batteryDrain}%
        {batteryDrain < 20 && <span className="ml-1">PLUG IN YOUR CHARGER!!!</span>}
      </div>

      {/* Network warning */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-sm font-bold text-red-400 animate-pulse">
        <WifiOff size={20} />
        Network: Unstable
      </div>

      {/* Login card */}
      <div className="relative bg-black/60 backdrop-blur-md rounded-2xl p-8 max-w-md w-[90%] border-2 border-green-500/50 shadow-2xl hover:rotate-1 transition-transform">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-green-400 via-lime-400 to-emerald-400 bg-clip-text text-transparent animate-drift-rotate" style={{ fontFamily: "monospace" }}>
            SPOTIFY
          </h1>
          <p className="text-xs text-green-500 font-bold mt-1">...but worse</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-green-400 mb-1 block">Email (probably wrong)</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@maybe.com"
              className="w-full bg-neutral-900 text-green-300 text-sm rounded-md px-4 py-3 outline-none border border-green-500/30 focus:border-green-500 transition-colors placeholder:text-neutral-600"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-lime-400 mb-1 block">Password (definitely wrong)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter 47 characters minimum"
              className="w-full bg-neutral-900 text-green-300 text-sm rounded-md px-4 py-3 outline-none border border-lime-500/30 focus:border-lime-500 transition-colors placeholder:text-neutral-600"
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-md px-4 py-3 text-red-300 text-sm font-bold animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-lime-500 text-black font-black py-3 rounded-full hover:scale-105 hover:rotate-2 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Verifying... slowly...
              </>
            ) : (
              "LOG IN (maybe)"
            )}
          </button>

          <div className="text-center">
            <button type="button" className="text-xs text-green-400 hover:underline">
              Forgot password? Too bad.
            </button>
          </div>

          <div className="text-center text-xs text-neutral-500 mt-2">
            By clicking log in, you agree to our 847-page Terms of Service
            that nobody reads.
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-green-900 text-center">
          <p className="text-xs text-green-500 font-bold">
            Don't have an account? <span className="text-lime-400 hover:underline cursor-pointer">Sign up (we'll lose your data)</span>
          </p>
        </div>
      </div>
    </div>
  );
}

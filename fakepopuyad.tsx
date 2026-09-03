import { useState, useEffect } from "react";
import { X, Gift, AlertTriangle, Bug, Zap, Skull, TrendingUp, Star } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

export default function FakePopupAd() {
  const { showPopupAd, closePopupAd } = usePlayer();
  const [closeBtnPos, setCloseBtnPos] = useState<{ x: number; y: number } | null>(null);
  const [adRotation, setAdRotation] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  // Continuously rotate the ad for extra annoyance
  useEffect(() => {
    if (!showPopupAd) return;
    const interval = setInterval(() => {
      setAdRotation((prev) => prev + 2);
    }, 100);
    return () => clearInterval(interval);
  }, [showPopupAd]);

  if (!showPopupAd) return null;

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 3) {
      // Third click actually closes
      closePopupAd();
      setCloseBtnPos(null);
      setClickCount(0);
    } else {
      // Move the close button somewhere random
      const x = Math.random() * 200 - 100;
      const y = Math.random() * 120 - 60;
      setCloseBtnPos({ x, y });
    }
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] max-w-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="relative bg-gradient-to-br from-green-500 via-yellow-400 to-lime-500 rounded-xl p-5 w-80 shadow-2xl border-4 border-green-300 animate-pulse-slow overflow-hidden"
        style={{
          transform: `rotate(${Math.sin(adRotation * 0.05) * 3}deg)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Chaotic background sparkles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-2 left-8 text-green-700/30 text-xs font-black animate-bounce">AD</div>
          <div className="absolute bottom-8 right-4 text-yellow-700/30 text-xs font-black animate-pulse">SPONSORED</div>
        </div>

        {/* Warning badges */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="inline-flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-bounce">
            <AlertTriangle size={12} />
            CONGRATULATIONS!!!
          </div>
          <div className="inline-flex items-center gap-1 bg-green-700 text-white px-2 py-1 rounded-full text-xs font-bold animate-wiggle">
            <Bug size={12} />
            100% SAFE*
          </div>
        </div>

        {/* Main ad content */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-black text-white mb-2 drop-shadow-lg" style={{ textShadow: "2px 2px 0 #000" }}>
            You've WON a FREE iPhone 47!
          </h2>
          <p className="text-white/90 text-xs font-bold mb-3">
            You are the 1,000,000th visitor! Claim your prize NOW before it's too late!
            Only 00:00:03 seconds remaining!
          </p>

          {/* Fake gift box */}
          <div className="bg-white/30 rounded-lg p-3 mb-3 relative overflow-hidden">
            <Gift size={36} className="mx-auto text-white drop-shadow-lg animate-bounce" />
            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-black px-2 py-1 rounded-bl-lg">
              -99% OFF
            </div>
          </div>

          {/* Fake stats */}
          <div className="flex items-center justify-center gap-3 mb-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-white">
              <TrendingUp size={12} />
              8.4B downloads
            </span>
            <span className="flex items-center gap-1 text-white">
              <Star size={12} fill="currentColor" />
              0.2 stars
            </span>
            <span className="flex items-center gap-1 text-white">
              <Skull size={12} />
              100% virus
            </span>
          </div>

          {/* Claim button */}
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-black text-sm px-6 py-3 rounded-full shadow-xl animate-pulse cursor-pointer w-full"
          >
            CLAIM NOW!!! (Definitely not a virus)
          </button>

          {/* Fake secondary buttons */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={(e) => { e.stopPropagation(); }}
              className="flex-1 bg-green-700 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-full animate-wiggle"
            >
              <Zap size={10} className="inline mr-1" />
              Install Toolbar
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); }}
              className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold py-2 rounded-full"
            >
              Accept All Cookies
            </button>
          </div>
        </div>

        {/* Tiny hidden close button - needs 3 clicks */}
        <button
          onClick={handleCloseClick}
          className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
          style={{
            transform: closeBtnPos ? `translate(${closeBtnPos.x}px, ${closeBtnPos.y}px)` : "none",
            transition: "transform 0.3s ease-out",
            fontSize: "8px",
          }}
          title={clickCount === 0 ? "Close" : clickCount === 1 ? "Ha! Try again" : "One more time..."}
        >
          <X size={10} />
        </button>

        {/* Footer warnings */}
        <div className="text-center text-green-900/60 text-[8px] font-bold leading-tight mt-2">
          *Not actually safe. By clicking you accept our 847-page ToS.
          Your data has already been sold. Song will play after you close this.
          {clickCount > 0 && clickCount < 3 && (
            <span className="block text-red-800 mt-1 animate-pulse">
              Close button moved! {3 - clickCount} more click(s) to go...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

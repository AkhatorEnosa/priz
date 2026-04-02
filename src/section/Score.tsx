import { useContext, useState } from 'react';
import useSound from 'use-sound';
import clickSfx from '../assets/sfx/mouse-click.mp3';
import { AppContext } from '../context/AppContextDefinition';

interface Props {
  words: string[];
  restart: () => void;
  exit: () => void;
  getHighestScore: () => { score: number; level: number; solved: number };
}

const Score = ({ restart, exit, words, getHighestScore } : Props) => {
  const { gameState, score, wordsSolved, difficulty } = useContext(AppContext);
  const [copied, setCopied] = useState(false);

  // sound effects
  const [playClick] = useSound(clickSfx, { volume: 1 });

  // share logic
  const handleShare = async () => {
    playClick();
    const accuracy = Math.floor((wordsSolved / words.length) * 100);
    const shareText = `🧩 I just scored ${score.toLocaleString()} points on PrizQuiz! \n🏆 Solved: ${wordsSolved}/${words.length} words on ${difficulty} level with (${accuracy}% accuracy.)\nCan you beat my score?`;
    
    //  Web Share API (Mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My PrizQuiz Score',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to Clipboard (Desktop)
      try {
        await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset message after 2s
      } catch (err) {
        console.error('Failed to copy!', err);
      }
    }
  };

  return (
    <main className="relative z-10 pb-5 w-full max-w-md">
      {gameState === 'FINISHED' && (
        <>
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            
            {/* Header Area */}
            <div className="text-center space-y-2">
              <div className="inline-block px-3 py-1 bg-teal-400/10 border border-teal-400/20 rounded-full text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-4">
                Session Complete
              </div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter">PERFORMANCE</h1>
            </div>

            {/* Stats Card */}
            <div className="bg-[#1A1D23] rounded-[2.5rem] p-10 shadow-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute -right-8 bottom-8 opacity-[0.03] rotate-12">
                <span className="text-[12rem] font-black">PRIZRIZ</span>
              </div>

              <div className="relative z-10 space-y-10">
                <div className="text-center">
                  <span className="text-[10px] text-gray-500 font-bold tracking-[0.4em] uppercase">Total Points</span>
                  <div className={`text-7xl font-black ${getHighestScore() && score >= getHighestScore()?.score ? "text-[#fad410]" : "text-white"} mt-2 tabular-nums`}>
                    {score.toLocaleString()}
                  </div>
                </div>

                <div className="flex justify-between border-t border-white/5 pt-8">
                  <div className="text-center">
                    <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase block">Accuracy</span>
                    <span className="text-xl font-bold text-teal-400">
                      {Math.floor((wordsSolved/words.length) * 100) + "%"}
                    </span>
                  </div>
                  <div className="w-[1px] bg-white/5" />
                  <div className="text-center">
                    <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase block">Solved</span>
                    <span className="text-xl font-bold text-teal-400">{wordsSolved + "/" + words.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={restart}
                className="w-full py-5 bg-white text-black font-black text-sm rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
              >
                Restart Session
              </button>
              <button 
                onClick={exit}
                className="w-full py-5 bg-[#252932] text-white font-black text-sm rounded-2xl border border-white/5 hover:bg-[#2e333d] transition-all uppercase tracking-widest"
              >
                Exit to Menu
              </button>
            </div>

            {/* Share Option - Updated with logic */}
            <div className="text-center">
              <button 
                onClick={handleShare}
                className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 ${copied ? 'text-teal-400' : 'text-gray-600 hover:text-teal-400'}`}
              >
                {copied ? '✓ Copied to Clipboard' : 'Share Result'}
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default Score;
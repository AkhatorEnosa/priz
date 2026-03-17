import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Score = () => {
  const { gameState, score, wordsSolved, resetGame, setGameState } = useContext(AppContext);

  return (

      <main className="relative z-10 w-full max-w-md">
        
        {/* SCORE COMPONENT */}
        {gameState === 'FINISHED' && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            
            {/* Header Area */}
            <div className="text-center space-y-2">
              <div className="inline-block px-3 py-1 bg-teal-400/10 border border-teal-400/20 rounded-full text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-4">
                Session Complete
              </div>
              <h1 className="text-5xl font-black italic tracking-tighter">PERFORMANCE</h1>
            </div>

            {/* Stats Card */}
            <div className="bg-[#1A1D23] rounded-[2.5rem] p-10 shadow-2xl border border-white/5 relative overflow-hidden">
              {/* Decorative Background Icon */}
              <div className="absolute -right-8 -bottom-8 opacity-[0.03] rotate-12">
                <span className="text-[12rem] font-black">P</span>
              </div>

              <div className="relative z-10 space-y-10">
                {/* Main Score Display */}
                <div className="text-center">
                  <span className="text-[10px] text-gray-500 font-bold tracking-[0.4em] uppercase">Total Points</span>
                  <div className="text-7xl font-black text-white mt-2 tabular-nums">
                    {score.toLocaleString()}
                  </div>
                </div>

                {/* Secondary Stats Row */}
                <div className="flex justify-between border-t border-white/5 pt-8">
                  <div className="text-center">
                    <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase block">Accuracy</span>
                    <span className="text-xl font-bold text-teal-400">94%</span>
                  </div>
                  <div className="w-[1px] bg-white/5" />
                  <div className="text-center">
                    <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase block">Solved</span>
                    <span className="text-xl font-bold text-teal-400">{wordsSolved}</span>
                  </div>
                  <div className="w-[1px] bg-white/5" />
                  <div className="text-center">
                    <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase block">Rank</span>
                    <span className="text-xl font-bold text-teal-400">Elite</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={resetGame}
                className="w-full py-5 bg-white text-black font-black text-sm rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest"
              >
                Restart Session
              </button>
              <button 
                onClick={() => setGameState('START')}
                className="w-full py-5 bg-[#252932] text-white font-black text-sm rounded-2xl border border-white/5 hover:bg-[#2e333d] transition-all uppercase tracking-widest"
              >
                Exit to Menu
              </button>
            </div>

            {/* Share Option */}
            <div className="text-center">
              <button className="text-[10px] text-gray-600 hover:text-teal-400 font-bold uppercase tracking-[0.3em] transition-colors">
                Share Result
              </button>
            </div>
          </div>
        )}
      </main>
  );
}

export default Score;
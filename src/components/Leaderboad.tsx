import React from 'react';
import { Trophy, Medal, User, Crown } from 'lucide-react';

const MOCK_LEADERS = [
  { id: 1, name: "CYBER_PUNK", score: 125400, accuracy: 98, rank: 1 },
  { id: 2, name: "WORD_WIZARD", score: 112000, accuracy: 94, rank: 2 },
  { id: 3, name: "LEXICON_PRO", score: 98500, accuracy: 91, rank: 3 },
  { id: 4, name: "TYPER_X", score: 85000, accuracy: 88, rank: 4 },
  { id: 5, name: "GHOST_USER", score: 72000, accuracy: 85, rank: 5 },
  { id: 6, name: "REACT_DEV", score: 64000, accuracy: 82, rank: 6 },
  { id: 7, name: "NODE_MASTER", score: 55000, accuracy: 80, rank: 7 },
];

const Leaderboard = () => {
  const currentUser = { name: "YOU", score: 42000, accuracy: 78, rank: 12 };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2">
          <Crown size={12} /> Global Rankings
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">Hall of Fame</h1>
      </div>

      {/* Leaderboard Container */}
      <div className="bg-[#1A1D23] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col h-[500px]">
        
        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="space-y-3">
            {MOCK_LEADERS.map((player) => (
              <div 
                key={player.id} 
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  player.rank <= 3 
                    ? 'bg-white/5 border-white/10 shadow-lg' 
                    : 'bg-transparent border-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className="w-8 flex justify-center">
                    {player.rank === 1 && <Trophy size={20} className="text-amber-400" />}
                    {player.rank === 2 && <Medal size={20} className="text-slate-300" />}
                    {player.rank === 3 && <Medal size={20} className="text-amber-700" />}
                    {player.rank > 3 && <span className="text-xs font-black text-gray-600">{player.rank}</span>}
                  </div>
                  
                  {/* Player Info */}
                  <div>
                    <div className="text-sm font-black tracking-wide uppercase">{player.name}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">{player.accuracy}% Accuracy</div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-lg font-black tabular-nums text-teal-400">
                    {player.score.toLocaleString()}
                  </div>
                  <div className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Points</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky User Row (Your Rank) */}
        <div className="p-6 bg-[#252932] border-t border-white/10">
          <div className="flex items-center justify-between p-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl">
             <div className="flex items-center gap-4">
                <div className="w-8 text-center text-xs font-black text-teal-400">#{currentUser.rank}</div>
                <div>
                  <div className="text-sm font-black tracking-wide uppercase text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-teal-500/70 font-bold uppercase">Current Session</div>
                </div>
             </div>
             <div className="text-right">
                <div className="text-lg font-black tabular-nums text-white">
                  {currentUser.score.toLocaleString()}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Back Action */}
      <button className="w-full py-4 text-[10px] text-gray-600 hover:text-white font-black uppercase tracking-[0.3em] transition-colors">
        Return to Menu
      </button>
    </div>
  );
};

export default Leaderboard;
import { Trophy, X } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { useLeaderboard } from '../hooks/useLeaderboard';

// const MOCK_LEADERS = [
//   { id: 1, name: "CYBER_PUNK", score: 125400, accuracy: 98, rank: 1 },
//   { id: 2, name: "WORD_WIZARD", score: 112000, accuracy: 94, rank: 2 },
//   { id: 3, name: "LEXICON_PRO", score: 98500, accuracy: 91, rank: 3 },
//   { id: 4, name: "TYPER_X", score: 85000, accuracy: 88, rank: 4 },
//   { id: 5, name: "GHOST_USER", score: 72000, accuracy: 85, rank: 5 },
//   { id: 6, name: "REACT_DEV", score: 64000, accuracy: 82, rank: 6 },
//   { id: 7, name: "NODE_MASTER", score: 55000, accuracy: 80, rank: 7 },
// ];

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const Leaderboard = ({ isOpen, onClose }: LeaderboardProps) => {
  const { data: scores, isLoading } = useLeaderboard();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed w-screen h-screen top-0 left-0 flex items-center justify-center z-200'>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed w-screen h-screen top-0 left-0 backdrop-blur-md bg-black/60"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-[90%] max-w-md z-70 bg-[#1a1d23] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Trophy className="text-yellow-500" size={20} />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-white">Global Ranking</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Leaderboard List */}
              <div className="space-y-2 max-h-100 overflow-y-auto custom-scrollbar">
                {
                  isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <div key={i} className="h-14 w-full bg-white/5 animate-pulse rounded-xl" />
                    ))
                  )  : 
                    scores !== undefined && scores.length <= 0 ?
                      <div className='w-full text-center text-[10px] flex justify-center  text-gray-500 uppercase font-bold tracking-widest p-4 rounded-xl border bg-[#252932] border-white/5'><span>No Ranking Data</span></div> :
                  (
                    scores?.map((entry, index) => {
                      // Helper to return trophy based on rank
                      const getRankDisplay = (i: number) => {
                        switch (i) {
                          case 0: return "🥇";
                          case 1: return "🥈";
                          case 2: return "🥉";
                          default: return i + 1;
                        }
                      };

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center justify-between p-4 rounded-xl border ${
                            index === 0 ? 'bg-[#fad410]/10 border-[#fad410]/30 shadow-lg shadow-[#fad410]/5' :
                            index === 1 ? 'bg-[#bababa]/10 border-[#bababa]/30 shadow-lg shadow-[#bababa]/5' :
                            index === 2 ? 'bg-[#bd652a]/10 border-[#bd652a]/30 shadow-lg shadow-[#bd652a]/5' :
                                          'bg-[#252932] border-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Trophy Column */}
                            <span className={`w-8 text-center font-bold text-lg ${index === 0 ? 'scale-150' : index === 1 ? 'scale-125' : index === 2 ? 'scale-110' : 'text-gray-500 text-sm'}`}>
                              {getRankDisplay(index)}
                            </span>

                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-200 capitalize">
                                  {entry.username}
                                </span>
                                {/* Optional: Add a small crown for #1 next to name */}
                                {index === 0 && <span className="text-[10px] opacity-80">👑</span>}
                              </div>
                              <span className="text-[10px] text-gray-500 uppercase tracking-tighter">
                                {entry.solved} Words Solved
                              </span>
                            </div>
                          </div>

                          {/* Difficulty Badge */}
                          <span className={`w-fit py-1 px-2 uppercase text-[10px] font-bold rounded-full ${
                            entry.level === 0 ? "bg-green-400/10 border border-green-500/50 text-green-500" : 
                            entry.level === 1 ? "bg-blue-400/10 border border-blue-500/50 text-blue-500" : 
                            "bg-orange-400/10 border border-orange-500/50 text-orange-500"
                          }`}>
                            {entry.level === 0 ? "Beginner" : entry.level === 1 ? "Intermediate" : "Expert"}
                          </span>

                          <div className="flex flex-col items-end">
                            <span className={`text-lg font-mono font-black ${
                              index === 0 ? 'text-[#fad410]' :
                              index === 1 ? 'text-[#bababa]' :
                              index === 2 ? 'text-[#bd652a]' :
                              'text-white'
                            }`}>
                              {entry.score.toLocaleString()}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })
                  )
                }
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#252932]/50 p-4 text-center border-t border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                Updated in real-time
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Leaderboard;
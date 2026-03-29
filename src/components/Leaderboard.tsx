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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-60"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md z-70 bg-[#1a1d23] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
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
                    scores?.map((entry, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center justify-between p-4 rounded-xl border ${
                          index === 0 ? 'bg-teal-500/10 border-teal-500/20' : 'bg-[#252932] border-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-6 text-center font-bold ${index < 3 ? 'text-teal-400' : 'text-gray-500'}`}>
                            {index + 1}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-200">{entry.username}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">
                              {entry.solved} Words Solved
                            </span>
                          </div>
                        </div>

                        {/* level */}
                        <span className={`w-fit py-1 px-2 uppercase text-[10px] rounded-full ${entry.level === 0 ? "bg-green-400/20 border border-green-600 text-green-600" : entry.level === 1 ? "bg-blue-400/20 border border-blue-600 text-blue-600" : "bg-orange-400/20 border border-orange-600 text-orange-600"}`}>{entry.level === 0 ? "Beginner" : entry.level === 1 ? "Intermediate" : "Expert"}</span>

                        <div className="flex flex-col items-end">
                          <span className="text-lg font-mono font-black text-white">
                            {entry.score.toLocaleString()}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )
                }
              </div>
            </div>

            {/* Footer */}
            {/* <div className="bg-[#252932]/50 p-4 text-center border-t border-white/5">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                Updated in real-time
              </p>
            </div> */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Leaderboard;
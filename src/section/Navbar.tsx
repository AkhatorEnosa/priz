import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, User as UserIcon, LogOut } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { useMyScores } from '../hooks/useMyScores';
import Tooltip from '../components/Tooltip';

export const Navbar = ({ setShowLeaderboard }: { setShowLeaderboard: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { username, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: myScores, isLoading: isLoadingScores } = useMyScores()

  const getHighestScore = () => {
    if (myScores && myScores.length > 0) {
      return myScores?.reduce((prev, current) => (prev.score > current.score) ? prev :  current)
    } else {
      return null
    }
  }

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 w-screen px-6 py-4 lg:px-10 lg:py-8 flex justify-between items-center backdrop-blur-sm border-white/5 z-50"
    >
      <Logo />

      <div className="flex items-center gap-6">
        {/* Score Display */}
        <div className="relative group hidden sm:flex items-center gap-4 bg-[#252932] border border-white/5 px-4 py-2 rounded-full">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Personal Record</span>
          <span className="text-lg font-mono font-bold text-teal-400">
            {isLoadingScores ? 
              <div className="h-10 w-32 bg-gray-700 animate-pulse rounded-full" /> :
              getHighestScore() == null ? 0 : getHighestScore().score
            }
          </span>
          {getHighestScore() && <Tooltip
            description={`Scored ${getHighestScore().score} in ${getHighestScore().level === 0 ? "Beginner" : getHighestScore().level === 1 ? "Intermediate" : "Expert"} level and you solved ${getHighestScore().solve} puzzles.`}
          />}
        </div>

        {/* User Identity Chip + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {username ? (
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 bg-[#252932] hover:bg-[#2d323d] border border-white/5 px-4 py-2 rounded-full shadow-inner transition-colors cursor-pointer group"
            >
              <div className="flex flex-col items-end leading-none">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-teal-400 transition-colors font-bold">
                  {username}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/10 group-hover:border-teal-500/50">
                <UserIcon size={14} className="text-gray-400 group-hover:text-teal-400" />
              </div>
            </button>
          ) : isLoading && (
            <div className="h-10 w-32 bg-gray-700 animate-pulse rounded-full" />
          )}

          { isDropdownOpen && <div className='fixed inset-0 h-screen' onClick={() => setIsDropdownOpen(!isDropdownOpen)}></div> }

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-48 bg-[#1a1d23] border border-white/10 rounded-2xl shadow-2xl p-2 z-60 overflow-hidden"
              >
                {/* <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="text-[9px] uppercase font-black text-gray-500 tracking-widest">Account Type</p>
                  <p className="text-[11px] text-teal-400 font-bold uppercase">Stealth Mode</p>
                </div> */}

                {/* <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors text-left">
                  <UserCircle size={16} /> <span>Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors text-left">
                  <Settings size={16} /> <span>Settings</span>
                </button> */}
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 rounded-lg transition-colors text-left"
                  onClick={() => setShowLeaderboard(prev => !prev)}
                >
                  <Trophy size={16} /> <span>See Leaderboard</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors text-left mt-1">
                  <LogOut size={16} /> <span>Log out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Leaderboard Trigger */}
        {/* <button 
          className="group relative p-2 text-gray-400 hover:text-teal-400 transition-colors"
          onClick={() => setShowLeaderboard(prev => !prev)}
        >
          <Trophy size={20} />
          <Tooltip description='See Leaderboard' />
        </button> */}
      </div>
    </motion.nav>
  );
};
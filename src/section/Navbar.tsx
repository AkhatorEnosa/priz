import { motion } from 'framer-motion';
import { Trophy, User as UserIcon} from 'lucide-react';
import Logo from '../components/Logo';
import Tooltip from '../components/Tooltip';
import { useAuth } from '../hooks/useAuth';

export const Navbar = ({ currentScore, setShowLeaderboard }: { currentScore: number, setShowLeaderboard: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const { username, isLoading } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 w-screen px-6 py-4 lg:px-10 lg:py-8 flex justify-between items-center backdrop-blur-sm border-white/5 z-50"
    >
      {/* Logo Section */}
      <Logo />

      {/* Stats & Profile Section */}
      <div className="flex items-center gap-6">
        {/* Score Display */}
        <div className="hidden sm:flex items-center gap-4 bg-[#252932] border border-white/5 px-4 py-2 rounded-full">
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">HighScore</span>
          <span className="text-lg font-mono font-bold text-teal-400">
            {currentScore.toLocaleString()}
          </span>
        </div>

        {/* User Identity Chip */}
        {
            username ? 
            <div className="flex items-center gap-3 bg-[#252932] border border-white/5 px-4 py-2 rounded-full shadow-inner">
                <div className="flex flex-col items-end leading-none">
                    <>
                        <span className="text-[9px] uppercase text-gray-500 font-bold mb-1">Stealth Mode</span>
                        <span className="text-sm font-medium text-gray-200">@{username}</span>
                    </>
                </div>
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-white/10">
                    <UserIcon size={14} className="text-gray-400" />
                </div>
            </div> : isLoading &&
            <div className="h-3 w-20 bg-gray-700 animate-pulse rounded" />
        }

        {/* Leaderboard Trigger (Icon only for stealth) */}
        <button className="group relative p-2 text-gray-400 hover:text-teal-400 transition-colors"
            onClick={() => setShowLeaderboard(prev => !prev)}
        >
          <Trophy size={20} />
          <Tooltip 
            description='See Leaderboard'
          />
        </button>
      </div>
    </motion.nav>
  );
};
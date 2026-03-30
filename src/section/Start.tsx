import { ArrowRight, Gamepad2, ScrollText, Trophy } from 'lucide-react'
import Tooltip from '../components/Tooltip';
import { DIFFICULTY_LIST } from '../constant/difficulty';
import { motion } from 'framer-motion';

interface StartProps {
    setShowRules: React.Dispatch<React.SetStateAction<boolean>>;
    username: string | null;
    isLoadingScores: boolean;
    getHighestScore: () => { score: number; level: number; solve: number };
    setDifficulty: React.Dispatch<React.SetStateAction<number>>;
    difficulty: number;
    setWordsCount: React.Dispatch<React.SetStateAction<number>>;
    wordsCount: number;
    setGameState: React.Dispatch<React.SetStateAction<string>>;
}


const Start = ({username, isLoadingScores, getHighestScore, difficulty, wordsCount, setDifficulty, setWordsCount, setShowRules, setGameState } : StartProps) => {
  return (
    
          <div className="space-y-8 text-center max-w-md mx-auto">
            {/* TOP HERO ICON (Adds visual height) */}
            <div className="-mb-5 z-10 relative">
              <div className="mx-auto size-16 bg-teal-500/20 border border-teal-500/30 rounded-2xl rotate-12 flex items-center justify-center shadow-2xl shadow-teal-500/20">
                <Gamepad2 className="size-8 text-teal-400 -rotate-12" />
              </div>
            </div>

            <div className='w-full relative flex flex-col divide-y divide-white/5 bg-[#1A1D23] rounded-[2.5rem] p-8 shadow-2xl border border-white/5 pt-12'>
              
              {/* Rules Trigger Button */}
              <button 
                onClick={() => setShowRules(true)}
                className="group absolute right-6 top-6 size-10 flex justify-center items-center text-gray-500 hover:text-teal-400 transition-colors"
              >
                <ScrollText className="size-5" />
                <Tooltip description='How to play' />
              </button>

              {/* PLAYER IDENTIFICATION (New Section) */}
              <div className="pb-8 flex flex-col items-center">
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-1">Authenticated as</span>
                <h2 className="text-xl font-black text-white capitalize tracking-tight">
                  {username || "Pilot"}
                </h2>
                <div className="mt-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 flex items-center gap-2">
                  <Trophy className="size-3 text-yellow-500" />
                  <div className="text-[10px] font-bold text-gray-400">BEST: {isLoadingScores ? 
                    <span className="h-10 w-32 bg-gray-700 animate-pulse rounded-full" /> :
                    getHighestScore() == null ? 0 : getHighestScore().score.toLocaleString()
                  }</div>
                </div>
              </div>
              
              {/* Difficulty Selection */}
              <div className="flex flex-col items-center gap-4 py-8">
                <span className="text-[9px] text-teal-500 tracking-[0.3em] uppercase font-black">Choose Challenge</span>
                <div className="grid grid-cols-3 gap-3 w-full">
                  {DIFFICULTY_LIST.map((level) => (
                    <button
                      key={level.code}
                      onClick={() => setDifficulty(level.code)}
                      className={`group flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${
                        difficulty === level.code 
                          ? 'border-teal-400/50 text-teal-400 bg-teal-400/10 shadow-[0_0_20px_rgba(45,212,191,0.1)]' 
                          : 'border-white/5 text-gray-600 hover:border-white/10 hover:bg-white/5'
                        }`
                      }
                    >
                      <span className="text-[10px] font-black uppercase tracking-tighter">{level.title}</span>
                      <div className={`size-1 rounded-full ${difficulty === level.code ? 'bg-teal-400' : 'bg-transparent'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Word Count Selection */}
              <div className="flex flex-col items-center gap-4 py-8">
                <span className="text-[9px] text-teal-500 tracking-[0.3em] uppercase font-black">Game Length</span>
                <div className="flex justify-center gap-6">
                  {[5, 10, 20].map((count) => (
                    <button
                      key={count}
                      onClick={() => setWordsCount(count)}
                      className={`relative flex flex-col items-center transition-all ${
                        wordsCount === count ? 'text-white scale-110' : 'text-gray-600 hover:text-gray-400'
                      }`}
                    >
                      <span className="text-xl font-black tracking-tighter">{count}</span>
                      <span className="text-[8px] uppercase font-bold tracking-widest -mt-0.5">Words</span>
                      {wordsCount === count && (
                        <motion.div layoutId="underline" className="absolute -bottom-2 h-1 w-4 bg-teal-400 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setGameState('PLAYING')}
              className="group w-full py-6 bg-white text-black font-black text-xl rounded-full shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              START MISSION
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
  )
}

export default Start
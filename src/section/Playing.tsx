import { AnimatePresence, motion } from "framer-motion";
import type { LetterProps } from "../utils/types";
import { transformItemToObj } from "../utils/transformItemToObj";
import Tooltip from "../components/Tooltip";
import { ArrowBigRight, Eye, Shuffle } from "lucide-react";
import useSound from "use-sound";
import clickSfx from '../assets/sfx/mouse-click.mp3';
import { useContext } from "react";
import { AppContext } from "../context/AppContextDefinition";

interface PlayingProps {
    score: number;
    index: number;
    words: string[] | null;
    difficulty: number;
    timer: number;
    loading: boolean;
    word: string;
    shuffledWord: LetterProps[];
    showWord: boolean;
    inputValue: string;
    correctAnswer: number;
    usedIndices: string[];
    wordsCount: number;
    pointsToAdd: number;
    setShuffledWord: React.Dispatch<React.SetStateAction<LetterProps[]>>;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    handleLetterClick: (char: string, id: string) => void;
    shuffleWord: (word: string) => LetterProps[];
    revealWord: () => void;
    skipWord: () => void;
    reset: () => void;
}

const Playing = ({ score, index, words, difficulty, timer, loading, word, shuffledWord, showWord, inputValue, correctAnswer, usedIndices, wordsCount, pointsToAdd, setInputValue, setShuffledWord, handleLetterClick, shuffleWord, revealWord, skipWord, reset }: PlayingProps) => {
    const { isMuted } = useContext(AppContext);
    const [playClick] = useSound(clickSfx, { volume: isMuted ? 0 : 1 });
  
    return (
        <div className="space-y-6 pb-10 text-center">
        {loading ?
            <div className="h-[65vh] flex flex-col items-center justify-center gap-10 overflow-hidden">
                {/* Ambient Background Glow */}
                <div className="bg-teal-500/10 rounded-full blur-[120px] animate-pulse" />

                <div className="relative flex flex-col items-center">
                    {/* Animated Icon/Graphic */}
                    <div className="flex justify-center gap-4 mb-8 relative">
                    <div className="size-5 border-t-2 border-r-2 border-teal-400 rounded-full animate-spin" />
                    <span className="text-sm font-black italic tracking-[0.3em] text-white uppercase animate-pulse">
                        Loading
                    </span>
                    </div>
                </div>
            </div> :
            <> 
                {/* Score & Timer HUD */}
                <div className="flex justify-center items-center gap-4 flex-wrap">
                    <div className="text-[10px] font-bold tracking-widest text-teal-400 uppercase">
                        Score <span className="text-white">{score}</span>
                    </div>
                    <div className="text-[10px] font-bold tracking-widest text-teal-400 uppercase">
                        Count <span className="text-white">{`${index + 1}/${words?.length}`}</span>
                    </div>
                    <div className="text-[10px] font-bold tracking-widest text-teal-400 uppercase">
                        Level <span className="text-white">{difficulty === 0 ? 'BEGINNER' : difficulty === 1 ? 'INTERMEDIATE' : 'EXPERT'}</span>
                    </div>
                    <div className="text-[10px] font-bold tracking-widest text-teal-400 uppercase">
                        Timer <span className="text-white">{`${timer > 59 ? "01:00" : `00:${timer < 10 ? `0${timer}` : timer}`}`}</span>
                    </div>
                </div>

                {/* Main Interface */}
                <div className={`bg-[#1A1D23] rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/5 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                    

                <div className={`flex justify-center gap-2 mb-8 flex-wrap`}>
                    <AnimatePresence mode="popLayout">
                    {wordsCount > 0 && (showWord ? transformItemToObj(word) : shuffledWord).map((obj: LetterProps, i: number) => {
                        const isUsed = usedIndices.includes(obj.id);
                        return (
                        <motion.button
                            key={obj.id}
                            className={`
                            group relative flex items-center justify-center font-black
                            ${isUsed ? "text-gray-400" : "text-teal-400"} uppercase
                            bg-[#252932] rounded-xl border border-white/5 shadow-inner
                            transition-all duration-200
                            ${shuffledWord.length > 6
                                ? 'w-10 h-12 text-xl sm:w-12 sm:h-14 sm:text-2xl'
                                : 'w-14 h-16 text-3xl'}
                            `}
                            initial={{ scale: 0.3, opacity: 0, y: -10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: "tween", ease: "circInOut", duration: 0.04, delay: i * 0.05 }}
                            onClick={() => handleLetterClick(obj.char, obj.id)}
                            disabled={showWord}
                        >
                            {obj.char}
                            {showWord && <Tooltip
                            description={"You have reveal word. Skip to next word."}
                            />}
                        </motion.button>
                        )
                    })}
                    </AnimatePresence>
                </div>

                {/* Interaction & Input Container */}
                <div className="space-y-6">
                    <div className="relative w-full flex justify-center items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                        className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-text"
                        maxLength={word?.length}
                        disabled
                        autoFocus
                    />

                    <div className="flex gap-2 w-full justify-center">
                        {Array.from({ length: word?.length || 0 }).map((_, i) => {
                        const char = inputValue[i];
                        const isActive = inputValue.length === i;

                        return (
                            <div
                            key={i}
                            className={`
                                flex items-center justify-center rounded-lg transition-all duration-200
                                ${shuffledWord.length > 8 ? 'w-8 h-12 text-2xl' : 'w-12 h-16 text-4xl'}
                                font-black uppercase
                                ${correctAnswer === 2 ? "bg-red-500/20 border-red-500 text-red-500 animate-shake" : 
                                correctAnswer === 1 ? "bg-green-500/20 border-green-500 text-green-500" : 
                                char ? "bg-[#255f6f] border-[#114f60] text-white" : "bg-gray-800/50 border-gray-800 text-gray-500"}
                                ${isActive && !showWord ? "border-teal-400 ring-2 ring-teal-400/20" : ""}
                            `}
                            >
                            {char || ""}
                            </div>
                        );
                        })}
                    </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-1 gap-2">
                        <button 
                            className={`relative group flex-1 py-4 px-4 flex items-center justify-center bg-[#252932] ${showWord ? "" : "hover:bg-[#2e333d]"} border border-white/5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase`}
                            onClick={() => {
                                setShuffledWord(shuffleWord(word ?? ''))
                                playClick()
                            }}
                            disabled={showWord}
                        >
                            <Shuffle className={`text-gray-600 ${showWord ? "" : "group-hover:text-teal-400"} transition-colors`}/>
                            
                            <Tooltip
                                description={"Shuffle the letters for a fresh perspective"}
                            />
                        </button>
                        
                        <button 
                            className={`relative group flex-1 py-4 px-4 flex items-center justify-center bg-[#252932] ${showWord ? "" : "hover:bg-[#2e333d]"} border border-white/5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase`}
                            onClick={revealWord}
                        >
                            <Eye className={`text-gray-600 ${showWord ? "text-teal-400" : "group-hover:text-teal-400"} transition-colors`} />
                            
                            <Tooltip
                                description={"Reveal the hidden word"}
                            />
                        </button>

                        <button 
                            className={`relative group flex-1 py-4 px-4 flex items-center justify-center bg-[#252932] hover:bg-[#2e333d] border border-white/5 rounded-xl text-[10px] font-black  tracking-widest transition-all uppercase`}
                            onClick={skipWord}
                        >
                            <div className={`absolute left-0 rounded-xl top-0 w-full h-full ${showWord && "animate animate-pulse bg-teal-400/40"} z-30`}></div>
                            <ArrowBigRight className={`relative ${showWord ? "text-white/50" : "text-gray-600"} group-hover:text-teal-400 transition-colors z-50`} />
                        
                            <Tooltip
                                description={`Give up on this word and move to the next one. ${difficulty === 2 ? `(Penalty: - ${pointsToAdd} points)` : ""}`}
                            />
                        </button>
                    </div>
                    
                    {/* <button 
                        className="flex-[1.5] py-4 bg-[#255f6f] hover:bg-[#2d7386] disabled:bg-gray-800 disabled:text-gray-600 text-white font-black rounded-xl transition-al uppercase tracking-widest text-sm"
                        onClick={handleSubmit}
                        disabled={loading || inputValue.length === 0 || showWord}
                    >
                        Submit
                    </button> */}
                    </div>
                </div>
                </div>
                
                <button 
                    onClick={reset}
                    className="w-full text-[10px] text-gray-600 hover:text-gray-400 font-bold uppercase tracking-[0.4em] transition-colors"
                >
                Abort Game Session
            </button>
            </>
        }
        </div>
    )
}

export default Playing
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from './context/AppContext';
import { DIFFICULTY_LIST } from './constant/difficulty';
import Score from './components/Score';
import Header from './section/Header';
import { yatesFisherSort } from './utils/yatesFisherSort';
import Tooltip from './components/Tooltip';
import { CheckCircle2, ScrollText, X } from 'lucide-react';
import { RULES } from './constant/rules';

function App() {
  // global states
  const {
    score, setScore,
    gameState, setGameState,
    setWordsSolved,
    difficulty, setDifficulty,
    wordsCount, setWordsCount,
    index, setIndex,
    loading, setLoading
  } = useContext(AppContext);

  // local states
  const [inputValue, setInputValue] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [word, setWord] = useState<string | undefined>("");
  const [shuffledWord, setShuffledWord] = useState<string>("");
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [timer, setTimer] = useState(difficulty == 'EASY' ? 60 : difficulty == 'MEDIUM' ? 45 : 25);
  const [showRules, setShowRules] = useState<boolean>(false)
  const [error, setError] = useState<unknown>();

  if (error) {
    throw error;
  }
  
  // points based on difficulty
  const pointsToAdd = difficulty == 'EASY' ? 100 : difficulty == 'MEDIUM' ? 500 : 1000;

  // unscramble words function
  const shuffleWord = useCallback((item: string) => {
    // if word is empty or 1 char, return
    if (!item || item.length <= 1) return item;

    // if all characters are the same return
    const isUnique = new Set(item).size > 1;
    if (!isUnique) return item;

    let shuffled = item;
    let attempts = 0;
    const maxAttempts = 10;

    // Shuffle until it's different from the original and the current word
    while (attempts < maxAttempts) {
      shuffled = yatesFisherSort(item);
      
      // Is it actually different? 
      // (Add 'word' to the condition if you are checking against a global state)
      if (shuffled !== item && shuffled !== word) {
        break; 
      }
      attempts++;
    }

    return shuffled;
  }, [word]);

  // generate random number 
  const getRandomInRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // get word from api and set it to word state
  const fetchWord = async () => {
    if (gameState === 'PLAYING') {
      const urlAddon = difficulty === 'EASY' ? `diff=1&length=${getRandomInRange(4, 5)}` : difficulty === 'MEDIUM' ? `diff=3&length=${getRandomInRange(6, 8)}` : `diff=5&length=${getRandomInRange(9, 12)}`;
      setLoading(true);
      try {
        const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${wordsCount}&${urlAddon}`);
        if (!response.ok) throw new Error('Failed to fetch words');
        const data = await response.json();
        // console.log(data)
        setWords(data);
        setWord(data[0]);
        setShuffledWord(shuffleWord(data[0] ?? ""));

      } catch (err: unknown) {
        console.error('Error fetching word:', error);
        setError(err)
        setWords([]); // Fallback word list
      } finally {
        setLoading(false);
      }
    }
  };

  // next word function
  const loadNextWord = () => {
    const nextWord = words[index + 1];
    setWord(nextWord);
    setShuffledWord(shuffleWord(nextWord))
    setIndex(prev => prev + 1);
  }

  // skip word function
  const skipWord = () => {
    setTimer(difficulty == 'EASY' ? 60 : difficulty == 'MEDIUM' ? 45 : 25);
    setInputValue("");

    // Penalty for skipping on Hard Level
    if (difficulty === "HARD") {
      setScore(prev => Math.max(prev - 1000, 0)); 
    }
    setWordsCount(prev => prev - 1); // Reduce total word count
      
    // Check if the game should end
    if (index === words.length - 1 || wordsCount === 0) {
      setGameState('FINISHED');
      setWordsCount(5); // Reset for next game
    } else {
      // Load next word
      loadNextWord();
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchWord();
    };
    fetchData();
  }, [gameState]);

  // Countdown Timer Logic
  useEffect(() => {
    let interval: number;

    if (gameState === 'PLAYING' && !loading) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
   }, [gameState, loading]); // Only restart if the game is playing or not

  // Handle the timer hitting zero separately
  useEffect(() => {
    if (timer <= 0 && gameState === 'PLAYING') {
      if (wordsCount === 0) {
        setGameState('FINISHED');
      } else {
        skipWord();
        setTimer(24);
      }
    }
  }, [timer, wordsCount, gameState]);

  // disable scrollbar when rules is open
  useEffect(() => {
    if (showRules) {
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [showRules])

  // Handle Answer Submission
  const handleSubmit = () => {
    const isCorrect = inputValue.trim().toLowerCase() === word?.toLowerCase();

    if (isCorrect) {
      setScore(prev => Math.max(prev + pointsToAdd, 0));
      setTimer(difficulty == 'EASY' ? 60 : difficulty == 'MEDIUM' ? 45 : 25);
      setWordsSolved(prev => prev + 1);
      setCorrectAnswer(1);

      // Determine if we should finish or continue
      // Use the functional update value or the index to decide
      const nextCount = wordsCount - 1;
      setWordsCount(nextCount);

      if (nextCount <= 0 || index === words.length - 1) {
        setGameState('FINISHED');
        setWordsCount(5); // Reset for next session
        setCorrectAnswer(0)
      } else {
        // load next word after 500ms
        setTimeout(() => {
          setInputValue("");
          setCorrectAnswer(0);
          loadNextWord();
        }, 500);
      }

    } else {
      // Wrong answer logic
      // setScore(prev => Math.max(prev - points, 0));
      setCorrectAnswer(2)
      
      setTimeout(() => {
        setInputValue(""); 
        setCorrectAnswer(0);
      }, 500);
    }
  };

  // reset game function
  const reset = () => {
    setScore(0);
    setTimer(24);
    setInputValue("");
    setGameState('START');
    setWordsSolved(0);
    setIndex(0);
    setCorrectAnswer(0)
  }

  const restartGame = () => {
    setScore(0);
    setWordsSolved(0);
    setInputValue("");
    setGameState('PLAYING');
    setWordsCount(5);
    setIndex(0);
    setCorrectAnswer(0)
  }

  return (
    <div className="min-h-screen bg-[#0F1115] flex flex-col items-center justify-center p-6 font-sans text-white">
      <Header />
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#255f6f] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-purple-900/20 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 w-full flex items-center justify-center max-w-md">
        {gameState === 'START' ? (
          <div className="space-y-10 text-center">
              <div className='w-full relative flex flex-col divide-y divide-white/5 bg-[#1A1D23] rounded-[2.5rem] p-6 shadow-2xl border border-white/5'>
                {/* Rules Trigger Button */}
                <button 
                  onClick={() => setShowRules(true)}
                  className="group absolute -right-4 -top-4 size-10 flex justify-center items-center py-5 border-teal-400 text-teal-400 bg-teal-400/10 shadow-[0_0_15px_rgba(45,212,191,0.2)] text-lg rounded-full hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <ScrollText />
                  <Tooltip 
                    description='Rules'
                  />
                </button>
                
                {/* Difficulty Selection */}
                <div className="flex flex-col items-center gap-3 py-10">
                  <span className="text-[9px] text-teal-600 tracking-widest uppercase font-bold">Difficulty level</span>
                  <div className="flex flex-wrap justify-center gap-3">
                    {DIFFICULTY_LIST.map((level) => (
                      <button
                        key={level.name}
                        onClick={() => setDifficulty(level.name)}
                        className={`group relative text-xs font-black tracking-widest px-4 py-1.5 uppercase rounded-full border transition-all ${
                          difficulty === level.name 
                            ? 'border-teal-400 text-teal-400 bg-teal-400/10 shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
                            : 'border-white/10 text-gray-600 hover:border-white/20'
                          }`
                        }
                      >
                        {level.title}
                        <Tooltip description={level.description} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Word Count Selection */}
                <div className="flex flex-col items-center gap-3 py-10">
                  <span className="text-[9px] text-teal-600 tracking-widest uppercase font-bold">Word Count</span>
                  <div className="flex justify-center gap-3">
                    {[5, 10, 20, 50].map((count) => (
                      <button
                        key={count}
                        onClick={() => setWordsCount(count)}
                        className={`text-xs font-black tracking-widest px-4 py-1.5 rounded-full border transition-all ${
                          wordsCount === count 
                            ? 'border-teal-400 text-teal-400 bg-teal-400/10 shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
                            : 'border-white/10 text-gray-600 hover:border-white/20'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setGameState('PLAYING')}
                className="w-full py-5 bg-white text-black font-black text-lg rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                START GAME
              </button>

              {/* RULES MODAL OVERLAY */}
              {showRules && (
                <div className="fixed inset-0 z-200 flex items-center justify-center p-6 backdrop-blur-md bg-black/60 animate-in fade-in duration-300">
                  <div className="relative w-full max-w-sm bg-[#1A1D23] border border-white/10 rounded-[2.5rem] p-8 shadow-3xl animate-in zoom-in-95 duration-300">
                    
                    <button 
                      onClick={() => setShowRules(false)}
                      className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>

                    <div className="text-left space-y-4">
                      <div className="space-y-1">
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter">The Rules</h2>
                        <div className="h-1 w-12 bg-teal-400 rounded-full" />
                      </div>

                      <div className='max-h-[50vh] overflow-y-scroll 
                        [&::-webkit-scrollbar]:w-1
                      [&::-webkit-scrollbar-track]:bg-[#1A1D23]
                      [&::-webkit-scrollbar-thumb]:bg-teal-500/20
                        [&::-webkit-scrollbar-thumb]:rounded-full
                      hover:[&::-webkit-scrollbar-thumb]:bg-teal-500/50'>
                        <ul className="space-y-4 py-4">
                          {RULES.map((rule, index) => (
                            <li key={index} className="flex gap-3 text-sm text-gray-400 leading-relaxed">
                              <CheckCircle2 size={18} className="text-teal-400 shrink-0 mt-0.5" />
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button 
                        onClick={() => setShowRules(false)}
                        className="w-full py-4 bg-[#252932] hover:bg-teal-400/10 hover:text-teal-400 border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                      >
                        Got it
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

        ) : gameState === 'PLAYING' ? (
          <div className="space-y-6 pb-10 text-center">
              {loading ?
                <div className="h-[65vh] flex flex-col items-center justify-center bg-[#0F1115] overflow-hidden">
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
                        Level <span className="text-white">{difficulty}</span>
                    </div>
                    <div className="text-[10px] font-bold tracking-widest text-teal-400 uppercase">
                        Timer <span className="text-white">{`${timer > 59 ? "01:00" : `00:${timer < 10 ? `0${timer}` : timer}`}`}</span>
                    </div>
                  </div>

                  {/* Main Interface */}
                  <div className={`bg-[#1A1D23] rounded-[2.5rem] p-6 md:p-8 shadow-2xl border border-white/5 transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                    

                  <div className={`flex justify-center gap-2 mb-8 flex-wrap`}>
                    {wordsCount > 0 && shuffledWord.split('').map((letter, i) => (
                      <div 
                        key={i} 
                        className={`
                          flex items-center justify-center font-black text-teal-400 uppercase
                          bg-[#252932] rounded-xl border border-white/5 shadow-inner
                          transition-all duration-200
                          ${shuffledWord.length > 6 
                            ? 'w-10 h-12 text-xl sm:w-12 sm:h-14 sm:text-2xl' 
                            : 'w-14 h-16 text-3xl'}
                        `}
                      >
                        {letter}
                      </div>
                    ))}
                  </div>

                  {/* Interaction & Input Container */}
                  <div className="space-y-6">
                    {/* Input: Massive & Focused */}
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className={`
                          w-full uppercase bg-transparent border-b-2 border-gray-800 py-4 text-center 
                          font-black outline-none focus:border-teal-400 transition-colors tracking-widest 
                          placeholder:text-gray-800
                          ${shuffledWord.length > 8 ? 'text-2xl' : 'text-4xl'}
                          ${correctAnswer == 2 ? "text-red-500" : correctAnswer == 1 ? "text-green-500" : "text-white"}
                        `}
                        placeholder="_ _ _ _"
                        autoFocus
                      />
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-teal-400 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                    </div>

                    {/* Controls Row */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex flex-1 gap-2">
                        <button 
                          className="relative group flex-1 py-4 bg-[#252932] hover:bg-[#2e333d] border border-white/5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase"
                          onClick={() => setShuffledWord(shuffleWord(shuffledWord))}
                        >
                          Shuffle
                          
                          <Tooltip
                            description={"Reshuffle the letters for a fresh perspective"}
                          />
                        </button>
                        <button 
                          className="relative group flex-1 py-4 bg-[#252932] hover:bg-[#2e333d] border border-white/5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase text-gray-400"
                          onClick={skipWord}
                        >
                          Skip
                          
                          <Tooltip
                            description={`Give up on this word and move to the next one. ${difficulty === "HARD" ? `(Penalty: - ${pointsToAdd} points)` : ""}`}
                          />
                        </button>
                      </div>
                      
                      <button 
                        className="flex-[1.5] py-4 bg-[#255f6f] hover:bg-[#2d7386] disabled:bg-gray-800 disabled:text-gray-600 text-white font-black rounded-xl transition-all shadow-lg shadow-teal-900/20 uppercase tracking-widest text-sm"
                        onClick={handleSubmit}
                        disabled={loading || inputValue.length === 0}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
                  
                  <button 
                    onClick={reset}
                    className="w-full text-[10px] text-gray-600 hover:text-gray-400 font-bold uppercase tracking-[0.4em] transition-colors"
                  >
                    Abort Session
                  </button>
                </>
              }
          </div>
        ) : 
          <div className="space-y-6 text-center">
            <Score 
              words={words}
              restartGame={restartGame}
              resetGame={reset}
            />
          </div>
        }
      </main>
    </div>
  );
}

export default App;
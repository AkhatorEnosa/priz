import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from './context/AppContext';
import { DIFFICULTY_LIST } from './constant/difficulty';
import Score from './components/Score';
import Header from './section/Header';
import { yatesFisherSort } from './utils/yatesFisherSort';

function App() {
  const [inputValue, setInputValue] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [word, setWord] = useState<string | undefined>("");
  const [shuffledWord, setShuffledWord] = useState<string>("");
  const [correctAnswer, setCorrectAnswer] = useState<boolean>(true);
  const [timer, setTimer] = useState(24);
  const [loading, setLoading] = useState(false);

  const {
    score, setScore,
    gameState, setGameState,
    wordsSolved, setWordsSolved,
    difficulty, setDifficulty,
    wordsCount, setWordsCount,
    index, setIndex,
  } = useContext(AppContext);
  
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
        const data = await response.json();
        console.log(data)
        setWords(data);
        setWord(data[0]);
        setShuffledWord(shuffleWord(data[0] ?? ""));

      } catch (error) {
        console.error('Error fetching word:', error);
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
    setTimer(24);
    setInputValue("");
    setScore(prev => Math.max(prev - (difficulty === 'EASY' ? 10 : difficulty === 'MEDIUM' ? 50 : 100), 0)); // Penalty for skipping
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
    let interval: NodeJS.Timeout;

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

  // Handle Answer Submission
  const handleSubmit = () => {
    const isCorrect = inputValue.trim().toLowerCase() === word?.toLowerCase();
    const points = difficulty === 'EASY' ? 10 : difficulty === 'MEDIUM' ? 50 : 100;

    if (isCorrect) {
      setScore(prev => Math.max(prev + points, 0));
      
      setInputValue("");
      setTimer(24);
      setWordsSolved(prev => prev + 1);

      // Determine if we should finish or continue
      // Use the functional update value or the index to decide
      const nextCount = wordsCount - 1;
      setWordsCount(nextCount);

      if (nextCount <= 0 || index === words.length - 1) {
        setGameState('FINISHED');
        setWordsCount(5); // Reset for next session
      } else {
        loadNextWord();
      }

    } else {
      // Wrong answer logic
      setScore(prev => Math.max(prev - points, 0));
      setCorrectAnswer(false)
      
      setTimeout(() => {
        setInputValue(""); 
        setCorrectAnswer(true);
      }, 500);
    }
  };

  // reset game function
  const reset = () => {
    setScore(0);
    setTimer(24);
    setInputValue("");
    setGameState('START');
    setWordsSolved(0)
  }

  const restartGame = () => {
    setScore(0);
    setWordsSolved(0);
    setGameState('PLAYING');
    setWordsCount(5);
    setIndex(0);
  }

  return (
    <div className="min-h-screen bg-[#0F1115] flex items-center justify-center p-6 font-sans text-white">
      
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#255f6f] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-purple-900/20 blur-[100px] rounded-full" />
      </div>

      <main className="relative z-10 w-full flex items-center justify-center max-w-md">
        {gameState === 'START' ? (
          <div className="space-y-10 text-center">
            <Header/>

            <div className="space-y-6">
              <p className="text-gray-500 tracking-[0.3em] text-[10px] uppercase font-bold">
                Unscramble the word before time runs out
              </p>

              <div className='flex flex-col divide-y-[1px] divide-white/5 bg-[#1A1D23] rounded-[2.5rem] p-6 shadow-2xl border border-white/5'>
                {/* Difficulty Selection */}
                <div className="flex flex-col items-center gap-3 py-10">
                  <span className="text-[9px] text-gray-600 text-teal-600 tracking-widest uppercase font-bold">Difficulty level</span>
                  <div className="flex justify-center gap-3">
                    {DIFFICULTY_LIST.map((level) => (
                      <button
                        key={level.name}
                        onClick={() => setDifficulty(level.name)}
                        className={`group relative text-sm font-black tracking-widest px-4 py-1.5 rounded-full border transition-all ${
                          difficulty === level.name 
                            ? 'border-teal-400 text-teal-400 bg-teal-400/10 shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
                            : 'border-white/10 text-gray-600 hover:border-white/20'
                          }`
                        }
                      >
                        {level.name}
                        <span className='hidden group-hover:block absolute -left-10 top-10 bg-black text-white font-light text-[10px] rounded-lg p-2 text-start'>{level.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Word Count Selection */}
                <div className="flex flex-col items-center gap-3 py-10">
                  <span className="text-[9px] text-gray-600 text-teal-600 tracking-widest uppercase font-bold">Word Count</span>
                  <div className="flex justify-center gap-3">
                    {[5, 10, 20, 50].map((count) => (
                      <button
                        key={count}
                        onClick={() => setWordsCount(count)}
                        className={
                          `text-sm font-black tracking-widest px-4 py-1.5 rounded-full border transition-all ${
                            wordsCount === count 
                              ? 'border-teal-400 text-teal-400 bg-teal-400/10 shadow-[0_0_15px_rgba(45,212,191,0.2)]' 
                              : 'border-white/10 text-gray-600 hover:border-white/20'
                          }`
                        }
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setGameState('PLAYING')}
              className="w-full py-5 bg-white text-black font-black text-lg rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              START GAME
            </button>
          </div>

        ) : gameState === 'PLAYING' ? (
          <div className="space-y-6 text-center">
            <Header />
              
              {loading ?
                <div className='w-full h-full absolute flex justify-center items-center left-0 top-0 bg-[#0F1115] font-black italic z-[100]'><span>Loading...</span></div> :
                <> 
                  {/* Score & Timer HUD */}
                  <div className="flex justify-between items-center px-2">
                    <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                        Score // <span className="text-white">{score}</span>
                    </div>
                    <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                        Count // <span className="text-white">{`${index + 1}/${words?.length}`}</span>
                    </div>
                    <div className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                        Level // <span className="text-white">{difficulty}</span>
                    </div>
                    <div className="text-[10px] font-bold tracking-widest text-teal-400 uppercase">
                        Timer // <span className="text-white">00:{timer < 10 ? `0${timer}` : timer}</span>
                    </div>
                  </div>

                  {/* Main Interface */}
                  <div className={`bg-[#1A1D23] rounded-[2.5rem] p-8 shadow-2xl border border-white/5 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                    {/* Scrambled Word Area */}
                    <div className="flex justify-center gap-3 mb-10">
                      {wordsCount > 0 && shuffledWord.split('').map((letter, i) => (
                        <div key={i} className="w-14 h-16 bg-[#252932] rounded-2xl flex items-center justify-center text-3xl font-black text-teal-400 shadow-inner border border-white/5 uppercase">
                          {letter}
                        </div>
                      ))}
                    </div>

                    {/* Interaction Bar */}
                    <div className="flex gap-2 mb-6">
                      <button className="flex-1 py-3 bg-[#252932] hover:bg-[#2e333d] border border-white/5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase"
                        onClick={() => setShuffledWord(shuffleWord(shuffledWord))}
                      >
                        Shuffle
                      </button>
                      <button className="flex-1 py-3 bg-[#252932] hover:bg-[#2e333d] border border-white/5 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase text-gray-400"
                        onClick={skipWord}
                      >
                        Skip
                      </button>
                    </div>

                    {/* Input: Massive & Focused */}
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className={`w-full uppercase bg-transparent border-b-2 border-gray-800 py-4 text-center text-4xl ${!correctAnswer ? "text-red-500" : ""} font-black outline-none focus:border-teal-400 transition-colors tracking-widest placeholder:text-gray-800`}
                        placeholder="----"
                        autoFocus
                      />
                      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-teal-400 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                    </div>

                    <button className="w-full py-5 mt-10 bg-[#255f6f] hover:bg-[#2d7386] text-white font-black rounded-2xl transition-all shadow-lg shadow-teal-900/20 uppercase tracking-widest text-sm"
                      onClick={handleSubmit}
                      disabled={loading || inputValue.length === 0}
                    >
                      Submit Answer
                    </button>
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
            <Header />
            <Score 
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
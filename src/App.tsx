import { useCallback, useContext, useEffect, useState } from 'react';
import Score from './section/Score';
import { yatesFisherSort } from './utils/yatesFisherSort';
import type { LetterProps } from './utils/types';
import { transformItemToObj } from './utils/transformItemToObj';
import { Navbar } from './section/Navbar';
import Rules from './components/Rules';
import { useAuth } from './hooks/useAuth';
import { useSaveScore } from './hooks/useSaveScore';
import { useMyScores } from './hooks/useMyScores';
import Leaderboard from './components/Leaderboard';
import Start from './section/Start';
import Playing from './section/Playing';
import useSound from 'use-sound';
import clickSfx from './assets/sfx/mouse-click.mp3';
import correctSfx from './assets/sfx/correct.mp3';
import wrongSfx from './assets/sfx/wrong.mp3';
import winSfx from './assets/sfx/win.mp3';
import gameSfx from './assets/sfx/game-sound.mp3'; 
import newRecordSfx from './assets/sfx/new-record.mp3';
import gameOverSfx from './assets/sfx/game-over.mp3';
import { AppContext } from './context/AppContextDefinition';

function App() {
  // global states
  const {
    score, setScore,
    gameState, setGameState,
    wordsSolved, setWordsSolved,
    difficulty, setDifficulty,
    wordsCount, setWordsCount,
    index, setIndex,
    loading, setLoading,
    isMuted
  } = useContext(AppContext);

  // tanstack query
  const { mutate: saveScore } = useSaveScore();
  // const { data: topScores, isLoading } = useLeaderboard();
  const { user, username, isLoading: loadingUser, registerAnonymously } = useAuth()
  const { data: myScores, isLoading: isLoadingScores } = useMyScores()

  // get highest score from my scores
  const getHighestScore = useCallback(() => {
    if (myScores && myScores.length > 0) {
      return myScores?.reduce((prev, current) => (prev.score > current.score) ? prev : current)
    } else {
      return null
    }
  }, [myScores])

  const timeSelection = difficulty === 0 ? 60 : difficulty === 1 ? 45 : 25;

  // local states
  const [inputValue, setInputValue] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [word, setWord] = useState<string>("");
  const [shuffledWord, setShuffledWord] = useState<LetterProps[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [timer, setTimer] = useState(timeSelection);
  const [showRules, setShowRules] = useState<boolean>(false)
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false)
  const [showWord, setShowWord] = useState<boolean>(false)
  const [usedIndices, setUsedIndices] = useState<string[]>([])
  const [error, setError] = useState<unknown>();

  // sound effects
  const [playClick] = useSound(clickSfx, { volume: isMuted ? 0 : 1 });
  const [playCorrect] = useSound(correctSfx, { volume: isMuted ? 0 : 1 });
  const [playWrong] = useSound(wrongSfx, { volume: isMuted ? 0 : 1 });
  const [playReveal] = useSound(correctSfx, { volume: isMuted ? 0 : 1 });
  const [playWin] = useSound(winSfx, { volume: isMuted ? 0 : 1 });
  const [playGame, {stop}] = useSound(gameSfx, { volume: isMuted ? 0 : 1, loop: true, playbackRate: 1 });
  const [playNewRecord, { stop: stopNewRecord }] = useSound(newRecordSfx, { volume: isMuted ? 0 : 1 });
  const [playGameOver, { stop: stopGameOver }] = useSound(gameOverSfx, { volume: isMuted ? 0 : 1 });

  if (error) {
    throw error;
  }

  useEffect(() => {
    // If there's no user session, register them silently
    if (!user && !loadingUser) {
      registerAnonymously();
    }
  }, [user, loadingUser, registerAnonymously]);
    
  // points based on difficulty
  const pointsToAdd = difficulty === 0 ? 100 : difficulty === 1 ? 500 : 1000;

  // shuffle words function
  const shuffleWord = useCallback((item:string) : LetterProps[] => {
    const originalObjects = transformItemToObj(item);

    // if word is empty or 1 char, return
    if (!item || item.length <= 1) return originalObjects;

    // if all characters in the word are the same return
    const isUnique = new Set(item).size > 1;
    if (!isUnique) return originalObjects;

    
    let shuffled: LetterProps[] = [];
    let attempts = 0;
    const maxAttempts = 10;

    // Shuffle until it's different from the original and the current word
    while (attempts < maxAttempts) {
      shuffled = [...yatesFisherSort(item)];
      
      const shuffledString = shuffled.map(obj => obj.char).join(""); // get the shuffled string from shuffled Object
    
      // compare to make sure item is not the same with shuffled String
      if (shuffledString !== item) {
        break; 
      }
      attempts++;
    }

    return shuffled.length > 0 ? shuffled : originalObjects;
  }, [word]);

  // generate random number 
  const getRandomInRange = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // get word from api and set it to word state
  const fetchWord = async () => {
    if (gameState === 'PLAYING') {
      const urlAddon = difficulty === 0 ? `diff=1&length=${getRandomInRange(3, 5)}` : difficulty === 1 ? `diff=3&length=${getRandomInRange(6, 8)}` : `diff=5&length=${getRandomInRange(9, 10)}`;
      setLoading(true);
      try {
        const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${wordsCount}&${urlAddon}`);
        if (!response.ok) throw new Error('Failed to fetch words');
        const data = await response.json();
        // console.log(data)
        setWords(data);
        setWord(data[0]);
        setShuffledWord(shuffleWord(data[0]));

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
    setUsedIndices([])
    setInputValue("");
    
    const nextWord = words[index + 1];
    setWord(nextWord);
    setShuffledWord(shuffleWord(nextWord))
    setIndex(prev => prev + 1);
    setShowWord(false)
    setUsedIndices([])
    setInputValue("");
    setCorrectAnswer(0);
  }

  // skip word function
  const skipWord = () => {
    playClick()
    setTimer(timeSelection);
    setWordsCount(prev => prev - 1); // Reduce total word count
      
    // Check if the game should end
    if (index === words.length - 1 || wordsCount === 0) {
      
      setGameState('FINISHED');
      setWordsCount(words?.length); // Reset for next game

      if (score > 0) {
        saveScore({ 
          user_id: user?.id,
          username: username, 
          score: score, 
          solved: `${wordsSolved}/${words.length}`,
          level: difficulty
        });
      }
      // save score 
    } else {
      // Load next word
      loadNextWord();
    }

    // Penalty for skipping on Hard Level
    if (difficulty === 2) {
      setScore(prev => Math.max(prev - 1000, 0));
    }
  }


  // handle show word function
  const revealWord = () => {
    playReveal()
    setShowWord(true)
    setInputValue("")
    setUsedIndices([])
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchWord();
    };
    fetchData();
  }, [gameState]);

  
  // handle sound effects based on game state
  useEffect(() => {
    if (gameState === 'PLAYING') {
      playGame();
      stopGameOver();
      stopNewRecord();
    } else if (gameState === 'FINISHED') {
      if (getHighestScore() && score > getHighestScore()?.score) {
        playNewRecord();
        stop();
      } else if (score === 0) {
        playGameOver();
        stop();
      } else {
        playWin();
        stop();
      }
    }
  }, [gameState, playGame, playWin, playGameOver, playNewRecord, stop]);

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
        // save score 

        if (score > 0) {
          saveScore({
            user_id: user?.id,
            username: username,
            score: score,
            solved: `${wordsSolved}/${words.length}`,
            level: difficulty
          });
        }
        ;
        setGameState('FINISHED');
      } else {
        skipWord();
      }
    }
  }, [timer, wordsCount, gameState, user, username, score, wordsSolved, saveScore]);

  // disable scrollbar when rules is open
  useEffect(() => {
    if (showRules || showLeaderboard) {
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [showRules, showLeaderboard])

  useEffect(() => {
    // Only trigger once the lengths match to avoid checking every single keystroke
    if (inputValue.length === word?.length && inputValue.length > 0) {
      handleSubmit();
    }
  }, [inputValue, word]);

  // Handle Answer Submission
  const handleSubmit = () => {
    const isCorrect = inputValue.trim().toLowerCase() === word?.toLowerCase();

    if (isCorrect) {
      playCorrect();
      const finalScore = score + pointsToAdd;
      const finalSolved = wordsSolved + 1;

      setScore(finalScore);
      setTimer(timeSelection);
      setWordsSolved(finalSolved);
      setCorrectAnswer(1);

      // Determine if we should finish or continue
      setWordsCount(prev => prev - 1);

      if (index === words.length - 1 || wordsCount === 0) {

        if (finalSolved > 0) {
          // save score 
          saveScore({
            user_id: user?.id,
            username: username,
            score: finalScore,
            solved: `${finalSolved}/${words.length}`,
            level: difficulty
          });
        }
        // game over
        setTimeout(() => {
          ;
          setGameState('FINISHED');
          setWordsCount(words?.length);
          setCorrectAnswer(0);
          setUsedIndices([]);
          setInputValue("");
        }, 600);
      } else {
        // load next word after 500ms
        setTimeout(() => {
          loadNextWord();
        }, 500);
      }

    } else {
      // Wrong answer logic
      playWrong();
      setCorrectAnswer(2)
      
      setTimeout(() => {
        setInputValue("");
        setCorrectAnswer(0);
        setUsedIndices([])
      }, 500);
    }
  };

  const handleLetterClick = (letter: string, id: string) => {
    playClick();
    if (usedIndices.includes(id)) {
      // locate where this specific index is in the usedIndices array
      const letterPos = usedIndices.indexOf(id);

      // remove the character in that position 
      setInputValue(prev => prev.slice(0, letterPos) + prev.slice(letterPos + 1));

      // remove the index from tracking array
      setUsedIndices(prev => prev.filter(i => i !== id));
    } else if (word?.length > inputValue.length) {
      setInputValue((prev) => prev + letter)
      setUsedIndices((prev) => [...prev, id])
    }

    // console.log(usedIndices, id)
  }

  // reset game function
  const reset = () => {
    playClick();
    
    setScore(0);
    setTimer(0);
    setInputValue("");
    setGameState('START');
    setWordsSolved(0);
    setIndex(0);
    setCorrectAnswer(0)
    setIndex(0)
    setLoading(false)
    setWords([])
    setWord("")
    setShuffledWord([])
    setShowWord(false)
    setUsedIndices([])
    setError(null)

  }

  const restartGame = () => {
    playClick();
    stopGameOver();
    stopNewRecord();

    setScore(0);
    setTimer(timeSelection)
    setWordsSolved(0);
    setInputValue("");
    setGameState('PLAYING');
    setIndex(0);
    setCorrectAnswer(0)


    setLoading(false)
    setWords([])
    setWord("")
    setShuffledWord([])
    setShowWord(false)
    setUsedIndices([])
  }

  return (
    <div className="relative min-h-screen w-screen bg-[#0F1115] flex flex-col items-center gap-10 font-sans text-white">
      <Navbar
        setShowLeaderboard={setShowLeaderboard}
      />
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#255f6f] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-purple-900/20 blur-[100px] rounded-full" />
      </div>

      {/* RULES MODAL OVERLAY */}
      {showRules && (
        <Rules 
          setShowRules={setShowRules}
        />
      )}

      {/* show Leaderboard */}
      {
        showLeaderboard && (
          <Leaderboard
            isOpen={showLeaderboard}
            onClose={() => {
              setShowLeaderboard(false);
              playClick();
            }}
          />
        )
      }

      <main className="relative z-10 grow w-full flex items-center justify-center p-6 max-w-md">
        {gameState === 'START' ? (
          <Start
              setDifficulty={setDifficulty}
              difficulty={difficulty}
              setWordsCount={setWordsCount}
              wordsCount={wordsCount}
              setGameState={setGameState}
              setShowRules={setShowRules}
              isLoadingScores={isLoadingScores}
              getHighestScore={getHighestScore}
              username={username}
          />
        ) : gameState === 'PLAYING' ? (
          <Playing 
            word={word}
            shuffledWord={shuffledWord}
            handleLetterClick={handleLetterClick}
            inputValue={inputValue}
            timer={timer}
            correctAnswer={correctAnswer}
            showWord={showWord}
            revealWord={revealWord}
            skipWord={skipWord}
            shuffleWord={shuffleWord}
            pointsToAdd={pointsToAdd}
            score={score}
            index={index}
            words={words}
            difficulty={difficulty}
            loading={loading}
            usedIndices={usedIndices}
            wordsCount={wordsCount}
            setShuffledWord={setShuffledWord}
            setInputValue={setInputValue}
            reset={reset}
          />
        ) : 
          <div className="space-y-6 text-center">
            <Score 
              words={words}
              getHighestScore={getHighestScore}
              exit={reset}
              restart={restartGame}
            />
          </div>
        }
      </main>
    </div>
  );
}

export default App;
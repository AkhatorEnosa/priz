import React, { createContext, useState, type ReactNode } from 'react'

export const AppContext = createContext<{
  gameState: string;
  setGameState: React.Dispatch<React.SetStateAction<string>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  wordsSolved: number;
  setWordsSolved: React.Dispatch<React.SetStateAction<number>>;
  difficulty: string;
  setDifficulty: React.Dispatch<React.SetStateAction<string>>;
  wordsCount: number;
  setWordsCount: React.Dispatch<React.SetStateAction<number>>
  resetGame: () => void;
}>({
  gameState: 'START',
  setGameState: () => {},
  score: 0,
  setScore: () => {},
  wordsSolved: 0,
  setWordsSolved: () => { },
  difficulty: 'EASY',
  setDifficulty: () => { },
  wordsCount: 5,
  setWordsCount: () => {},
  resetGame: () => {}
});


export function AppProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState('START');
  const [score, setScore] = useState(1250); // Example score
  const [wordsSolved, setWordsSolved] = useState(0);
  const [difficulty, setDifficulty] = useState('EASY');
  const [wordsCount, setWordsCount] = useState(5);

  const resetGame = () => {
    setScore(0);
    setWordsSolved(0);
    setGameState('PLAYING');
  }
    
  return (
    <AppContext.Provider value={{
      gameState,
      setGameState,
      score,
      setScore,
      wordsSolved,
      setWordsSolved,
      difficulty,
      setDifficulty,
      wordsCount,
      setWordsCount,
      resetGame
    }}>
      {children}
    </AppContext.Provider>
  )
}
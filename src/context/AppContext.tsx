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
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}>({
  gameState: 'START',
  setGameState: () => {},
  score: 0,
  setScore: () => {},
  wordsSolved: 0,
  setWordsSolved: () => {},
  difficulty: 'EASY',
  setDifficulty: () => {},
  wordsCount: 5,
  setWordsCount: () => {},
  index: 0,
  setIndex: () => {},
});


export function AppProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState('START');
  const [score, setScore] = useState(0); // Example score
  const [wordsSolved, setWordsSolved] = useState(0);
  const [difficulty, setDifficulty] = useState('EASY');
  const [wordsCount, setWordsCount] = useState(5);
  const [index, setIndex] = useState(0);
    
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
      index,
      setIndex
    }}>
      {children}
    </AppContext.Provider>
  )
}
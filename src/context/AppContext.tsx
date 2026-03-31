import React, { useState, type ReactNode } from 'react';
import { AppContext } from './AppContextDefinition';

export function AppProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState('START');
  const [score, setScore] = useState(0);
  const [wordsSolved, setWordsSolved] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [wordsCount, setWordsCount] = useState(5);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
    
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
      setIndex,
      loading,
      setLoading,
      isMuted,
      setIsMuted
    }}>
      {children}
    </AppContext.Provider>
  )
}
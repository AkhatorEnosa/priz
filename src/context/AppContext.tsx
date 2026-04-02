import React, { useEffect, useState, type ReactNode } from 'react';
import { AppContext } from './AppContextDefinition';

export function AppProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState('START');
  const [score, setScore] = useState(0);
  const [wordsSolved, setWordsSolved] = useState(0);
  const [difficulty, setDifficulty] = useState(localStorage.getItem("difficulty") ? parseInt(localStorage.getItem("difficulty")!) : 0);
  const [wordsCount, setWordsCount] = useState(localStorage.getItem("wordsCount") ? parseInt(localStorage.getItem("wordsCount")!) : 5);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(localStorage.getItem("isMuted") === "true" ? true : false);

  // Persist difficulty and wordsCount in localStorage
  useEffect(() => {
    localStorage.setItem('difficulty', difficulty.toString());
    localStorage.setItem('wordsCount', wordsCount.toString());
    localStorage.setItem('isMuted', isMuted.toString());
  }, [difficulty, wordsCount, isMuted])
    
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
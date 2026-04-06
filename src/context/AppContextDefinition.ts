import { createContext } from "react";

export const AppContext = createContext<{
  gameState: string;
  setGameState: React.Dispatch<React.SetStateAction<string>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  wordsSolved: number;
  setWordsSolved: React.Dispatch<React.SetStateAction<number>>;
  difficulty: number;
  setDifficulty: React.Dispatch<React.SetStateAction<number>>;
  wordsCount: number;
  wordsLen: number;
  setWordsLen: React.Dispatch<React.SetStateAction<number>>;  
  setWordsCount: React.Dispatch<React.SetStateAction<number>>
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  gameState: 'START',
  setGameState: () => {},
  score: 0,
  setScore: () => {},
  wordsSolved: 0,
  setWordsSolved: () => {},
  difficulty: 0,
  setDifficulty: () => {},
  wordsCount: 5,
  setWordsCount: () => { },
  wordsLen: 0,
  setWordsLen: () => {},
  index: 0,
  setIndex: () => {},
  loading: false,
  setLoading: () => {},
  isMuted: false,
  setIsMuted: () => {}
});
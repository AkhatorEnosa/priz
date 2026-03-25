import type { LetterProps } from "./types";

// transform items to object with type LetterProps
export const transformItemToObj = (word: string): LetterProps[] => {
  if (!word) return [];

    const splitWord = word.split("");
    const newArr = [];

    for (let i = 0; i < splitWord.length; i++) {
      newArr.push({
        id: `tile-${word.length}-${splitWord[i]}-${i}`,
        char: splitWord[i]
      })
    }

    return newArr;
  }
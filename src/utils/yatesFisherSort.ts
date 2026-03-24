import { transformItemToObj } from "./transformItemToObj";
import type { LetterProps } from "./types";

export const yatesFisherSort = (item: string) : LetterProps[] => {
    const letters = transformItemToObj(item);

    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i] , letters[j]] = [letters[j], letters[i]]
    }
    return letters;
}
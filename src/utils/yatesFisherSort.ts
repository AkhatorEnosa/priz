export const yatesFisherSort = (text: string) :string => {
    const letters = text.split('');

    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i] , letters[j]] = [letters[j], letters[i]]
    }
    return letters.join('');
}
import { defaultWordTypeAndMeaning, IWordTypeAndMeaning } from './IWordTypeAndMeaning';

export interface IWord {
    word:string,
    forms:IWordTypeAndMeaning[]
}

export var defaultWord:IWord = {
    word: "",
    forms: [defaultWordTypeAndMeaning],
}
import { ObjectId } from "mongodb";
import { IWord } from "./IWord";

export interface IQuestionAnswer {
    id?:ObjectId,
    correctAnswer:IWord;
    possibleAnswers:IWord[],
}
import { IQuestion } from './IQuestion';
import { defaultWord, IWord } from './IWord';

export interface IAnswerResult {
    correctAnswerGiven:boolean,
    definitionsForAllAnswers:IWord[],
    nextQuestionForUser:IQuestion
}
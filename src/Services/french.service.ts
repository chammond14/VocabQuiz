import DatabaseService from './../Services/db.service';
import { IQuestion } from '../Types/IQuestion';
import { frenchConfig } from '../Config/MongoConfig'; 
import { IWord } from '../Types/IWord';
import { ISubmittedAnswer } from '../Types/ISubmittedAnswer';
import { frenchWordTypes } from '../Config/WordTypes';
import { IQuestionAnswer } from '../Types/IQuestionAnswers';
import { IWordTypeAndMeaning } from '../Types/IWordTypeAndMeaning';
import { IAnswerResult } from '../Types/IAnswerResult';
import { ObjectId } from 'mongodb';

export default class FrenchService {
    _db:DatabaseService;

    constructor(db:DatabaseService) {
        this._db = db;
        this.getQuestion = this.getQuestion.bind(this);
    }

    public async getQuestion():Promise<IQuestion> {
        
        const randomWordType:string = this.selectRandomWordType();
        const words:IWord[] = await this._db.getWords(frenchConfig, randomWordType);

        return await this.createQuestion(words);
    }

    //Future functionality (Front-end needs implemented)
    public async getQuestionOfWordType(wordType:string):Promise<IQuestion> {
        const words:IWord[] = await this._db.getWords(frenchConfig, wordType);

        return await this.createQuestion(words);
    }
    

    public async submitAnswer(userSubmittedAnswer:ISubmittedAnswer):Promise<IAnswerResult> {
        
        const answerInDb:IQuestionAnswer = await this._db.findAnswer(frenchConfig, userSubmittedAnswer.questionAnswerId);

        let response = {
            correctAnswerGiven: false,
            definitionsForAllAnswers: [] as IWord[],
            nextQuestionForUser: {} as IQuestion
        };

        response.correctAnswerGiven = (userSubmittedAnswer.answerString == answerInDb.correctAnswer.forms[0].typeDefinition);
        response.definitionsForAllAnswers = answerInDb.possibleAnswers;

        response.nextQuestionForUser = await this.getQuestion();

        return response;
    }

    private async createQuestion(selectedWords:IWord[]):Promise<IQuestion> {
        
        let answer:IQuestionAnswer = {
            correctAnswer: {} as IWord,
            possibleAnswers: [] as IWord[]
        };

        let question:IQuestion = { 
            questionString: "",
            questionWordType: "",
            possibleAnswers: [] as string[],
            questionAnswerId: {} as ObjectId
        };

        answer.possibleAnswers = selectedWords;
        
        selectedWords = this.formatWordsForQuestion(selectedWords);

        selectedWords.forEach(word => {
            question.possibleAnswers.push(word.forms[0].typeDefinition);
        });

        var correctAnswer:IWord = this.selectCorrectAnswer(selectedWords);

        question.questionString = correctAnswer.word;
        question.questionWordType = correctAnswer.forms[0].wordType;
        answer.correctAnswer = correctAnswer;

       
        answer.id = await this._db.saveAnswer(frenchConfig, answer);
        question.questionAnswerId = answer.id;
  
        return question;
    }

    //If a user does not provide a word type, choose one for the db query.
    //We do this as we want all possible answers to be of the same word type.
    private selectRandomWordType():string {
        //Nouns, Verbs, and Adjectives are the most abundant words, so we want to return these more often (3/4 of the time).
        //If 0 < weightingNumber  < 75, return one of these words. Else return a less common word type.
        var weightingNumber:number = this.getRandomInt(0, 101);
        var wordNumber:number;
        
        weightingNumber <= 75 ? wordNumber = this.getRandomInt(1, 4) : wordNumber = this.getRandomInt(4, 12);

        return frenchWordTypes[wordNumber]
    }

    private getRandomInt(min:number, max:number):number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    private formatWordsForQuestion(words:IWord[]):IWord[] {
        words.forEach(word => {
            if (word.forms.length > 1) {
                word.forms = this.removeExcessDefinitions(word.forms);
            }
        });
        return words;
    }

    private removeExcessDefinitions(formsOfWord:IWordTypeAndMeaning[]):IWordTypeAndMeaning[] {
        //The frontend expects the form as an array, so we return one rather than the element. Change soon
        let formToKeep = [];
        var index:number = this.getRandomInt(0, (formsOfWord.length));
        formToKeep.push(formsOfWord[index]);
        return formToKeep;
    }

    private selectCorrectAnswer(possibleAnswers:IWord[]):IWord {
        var index:number = this.getRandomInt(0, (possibleAnswers.length));
        return possibleAnswers[index];
    }
}
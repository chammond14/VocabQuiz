import { Request, Response } from 'express';
import FrenchService from './../Services/french.service';
import { IQuestion } from '../Types/IQuestion';
import { ISubmittedAnswer } from '../Types/ISubmittedAnswer';
import { IAnswerResult } from '../Types/IAnswerResult'

export default class FrenchController {
    _frenchService:FrenchService;

    constructor(frenchService:FrenchService) {
        this._frenchService = frenchService;
        this.handleGetQuestion = this.handleGetQuestion.bind(this);
        this.handleSubmitAnswer = this.handleSubmitAnswer.bind(this);
    }

    public async handleGetQuestion(req:Request, res:Response):Promise<void> {
        try {
            const question:IQuestion = await this._frenchService.getQuestion();
            res.status(200).json(question);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                'statusCode' : 500,
                'errorMessage' : 'Failed to get question'
            });
        }
    }

    public async handleGetQuestionWithWordType(req:Request, res:Response):Promise<void> {
        try {
            const question:IQuestion = await this._frenchService.getQuestionOfWordType(req.params.wordType);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                'statusCode' : 500,
                'errorMessage' : 'Failed to get question with word type: ' + req.params.wordType
            });
        }
    }

    async handleSubmitAnswer(req:Request, res:Response):Promise<void> {
        try {
            const answerResult:IAnswerResult = await this._frenchService.submitAnswer(req.body);
            res.status(200).json(answerResult);
        } catch (error) {
            res.status(500).json({ message: 'error' });
            console.log('----- CONTROLLER ERROR -----');
            console.log(error);
        }
    }
}
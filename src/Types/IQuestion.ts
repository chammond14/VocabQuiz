import { ObjectId } from "mongodb";

export interface IQuestion {
    questionString:string,
    questionWordType:string,
    possibleAnswers:string[],
    questionAnswerId:ObjectId
}
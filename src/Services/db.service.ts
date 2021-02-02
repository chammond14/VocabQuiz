import { MongoClient, ObjectID } from 'mongodb';
import { IMongoConfig } from '../Types/IMongoConfig';
import { IQuestionAnswer } from '../Types/IQuestionAnswers';
import { ObjectId } from 'mongodb';

export default class DatabaseService {

    private client:MongoClient;

    public constructor(connectionString:string) {
        this.client = new MongoClient(connectionString);
    }

    /*
    *   Standard find query, to retrieve 4 random words, all of the same word type (Verb, Noun etc.)
    *   Sample could return the same value twice currently (although very unlikely)
    *   Investigate executing a query string, rather than passing config to db service
    */
    public async getWords(config:IMongoConfig, queryParam:string):Promise<any> {

        try{
            await this.client.connect();

            var res = this.client.db(config.DatabaseName)
                .collection(config.WordsCollectionName)
                .aggregate([
                    { $match: { "forms.wordType": queryParam } },
                    { $sample: { size: 4 } }
                ]);
                var resArray = await res.toArray();
                console.log(resArray);

                return resArray;
        } catch (error) {
            console.log('------ DB ERROR: Error getting words ------' + error);
            throw error;
        }
    }

    
    public async saveAnswer(config:IMongoConfig, answer:IQuestionAnswer):Promise<ObjectId> {
    
        try {
            
             await this.client.connect();
             var promise = this.client.db(config.DatabaseName)
                .collection(config.AnswersCollectionName)
                .insertOne(answer);

            var res:ObjectId = (await promise).insertedId;
            return res;
        } catch (error) {
            console.log("----- DB ERROR: Error saving answer ------")
            throw (error);
        }
    }

    public async findAnswer(config:IMongoConfig, id:string):Promise<any> {

        try {
            await this.client.connect();
            
            var objId:ObjectId = new ObjectId(id);
            var res = await this.client.db(config.DatabaseName)
                .collection(config.AnswersCollectionName)
                .findOneAndDelete({ _id: objId });

            return res.value;

        } catch (error) {
            console.log("----- DB ERROR: Error finding answer ------")
            throw error;
        }
    }
}
import { IMongoConfig } from "../Types/IMongoConfig";

export var frenchConfig:IMongoConfig = {
    DatabaseName: "FrenchWordsDb",
    WordsCollectionName: "theCollectionWithoutDuplicates",
    AnswersCollectionName: "frenchAnswersCollection"
}

export var mongoConnectionString = "mongodb://host.docker.internal:8080";
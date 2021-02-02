import { Router } from 'express';

import FrenchController from '../Controllers/French';

import DatabaseService from '../Services/db.service';
import FrenchService from '../Services/french.service';

import { mongoConnectionString } from '../Config/MongoConfig';
import bodyParser from 'body-parser';


const jsonParser = bodyParser.json();

const router:Router = Router();

const dbService:DatabaseService = new DatabaseService(mongoConnectionString);
const frenchService:FrenchService = new FrenchService(dbService);

const frenchController:FrenchController = new FrenchController(frenchService);

router.get('/french', frenchController.handleGetQuestion);

router.get('/french/:wordType', (req, res) => {
    frenchController.handleGetQuestionWithWordType(req, res);
})

router.post('/french', jsonParser, (req, res) => {
    frenchController.handleSubmitAnswer(req, res)
});

export default router;
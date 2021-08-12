import express from 'express';
import bodyParser from 'body-parser';
import user_routes from "./handlers/user";

const app: express.Application = express();
const address: string = '0.0.0.0:3000';
const port: number = 3000;

app.use(bodyParser.json())

user_routes(app);

app.listen(port, function () {
    console.log(`starting app on: ${address}`);
});

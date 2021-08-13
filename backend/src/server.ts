import express from 'express';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import userRoutes from './handlers/user';
import merchantCostRoutes from './handlers/merchantCost';

const app: express.Application = express();

const address: string = '0.0.0.0:3000';
const port: number = 3000;

app.use(fileUpload());

//This is just for dev and local, this would not go to production
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, access-control-allow-origin'
  );
  next();
});

app.use(bodyParser.json());

userRoutes(app);
merchantCostRoutes(app);

app.listen(port, function () {
  console.log(`starting app on: ${address}`);
});

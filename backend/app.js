import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

routes.forEach(route => {
  app.use(`/api/${route.url}`, route.router);
});

app.listen(port, () => {
  console.log(`Listening port ${port}`);
});

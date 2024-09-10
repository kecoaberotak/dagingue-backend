import express, { Application, Request, Response } from 'express';

const app: Application = express();
const port = 4000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello REST API');
});

app.listen(port, () => {
  console.log('Server is running on port:' + port);
});

import{ express }from 'express';
import {cors} from 'cors';
import bodyParser from 'body-parser';
import 'dotenv/config';
import {clerkMiddleware} from '@clerk/express';

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.get('/', (req, res) => {
  res.send('server is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
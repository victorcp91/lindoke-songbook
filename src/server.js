import dotenv from 'dotenv';
import helmet from 'helmet';
import app from './app';

dotenv.config();

app.listen(process.env.PORT || 3000);

app.use(helmet());

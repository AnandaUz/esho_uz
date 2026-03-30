import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';


dotenv.config({ path: '../.env' });

const app = express();

const port = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);



connectDB();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

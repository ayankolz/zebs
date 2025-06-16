import express from "express";
import cors from 'cors';
import { userRouter } from "./routes/userroute.js";
import { irrigationRouter } from "./routes/irrigationroute.js";
import { sensorsRouter } from "./routes/sensorsroute.js";
import { systemRouter } from "./routes/systemroute.js";
import { motionRouter } from "./routes/motionroute.js";



const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT'],
    credentials: true
  }));

app.use(express.json());

app.use('/auth', userRouter);
app.use('/auth', systemRouter);
app.use('/auth', irrigationRouter);
app.use('/auth', sensorsRouter);
app.use('/auth', motionRouter)

// Use PORT from environment, fallback to 3005 locally
const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`${PORT} Server is running`);
});
app.get('/', (req, res) => {
  res.send('Backend server is running successfully!');
});

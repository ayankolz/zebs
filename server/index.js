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

app.listen(3005, () => {
    console.log("3005 Server is running");
});
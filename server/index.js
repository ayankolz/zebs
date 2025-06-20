import express from "express";
import cors from 'cors';
import { userRouter } from "./routes/userroute.js";
import { irrigationRouter } from "./routes/irrigationroute.js";
import { sensorsRouter } from "./routes/sensorsroute.js";
import { systemRouter } from "./routes/systemroute.js";
import { motionRouter } from "./routes/motionroute.js";
import { config } from "./config.js";
import dotenv from 'dotenv';
dotenv.config();



const app = express();

app.use(cors({
    origin: ["https://client-m28c.onrender.com"],
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
console.log('🔍 MQTT config:', {
    mqttUri: config.mqttUri,
    mqttUsername: config.mqttUsername,
    mqttClientId: config.mqttClientId
});
app.listen(PORT, () => {
  console.log(`${PORT} Server is running`);
});
app.get('/', (req, res) => {
  res.send('Backend server is running successfully!');
});

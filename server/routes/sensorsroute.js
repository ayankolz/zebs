import express from 'express';
import { db } from './db.js';

const router = express.Router();

async function getSensorsData(microcontroller, res) {
    try {
        const sensorsCollection = db.collection('sensors');
        const data = await sensorsCollection
            .find({ microcontroller })
            .sort({ timestamp: -1 })
            .toArray();

        res.json(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

router.get('/sensors1', (req, res) => getSensorsData(1, res));
router.get('/sensors2', (req, res) => getSensorsData(2, res));
router.get('/sensors3', (req, res) => getSensorsData(3, res));
router.get('/sensors4', (req, res) => getSensorsData(4, res));

export { router as sensorsRouter };

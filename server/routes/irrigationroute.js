import express from 'express';
import { db } from './db.js';

const router = express.Router();

async function getIrrigationData(microcontroller, res) {
    try {
        const irrigationCollection = db.collection('irrigation');
        const data = await irrigationCollection
            .find({ microcontroller })
            .sort({ timestamp: -1 })
            .toArray();

        res.json(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

router.get('/irrigation1', (req, res) => getIrrigationData(1, res));
router.get('/irrigation2', (req, res) => getIrrigationData(2, res));
router.get('/irrigation3', (req, res) => getIrrigationData(3, res));
router.get('/irrigation4', (req, res) => getIrrigationData(4, res));

export { router as irrigationRouter };

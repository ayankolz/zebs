import express from 'express';
import { db } from '../db.js';

const router = express.Router();

async function getMotionData(microcontroller, res) {
    try {
        const motionCollection = db.collection('motion');
        const data = await motionCollection
            .find({ microcontroller })
            .sort({ timestamp: -1 })
            .toArray();

        res.json(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

router.get('/motion1', (req, res) => getMotionData(1, res));
router.get('/motion2', (req, res) => getMotionData(2, res));
router.get('/motion3', (req, res) => getMotionData(3, res));
router.get('/motion4', (req, res) => getMotionData(4, res));

export { router as motionRouter };

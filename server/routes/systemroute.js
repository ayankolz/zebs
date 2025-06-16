import express from 'express';
import { db } from './db.js';

const router = express.Router();

async function getSystemData(microcontroller, res) {
    try {
        const systemCollection = db.collection('system');
        const data = await systemCollection
            .find({ microcontroller })
            .sort({ timestamp: -1 })
            .toArray();

        res.json(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

router.get('/system1', (req, res) => getSystemData(1, res));
router.get('/system2', (req, res) => getSystemData(2, res));
router.get('/system3', (req, res) => getSystemData(3, res));
router.get('/system4', (req, res) => getSystemData(4, res));

export { router as systemRouter };

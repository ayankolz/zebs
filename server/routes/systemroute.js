import express from 'express';
import { con } from '../utils/db.js';
const router = express.Router();



router.get('/system1', (req, res) => {
    con.query("SELECT * FROM `system` WHERE microcontroller = 1 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

router.get('/system2', (req, res) => {
    con.query("SELECT * FROM `system` WHERE microcontroller = 2 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
router.get('/system3', (req, res) => {
    con.query("SELECT * FROM `system` WHERE microcontroller = 3 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
router.get('/system4', (req, res) => {
    con.query("SELECT * FROM `system` WHERE microcontroller = 4 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

export { router as systemRouter };

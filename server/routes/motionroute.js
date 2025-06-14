import express from 'express';
import { con } from '../utils/db.js';

const router = express.Router();

router.get('motion1',  (req, res) => {
    con.query("SELECT * FROM motion WHERE microcontroller = 1 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
router.get('motion2',  (req, res) => {
    con.query("SELECT * FROM motion WHERE microcontroller = 2 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
router.get('motion3',  (req, res) => {
    con.query("SELECT * FROM motion WHERE microcontroller = 3 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
router.get('/motion4',  (req, res) => {
    con.query("SELECT * FROM motion WHERE microcontroller = 4 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
export { router as motionRouter };

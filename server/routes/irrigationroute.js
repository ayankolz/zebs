import express from 'express';
import { con } from '../utils/db.js';

const router = express.Router();

router.get('/irrigation1',  (req, res) => {
    con.query("SELECT * FROM irrigation WHERE microcontroller = 1 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
router.get('/irrigation2',  (req, res) => {
    con.query("SELECT * FROM irrigation WHERE microcontroller = 2 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
router.get('/irrigation3',  (req, res) => {
    con.query("SELECT * FROM irrigation WHERE microcontroller = 3 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
router.get('/irrigation4',  (req, res) => {
    con.query("SELECT * FROM irrigation WHERE microcontroller = 4 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
export { router as irrigationRouter };

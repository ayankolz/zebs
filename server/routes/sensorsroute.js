import express from 'express';
import { con } from '../utils/db.js';
const router = express.Router();

router.get('/sensors1', (req, res) => {
    con.query("SELECT * FROM sensors WHERE microcontroller = 1 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
router.get('/sensors2', (req, res) => {
    con.query("SELECT * FROM sensors WHERE microcontroller = 2 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
router.get('/sensors3', (req, res) => {
    con.query("SELECT * FROM sensors WHERE microcontroller = 3 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
})
router.get('/sensors4', (req, res) => {
    con.query("SELECT * FROM sensors WHERE microcontroller = 4 ORDER BY timestamp DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
})


export { router as sensorsRouter }

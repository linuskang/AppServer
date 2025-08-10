const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Pub', 'index.html'));
});

router.get('/src/styles', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Pub', 'styles.css'));
});

module.exports = router;
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'homepage', 'index.html'));
});

router.get('/homepage/css', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'homepage', 'styles.css'));
});

module.exports = router;
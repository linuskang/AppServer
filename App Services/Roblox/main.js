const express = require('express');
const axios = require('axios');
const router = express.Router();
const { logger } = require('../../src/utils/winston');
const log = logger();

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

router.post('/webhook', async (req, res) => {
    const { webhookUrl, embed, content } = req.body;
    if (!webhookUrl || (!embed && !content)) {
        return res.status(400).json({ error: 'Missing webhookUrl or message content/embed' });
    }
    const payload = {};
    if (embed) {
        payload.embeds = [embed];
    }
    if (content) {
        payload.content = content;
    }
    try {
        await axios.post(webhookUrl, payload);
        log.info(`[webhook] Sent message to ${webhookUrl}. Payload: ${JSON.stringify(payload)}`);
        res.status(200).json({ success: true, message: 'Message sent!' });
    } catch (err) {
        log.error(err.message);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

module.exports = router;

//curl -X POST https://app.linuskang.au/rblx/webhook   -H "Content-Type: application/json"   -d '{ "webhookUrl": "https://discord.com/api/webhooks/1369184356048048170/EN0euO98kvLK3nHCg5xmV8Zjjlga_17slP31hLvar3opzzvOGzJLcwkygrSw4dlSWeXe", "content": "Hello from curl!", "embed": { "title": "Test Embed", "description": "This is a test embed" }}'
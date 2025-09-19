const { express, axios, router, log, auth } = require('../../App/Utils/modules');

log.info("Example service initialized!");

router.get('/', (req, res) => {
    res.json('Hello world!');
});

module.exports = router;
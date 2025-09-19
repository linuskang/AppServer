# App Server

A micro-api server for running small backend functions.

## Getting Started

```bash
git clone https://github.com/linuskang/AppServer
cd AppServer
npm install

cp .env.example .env # Edit configuration here

npm run dev # Start server
```

## Creating compute functions

Create a new entry inside of ``App Services/services.js`` with the following scaffold:

```json
{
    name: "Example Service",
    location: "ExampleService/main.js",
    path: "example"
}
```

Next, you will need to create a folder with your ``location`` as the name. Each folder should contain a file named ``main.js`` as the root of the endpoint, containing the following:

```js
const { express, axios, router, log, auth } = require('../../App/Utils/modules');

log.info("Example service initialized!");

router.get('/', (req, res) => {
    res.json('Hello world!');
});

module.exports = router;
```

Save your endpoint, restart your app server and it should work.

We also provide some functions to protect your API endpoints, like the ``auth`` and ``log`` functions. Usage:

```js
// Protect api endpoints with API key from .env
router.get('/', auth, (req, res) => {
    res.json('Hello world!');
});

// Log to server.log file
log.info('This is info')
log.warn('This is warn')
log.error('This is error')
```

## License

AppServer is under the **CC BY-NC 4.0**. See [LICENSE](LICENSE) for more details.

## Credit

Project by Linus Kang.
const app = require('./src/app');
const http = require('http');
const { PORT } = require('./src/config/env');

const port = PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

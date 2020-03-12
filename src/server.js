const app = require('./app');

const port = process.env.PORT || 8080;

app.listen(port, 'localhost', err => {
  if (err) throw err;
  console.log('server listening on port ' + port);
});

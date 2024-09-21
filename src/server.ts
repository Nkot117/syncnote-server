import app from './app.js';

const port = process.env.DEV_PORT || 8080;
app.listen(port, () => {
  console.log(`Server Start! PORT=${port}`);
});
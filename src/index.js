import app from './app.js';

const PORT = 4321;

app.listen(PORT, () => {
  console.log(`API Copa Mundial FIFA escuchando en http://localhost:${PORT}`);
});

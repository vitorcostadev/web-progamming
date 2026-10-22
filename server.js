const express = require('express');
const app = express();
const port = 3000;

let obras = [];

app.use(express.static('public'));
app.use(express.json());

app.get('/obras', (req, res) => {
  res.json(obras);
});

app.post('/obras', (req, res) => {
  let newObra = req.body;
  obras.push(newObra);
  res.status(201).json(newObra);
});

app.delete('/obras/:id', (req, res) => {
  const id = Number(req.params.id);
  obras = obras.filter(obra => obra.id !== id);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
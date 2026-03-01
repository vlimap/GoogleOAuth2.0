const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const { engine } = require('express-handlebars');
const booksRouter = require('./routes/books.routes');

const app = express();
const port = process.env.PORT || 3000;

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    helpers: {
      currency: (value) =>
        Number(value).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
    }
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.redirect('/livros');
});

app.use('/livros', booksRouter);

app.use((_req, res) => {
  res.status(404).render('404', {
    title: 'Página não encontrada'
  });
});

app.listen(port, () => {
  console.log(`Servidor da livraria rodando em http://localhost:${port}`);
});

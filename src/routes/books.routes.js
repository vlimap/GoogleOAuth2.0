const express = require('express');
const {
  createBook,
  listBooks,
  findBookById,
  updateBook,
  deleteBook,
  defaultBook
} = require('../data/books.store');

const router = express.Router();

router.get('/', (_req, res) => {
  res.render('books/index', {
    title: 'Livraria - Catálogo',
    books: listBooks()
  });
});

router.get('/novo', (_req, res) => {
  res.render('books/form', {
    title: 'Novo livro',
    formTitle: 'Cadastrar livro',
    formAction: '/livros',
    method: 'POST',
    book: defaultBook()
  });
});

router.post('/', (req, res) => {
  const book = createBook(req.body);
  res.redirect(`/livros/${book.id}`);
});

router.get('/:id', (req, res) => {
  const book = findBookById(req.params.id);

  if (!book) {
    return res.status(404).render('404', {
      title: 'Livro não encontrado'
    });
  }

  return res.render('books/show', {
    title: `Livro - ${book.title}`,
    book
  });
});

router.get('/:id/editar', (req, res) => {
  const book = findBookById(req.params.id);

  if (!book) {
    return res.status(404).render('404', {
      title: 'Livro não encontrado'
    });
  }

  return res.render('books/form', {
    title: `Editar - ${book.title}`,
    formTitle: 'Editar livro',
    formAction: `/livros/${book.id}?_method=PUT`,
    method: 'POST',
    book
  });
});

router.put('/:id', (req, res) => {
  const updated = updateBook(req.params.id, req.body);

  if (!updated) {
    return res.status(404).render('404', {
      title: 'Livro não encontrado'
    });
  }

  return res.redirect(`/livros/${req.params.id}`);
});

router.delete('/:id', (req, res) => {
  const deleted = deleteBook(req.params.id);

  if (!deleted) {
    return res.status(404).render('404', {
      title: 'Livro não encontrado'
    });
  }

  return res.redirect('/livros');
});

module.exports = router;

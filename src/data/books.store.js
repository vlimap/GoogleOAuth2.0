const createNormalizedBook = (input = {}) => ({
  title: String(input.title || '').trim(),
  author: String(input.author || '').trim(),
  genre: String(input.genre || '').trim(),
  price: Number(input.price || 0),
  stock: Number(input.stock || 0)
});

const defaultBook = () => ({
  title: '',
  author: '',
  genre: '',
  price: 0,
  stock: 0
});

const state = {
  nextId: 4,
  books: [
    {
      id: 1,
      title: 'Dom Casmurro',
      author: 'Machado de Assis',
      genre: 'Romance',
      price: 39.9,
      stock: 12,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Vidas Secas',
      author: 'Graciliano Ramos',
      genre: 'Romance',
      price: 34.5,
      stock: 8,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: 'O Cortiço',
      author: 'Aluísio Azevedo',
      genre: 'Realismo',
      price: 29.9,
      stock: 5,
      createdAt: new Date().toISOString()
    }
  ]
};

const listBooks = () => [...state.books];

const findBookById = (id) => state.books.find((book) => book.id === Number(id));

const createBook = (payload) => {
  const normalized = createNormalizedBook(payload);
  const book = {
    id: state.nextId,
    ...normalized,
    createdAt: new Date().toISOString()
  };

  state.nextId += 1;
  state.books.push(book);

  return book;
};

const updateBook = (id, payload) => {
  const index = state.books.findIndex((book) => book.id === Number(id));

  if (index === -1) {
    return null;
  }

  state.books[index] = {
    ...state.books[index],
    ...createNormalizedBook(payload)
  };

  return state.books[index];
};

const deleteBook = (id) => {
  const index = state.books.findIndex((book) => book.id === Number(id));

  if (index === -1) {
    return false;
  }

  state.books.splice(index, 1);
  return true;
};

module.exports = {
  defaultBook,
  listBooks,
  findBookById,
  createBook,
  updateBook,
  deleteBook
};

// ==================== ELEMENTOS ====================
const barraBusca = document.getElementById('ph');
const booksContainer = document.getElementById('books-container');
const filterBtns = document.querySelectorAll('.filter-btn');
const resultsCount = document.getElementById('results-count');
const favoritesToggle = document.querySelector('.favorites-btn');
const notification = document.getElementById('notification');

// ==================== DADOS ====================
let currentFilter = 'all';
let showingFavoritesOnly = false;
const books = document.querySelectorAll('.livro-card');

// Inicializar categorias únicas
const categories = new Set();
books.forEach(book => {
  const category = book.dataset.category;
  if (category) categories.add(category);
});

// ==================== INICIALIZAÇÃO ====================
function init() {
  loadFavorites();
  renderCategories();
  renderBooks();
  setupEventListeners();
}

// ==================== FAVORITOS - LOCALSTORAGE ====================
function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem('livrosFavoritos')) || [];
  books.forEach(book => {
    const titulo = book.dataset.titulo;
    if (favorites.includes(titulo)) {
      book.classList.add('favorited');
      const btn = book.querySelector('.favorite-btn');
      btn.textContent = '❤️';
      btn.classList.add('favorited');
    }
  });
}

function saveFavorites() {
  const favorites = Array.from(document.querySelectorAll('.livro-card.favorited'))
    .map(book => book.dataset.titulo);
  localStorage.setItem('livrosFavoritos', JSON.stringify(favorites));
}

function toggleFavorite(book) {
  const btn = book.querySelector('.favorite-btn');
  book.classList.toggle('favorited');
  btn.classList.toggle('favorited');

  if (book.classList.contains('favorited')) {
    btn.textContent = '❤️';
    showNotification('✨ Adicionado aos favoritos!');
  } else {
    btn.textContent = '🤍';
    showNotification('💔 Removido dos favoritos');
  }

  saveFavorites();
}

// ==================== RENDERIZAR CATEGORIAS ====================
function renderCategories() {
  const categoryFilters = document.getElementById('category-filters');
  const sortedCategories = Array.from(categories).sort();

  let html = '<button class="filter-btn active" data-category="all">Todos</button>';

  const categoryLabels = {
    'clássico': '📕 Clássico',
    'mistério': '🔍 Mistério',
    'infantil': '🧸 Infantil',
    'ensaio': '📖 Ensaio',
    'romance': '💕 Romance',
    'ficção-científica': '🚀 Ficção Científica',
    'biografia': '🎭 Biografia',
    'poesia': '✨ Poesia',
    'filosofia': '🤔 Filosofia',
    'contemporâneo': '🌟 Contemporâneo'
  };

  sortedCategories.forEach(category => {
    const label = categoryLabels[category] || category;
    html += `<button class="filter-btn" data-category="${category}">${label}</button>`;
  });

  categoryFilters.innerHTML = html;

  // Re-attach event listeners
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', filterByCategory);
  });
}

// ==================== FILTRAR POR CATEGORIA ====================
function filterByCategory(e) {
  currentFilter = e.target.dataset.category;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');
  renderBooks();
}



// ==================== RENDERIZAR LIVROS ====================
function renderBooks() {
  let visibleBooks = Array.from(books).filter(book => {
    // Filtro de categoria
    const categoryMatch = currentFilter === 'all' || book.dataset.category === currentFilter;
    // Filtro de favoritos
    const favoritesMatch = !showingFavoritesOnly || book.classList.contains('favorited');

    return categoryMatch && favoritesMatch;
  });

  // Atualizar visibilidade
  books.forEach(book => {
    if (visibleBooks.includes(book)) {
      book.style.display = 'flex';
      book.style.animation = 'fadeIn 0.4s ease';
    } else {
      book.style.display = 'none';
    }
  });

  // Mensagem de nenhum resultado
  const msgAnterior = document.getElementById('sem-resultados');
  if (msgAnterior) msgAnterior.remove();

  if (visibleBooks.length === 0) {
    const msg = document.createElement('p');
    msg.id = 'sem-resultados';
    msg.innerHTML = showingFavoritesOnly
      ? '💔 Nenhum livro favoritado ainda. Comece adicionando seus preferidos!'
      : '🔍 Nenhum livro encontrado com esses critérios.';
    booksContainer.appendChild(msg);
  }

  // Atualizar contagem
  updateResultsCount(visibleBooks.length);
}

// ==================== BUSCA ====================
barraBusca.addEventListener('input', (e) => {
  const termoBusca = e.target.value.toLowerCase().trim();

  let visibleBooks = Array.from(books).filter(book => {
    const titulo = book.dataset.titulo.toLowerCase();
    const autor = book.dataset.autor.toLowerCase();
    const categoryMatch =
      currentFilter === 'all' || book.dataset.category === currentFilter;
    const favoritesMatch =
      !showingFavoritesOnly || book.classList.contains('favorited');
    const searchMatch = termoBusca === '' || titulo.includes(termoBusca) || autor.includes(termoBusca);

    return categoryMatch && favoritesMatch && searchMatch;
  });

  // Aplicar ordenação
  visibleBooks = sortBooks(visibleBooks);

  // Atualizar visibilidade
  books.forEach(book => {
    if (visibleBooks.includes(book)) {
      book.style.display = 'flex';
    } else {
      book.style.display = 'none';
    }
  });

  // Mensagem sem resultados
  const msgAnterior = document.getElementById('sem-resultados');
  if (msgAnterior) msgAnterior.remove();

  if (visibleBooks.length === 0 && termoBusca !== '') {
    const msg = document.createElement('p');
    msg.id = 'sem-resultados';
    msg.innerHTML = `🔍 Nenhum livro encontrado para "<strong>${e.target.value}</strong>"`;
    booksContainer.appendChild(msg);
  }

  updateResultsCount(visibleBooks.length);
});

// ==================== FAVORITOS TOGGLE ====================
favoritesToggle.addEventListener('click', () => {
  showingFavoritesOnly = !showingFavoritesOnly;
  favoritesToggle.classList.toggle('active');

  if (showingFavoritesOnly) {
    favoritesToggle.textContent = '❤️ Meus Favoritos';
    showNotification('💕 Mostrando apenas favoritos');
  } else {
    favoritesToggle.textContent = '❤️ Favoritos';
    showNotification('📚 Mostrando todos os livros');
  }

  barraBusca.value = '';
  renderBooks();
});

// ==================== ATUALIZAR CONTAGEM ====================
function updateResultsCount(count) {
  resultsCount.textContent = `${count} ${count === 1 ? 'livro' : 'livros'}`;
}

// ==================== NOTIFICAÇÃO ====================
function showNotification(message) {
  notification.textContent = message;
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 2000);
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Botões de favorito
  books.forEach(book => {
    const btn = book.querySelector('.favorite-btn');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(book);
    });
  });
}

// ==================== INICIAR ====================
document.addEventListener('DOMContentLoaded', init);
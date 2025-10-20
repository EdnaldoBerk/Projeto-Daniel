// Dados mockados para teste (posteriormente serão substituídos pela API)
const mockBooks = [
    {
        id: 1,
        title: 'Dom Casmurro',
        author: 'Machado de Assis',
        genre: 'Ficção',
        rating: 4.8,
        reviews: 150,
        cover: 'https://exemplo.com/dom-casmurro.jpg'
    },
    // Adicione mais livros aqui
];

// Função para criar card de livro
function createBookCard(book) {
    return `
        <div class="book-card">
            <img src="${book.cover}" alt="${book.title}" onerror="this.src='assets/default-book-cover.jpg'">
            <h3>${book.title}</h3>
            <p>Autor: ${book.author}</p>
            <p>Gênero: ${book.genre}</p>
            <p>Avaliação: ${book.rating}/5 (${book.reviews} reviews)</p>
            <button onclick="viewBook(${book.id})">Ver Detalhes</button>
        </div>
    `;
}

// Função para renderizar livros
function renderBooks(books) {
    const container = document.querySelector('.books-container');
    container.innerHTML = books.map(book => createBookCard(book)).join('');
}

// Função para filtrar livros
function filterBooks(genre) {
    if (genre === 'Todos') {
        return renderBooks(mockBooks);
    }
    const filteredBooks = mockBooks.filter(book => book.genre === genre);
    renderBooks(filteredBooks);
}

// Função para pesquisar livros
function searchBooks(query) {
    const filteredBooks = mockBooks.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );
    renderBooks(filteredBooks);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Renderizar todos os livros inicialmente
    renderBooks(mockBooks);

    // Configurar a barra de pesquisa
    const searchBar = document.querySelector('.search-bar');
    searchBar.addEventListener('input', (e) => searchBooks(e.target.value));

    // Configurar os botões de filtro
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => filterBooks(button.textContent));
    });
});
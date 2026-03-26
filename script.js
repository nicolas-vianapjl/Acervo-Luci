const barraBusca = document.getElementById('ph');
const livros = document.querySelectorAll('.livro-card');
const container = document.querySelector('.container-acervo');

barraBusca.addEventListener('input', () => {
    const termoBusca = barraBusca.value.toLowerCase();
    let temResultados = false;
    
    livros.forEach(livro => {
        const titulo = livro.querySelector('h3').innerText.toLowerCase();
        const autor = livro.querySelector('p').innerText.toLowerCase();
        
        // Busca por título OU autor
        if (titulo.includes(termoBusca) || autor.includes(termoBusca)) {
            livro.style.display = "flex";
            temResultados = true;
        } else {
            livro.style.display = "none";
        }
    });
    
    // Remove mensagem anterior se existir
    const msgAnterior = document.getElementById('sem-resultados');
    if (msgAnterior) msgAnterior.remove();
    
    // Mostra mensagem se não houver resultados e o campo não estiver vazio
    if (!temResultados && termoBusca.trim() !== '') {
        const msg = document.createElement('p');
        msg.id = 'sem-resultados';
        msg.style.cssText = 'grid-column: 1 / -1; text-align: center; color: #666; margin-top: 20px;';
        msg.textContent = 'Nenhum livro encontrado para sua busca.';
        container.appendChild(msg);
    }
});
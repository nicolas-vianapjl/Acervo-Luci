const barraBusca = document.getElementById('ph'); // Seleciona o campo de entrada
      const livros = document.querySelectorAll('.livro-card'); // Seleciona todos os cards
  
      barraBusca.addEventListener('input', () => {
          const termoBusca = barraBusca.value.toLowerCase(); // O que o usuário digitou
  
          livros.forEach(livro => {
              const titulo = livro.querySelector('h3').innerText.toLowerCase();
              
              // Se o título contém o que foi digitado, mostra o card. Se não, esconde.
              if (titulo.includes(termoBusca)) {
                  livro.style.display = "flex"; // Mostra o card
              } else {
                  livro.style.display = "none"; // Esconde o card
              }
          });
      });
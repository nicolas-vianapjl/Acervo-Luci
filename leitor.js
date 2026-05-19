const livros = {
  "prosas-odes-minimas": {
    titulo: "Prosas seguidas de odes mínimas",
    autor: "José Paulo Paes",
    arquivo: "pdfs/prosas-odes-minimas.pdf"
  },

  "olhos-dagua": {
    titulo: "Olhos d’água",
    autor: "Conceição Evaristo",
    arquivo: "pdfs/olhos-dagua.pdf"
  },

  "vida-nao-util": {
    titulo: "A vida não é útil",
    autor: "Ailton Krenak",
    arquivo: "pdfs/Ailton-Krenak-A-Vida-Nao-E-Util-2020.pdf"
  },

  "gonzaga-de-sa": {
    titulo: "Vida e morte de M.J. Gonzaga de Sá",
    autor: "Lima Barreto",
    arquivo: "pdfs/gonzaga-de-sa.pdf"
  },

  "no-seu-pescoco": {
    titulo: "No seu pescoço",
    autor: "Chimamanda Ngozi Adichie",
    arquivo: "pdfs/no-seu-pescoco.pdf"
  },

  "morangos-mofados": {
    titulo: "Morangos mofados",
    autor: "Caio Fernando Abreu",
    arquivo: "pdfs/morangos-mofados.pdf"
  },

  "bras-cubas": {
    titulo: "Memórias Póstumas de Brás Cubas",
    autor: "Machado de Assis",
    arquivo: "pdfs/bras-cubas.pdf"
  },

  "cancoes-escolhidas": {
    titulo: "Canções escolhidas",
    autor: "Paulo César Pinheiro",
    arquivo: "pdfs/cancoes-escolhidas.pdf"
  },

  "funerais-mamae-grande": {
    titulo: "Os funerais da Mamãe Grande",
    autor: "Gabriel García Márquez",
    arquivo: "pdfs/funerais-mamae-grande.pdf"
  },

  "opusculo-humanitario": {
    titulo: "Opúsculo Humanitário",
    autor: "Nísia Floresta",
    arquivo: "pdfs/opusculo-humanitario.pdf"
  },

  "nebulosas": {
    titulo: "Nebulosas",
    autor: "Narcisa Amália",
    arquivo: "pdfs/nebulosas.pdf"
  },

  "memorias-de-martha": {
    titulo: "Memórias de Martha",
    autor: "Julia Lopes de Almeida",
    arquivo: "pdfs/memorias-de-martha.pdf"
  },

  "caminho-de-pedras": {
    titulo: "Caminho de Pedras",
    autor: "Rachel de Queiroz",
    arquivo: "pdfs/caminho-de-pedras.pdf"
  },

  "paixao-gh": {
    titulo: "A paixão segundo G.H.",
    autor: "Clarice Lispector",
    arquivo: "pdfs/paixao-gh.pdf"
  },

  "geografia": {
    titulo: "Geografia",
    autor: "Sophia de Mello Breyner Andresen",
    arquivo: "pdfs/geografia.pdf"
  },

  "balada-amor-vento": {
    titulo: "Balada de Amor ao Vento",
    autor: "Paulina Chiziane",
    arquivo: "pdfs/balada-amor-vento.pdf"
  },

  "cancao-ninar-menino-grande": {
    titulo: "Canção para Ninar Menino Grande",
    autor: "Conceição Evaristo",
    arquivo: "pdfs/cancao-ninar-menino-grande.pdf"
  },

  "visao-das-plantas": {
    titulo: "A Visão das Plantas",
    autor: "Djaimilia Pereira de Almeida",
    arquivo: "pdfs/visao-das-plantas.pdf"
  },

  "dom-casmurro": {
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    arquivo: "pdfs/dom-casmurro.pdf"
  },

  "sherlock-holmes": {
    titulo: "The Adventure of Sherlock Holmes",
    autor: "Sir Arthur Conan Doyle",
    arquivo: "pdfs/sherlock-holmes.pdf"
  },

  "extraordinario": {
    titulo: "O Extraordinário",
    autor: "R.J Palacio",
    arquivo: "pdfs/extraordinario.pdf"
  },

  "manual-antirracista": {
    titulo: "Pequeno Manual Antirracista",
    autor: "Djamila Ribeiro",
    arquivo: "pdfs/PequenoManual Antirracista-DjamilaRibeiro.pdf"
  },

  "menina-roubava-livros": {
    titulo: "A Menina que Roubava Livros",
    autor: "Markus Zusak",
    arquivo: "pdfs/menina-roubava-livros.pdf"
  },

  "fahrenheit-451": {
    titulo: "Fahrenheit 451",
    autor: "Ray Bradbury",
    arquivo: "pdfs/fahrenheit-451.pdf"
  },

  "diario-anne-frank": {
    titulo: "Diário de Anne Frank",
    autor: "Otto H. e Mirjam Pressler",
    arquivo: "pdfs/diario-anne-frank.pdf"
  },

  "pequeno-principe": {
    titulo: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry",
    arquivo: "pdfs/pequeno-principe.pdf"
  },

  "o-cortico": {
    titulo: "O Cortiço",
    autor: "Aluísio de Azevedo",
    arquivo: "pdfs/o-cortico.pdf"
  },

  "as-primaveras": {
    titulo: "As Primaveras",
    autor: "Casimiro de Abreu",
    arquivo: "pdfs/as-primaveras.pdf"
  },

  "culpa-das-estrelas": {
    titulo: "A Culpa é das Estrelas",
    autor: "John Green",
    arquivo: "pdfs/culpa-das-estrelas.pdf"
  }
};

const params = new URLSearchParams(window.location.search);
const livroId = params.get("livro");

const livro = livros[livroId];

if (!livro) {
  document.getElementById("tituloLivro").textContent = "Livro não encontrado";
  throw new Error("Livro não encontrado");
}

document.getElementById("tituloLivro").textContent = livro.titulo;

const url = livro.arquivo;

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

let pdfDoc = null;
let pagina = 1;
let scale = 1.5;

const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");

pdfjsLib.getDocument(url).promise.then(pdf => {
  pdfDoc = pdf;

  document.getElementById("totalPaginas").textContent = pdf.numPages;

  mostrarPagina(pagina);
}).catch(err => {
  console.error("Erro ao carregar PDF:", err);
  document.getElementById("tituloLivro").textContent = "Erro ao carregar PDF";
});

function mostrarPagina(num) {
  pdfDoc.getPage(num).then(page => {
    const viewport = page.getViewport({ scale: scale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    page.render({
      canvasContext: ctx,
      viewport: viewport
    });

    document.getElementById("paginaAtual").textContent = num;
  });
}

function animar() {
  const livroElemento = document.querySelector(".livro");

  livroElemento.classList.add("virando");

  setTimeout(() => {
    livroElemento.classList.remove("virando");
  }, 300);
}

function proximaPagina() {
  if (pdfDoc && pagina < pdfDoc.numPages) {
    pagina++;
    animar();
    mostrarPagina(pagina);
  }
}

function voltarPagina() {
  if (pdfDoc && pagina > 1) {
    pagina--;
    animar();
    mostrarPagina(pagina);
  }
}
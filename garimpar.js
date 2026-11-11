// Faixa em loop infinito: repete a lista até cobrir qualquer largura de tela
const VELOCIDADE = 50; // pixels por segundo (maior = mais rápido)

const trilho = document.querySelector(".faixa__trilho");
if (trilho) {
  const originais = Array.from(trilho.children);

  function copiar() {
    originais.forEach(function (item) {
      const c = item.cloneNode(true);
      c.setAttribute("aria-hidden", "true");
      trilho.appendChild(c);
    });
  }

  function montar() {
    const passo = trilho.scrollWidth;
    const m = Math.max(1, Math.ceil(window.innerWidth / passo) + 1);
    for (let i = 1; i < 2 * m; i++) copiar();
    trilho.style.setProperty("--duracao", (m * passo) / VELOCIDADE + "s");
  }

  window.addEventListener("load", function () {
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(montar);
  });
}
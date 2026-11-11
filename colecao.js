// Carrossel de fotos da coleção
(function () {
  var car = document.querySelector(".colecao__carrossel");
  if (!car) return;

  var slides = Array.from(car.querySelectorAll(".colecao__slide"));
  var botao = car.querySelector(".colecao__seta");
  var i = 0;

  function mostrar() {
    slides.forEach(function (s, n) {
      var ativo = n === i;
      s.classList.toggle("is-ativo", ativo);
      s.setAttribute("aria-hidden", ativo ? "false" : "true");
    });
        var ultimo = slides.length > 1 && i === slides.length - 1;
        car.classList.toggle("colecao__carrossel--volta", ultimo && car.dataset.volta !== "nao");
    botao.setAttribute("aria-label", ultimo ? "Voltar à primeira foto" : "Próxima foto");
  }

  botao.addEventListener("click", function () {
    i = (i + 1) % slides.length;
    mostrar();
  });

  mostrar();
})();
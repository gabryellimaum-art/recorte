// Rodapé: no hover da tesoura (ou das letras), a tesoura fecha um pouco e o RE.CORTE se inclina
(function () {
  var rodape = document.getElementById("rodape");
  if (!rodape) return;

  rodape.querySelectorAll(".rodape__alvo").forEach(function (alvo) {
    alvo.addEventListener("mouseenter", function () { rodape.classList.add("rodape--corte"); });
    alvo.addEventListener("mouseleave", function () { rodape.classList.remove("rodape--corte"); });
  });
})();
(function () {
  var raiz = document.documentElement;
  var CHAVE = "recorte-acessibilidade";
  var estado = { tema: "claro", tamanho: 1, cor: "padrao" };

  // lê as preferências salvas
  try {
    var salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (salvo) {
      estado.tema = salvo.tema || estado.tema;
      estado.tamanho = typeof salvo.tamanho === "number" ? salvo.tamanho : estado.tamanho;
      estado.cor = salvo.cor || estado.cor;
    }
  } catch (e) {}

  function aplicar() {
    raiz.setAttribute("data-tema", estado.tema);
    raiz.setAttribute("data-tamanho", String(estado.tamanho));
    raiz.setAttribute("data-cor", estado.cor);
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {}
    atualizarBotoes();
  }

  var painel;

  function atualizarBotoes() {
    if (!painel) return;
    painel.querySelectorAll("[data-tema]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.tema === estado.tema);
    });
    painel.querySelectorAll("[data-cor]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.cor === estado.cor);
    });
    painel.querySelector("[data-tamanho='menos']").disabled = estado.tamanho <= 0;
    painel.querySelector("[data-tamanho='mais']").disabled = estado.tamanho >= 4;
  }

  function montar() {
        var botao = document.querySelector("[data-acess-abrir]");
    var externo = !!botao;
    if (!botao) {
      botao = document.createElement("button");
      botao.className = "acess-botao";
      botao.type = "button";
      botao.setAttribute("aria-label", "Ferramentas de acessibilidade");
      botao.innerHTML = '<img src="img/instrucoes/icone-ferramentas@4x.png" alt="">';
    }
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-controls", "acess-painel");
  

    painel = document.createElement("div");
    painel.className = "acess-painel";
    painel.id = "acess-painel";
    painel.hidden = true;
    painel.setAttribute("role", "dialog");
    painel.setAttribute("aria-label", "Ferramentas de acessibilidade");
    painel.innerHTML =
      '<div class="acess-grupo"><h2>Modo</h2><div class="acess-linha">' +
        '<button type="button" class="acess-opcao" data-tema="claro">Claro</button>' +
        '<button type="button" class="acess-opcao" data-tema="escuro">Escuro</button>' +
      '</div></div>' +
      '<div class="acess-grupo"><h2>Tamanho</h2><div class="acess-linha">' +
        '<button type="button" class="acess-opcao" data-tamanho="menos" aria-label="Diminuir texto">A −</button>' +
        '<button type="button" class="acess-opcao" data-tamanho="mais" aria-label="Aumentar texto">A +</button>' +
      '</div></div>' +
      '<div class="acess-grupo"><h2>Cor</h2><div class="acess-linha">' +
        '<button type="button" class="acess-opcao" data-cor="padrao">Padrão</button>' +
        '<button type="button" class="acess-opcao" data-cor="deuteranopia">Deuteranopia</button>' +
        '<button type="button" class="acess-opcao" data-cor="protanopia">Protanopia</button>' +
        '<button type="button" class="acess-opcao" data-cor="tritanopia">Tritanopia</button>' +
      '</div></div>';

        if (!externo) document.body.appendChild(botao);
    document.body.appendChild(painel);

    function abrir(sim) {
      painel.hidden = !sim;
      botao.setAttribute("aria-expanded", String(sim));
    }

    botao.addEventListener("click", function (e) {
      e.stopPropagation();
      abrir(painel.hidden);
    });

    painel.addEventListener("click", function (e) {
      e.stopPropagation();
      var b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.tema) estado.tema = b.dataset.tema;
      if (b.dataset.cor) estado.cor = b.dataset.cor;
      if (b.dataset.tamanho === "menos") estado.tamanho = Math.max(0, estado.tamanho - 1);
      if (b.dataset.tamanho === "mais") estado.tamanho = Math.min(4, estado.tamanho + 1);
      aplicar();
    });

    // clicar fora ou apertar Esc fecha
    document.addEventListener("click", function () { abrir(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !painel.hidden) { abrir(false); botao.focus(); }
    });

    atualizarBotoes();
  }

  aplicar();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", montar);
  } else {
    montar();
  }
})();
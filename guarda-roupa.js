/* guarda-roupa.js: comportamento da página Guarda-roupa */
(function () {
  var armario = document.getElementById("armario");
  var pecasEl = document.getElementById("pecas");
  var roupasEl = document.getElementById("roupas");
  var corpoImg = document.querySelector(".gr__corpo-img");
  var armarioImg = document.querySelector(".gr__armario-img");
  var abas = document.querySelectorAll(".gr__aba");

  /* TESTE: abra a página com ?teste no fim do endereço para liberar todas as peças.
     Com ?reiniciar volta tudo ao começo. (Apagar estas 2 linhas antes de entregar.) */
  if (/[?&]teste/.test(location.search)) Recorte.liberarTudo();
  if (/[?&]reiniciar/.test(location.search)) Recorte.reiniciar();
    /* MODO AJUSTAR: abra a página com ?ajustar para arrastar as peças no manequim. */
  var AJUSTAR = /[?&]ajustar/.test(location.search);
  if (AJUSTAR) Recorte.liberarTudo();
  Recorte.despir();       /* começa sempre com o manequim sem roupa */
  var colecaoAtual = null;          /* null = mostra todas as peças */

  /* ---------- som da porta ---------- */
  var ARQUIVO_ABRIR = "";           /* ex.: "audio/bau-abrir.mp3" (se vazio, usa o som gerado) */
  var ARQUIVO_FECHAR = "";          /* ex.: "audio/bau-fechar.mp3" */
  var audioCtx = null;

  function somPorta(abrindo) {
    try {
      var arq = abrindo ? ARQUIVO_ABRIR : ARQUIVO_FECHAR;
      if (arq) { new Audio(arq).play(); return; }

      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = audioCtx || new AC();
      var t = audioCtx.currentTime, dur = 0.5;

      /* rangido de madeira: onda serra com tremor, sobe ao abrir e desce ao fechar */
      var osc = audioCtx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(abrindo ? 150 : 300, t);
      osc.frequency.exponentialRampToValueAtTime(abrindo ? 310 : 140, t + dur);
      var vib = audioCtx.createOscillator();
      var vibG = audioCtx.createGain();
      vib.frequency.value = 38;
      vibG.gain.value = 14;
      vib.connect(vibG);
      vibG.connect(osc.frequency);

      var filtro = audioCtx.createBiquadFilter();
      filtro.type = "bandpass";
      filtro.frequency.value = 700;
      filtro.Q.value = 3;
      var g = audioCtx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.35, t + 0.05);
      g.gain.linearRampToValueAtTime(0.25, t + dur - 0.1);
      g.gain.linearRampToValueAtTime(0.0001, t + dur);

      osc.connect(filtro); filtro.connect(g); g.connect(audioCtx.destination);
      osc.start(t); vib.start(t);
      osc.stop(t + dur); vib.stop(t + dur);

      /* "tum" da madeira no fim */
      var q = t + dur - 0.08;
      var o = audioCtx.createOscillator();
      var og = audioCtx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(abrindo ? 120 : 90, q);
      o.frequency.exponentialRampToValueAtTime(40, q + 0.15);
      og.gain.setValueAtTime(abrindo ? 0.35 : 0.7, q);
      og.gain.exponentialRampToValueAtTime(0.001, q + 0.2);
      o.connect(og); og.connect(audioCtx.destination);
      o.start(q); o.stop(q + 0.22);
    } catch (e) {}
  }

  /* ---------- utilidades ---------- */
  function aoCarregar(img, fn) {
    img.addEventListener("load", fn);
    if (img.complete && img.naturalWidth) fn();
  }
  /* ---------- arrumação quando uma coleção está selecionada ---------- */
  var PASSO = 9;        /* distância entre peças da mesma prateleira (% do guarda-roupa) */
  var METADE = 3;       /* metade da largura média de uma peça, para centralizar */

  function grupoDaPeca(q) { return q.y < 38 ? 0 : (q.base ? 2 : 1); }   /* 0 cima, 1 cabide, 2 dobradas */

  function posicaoNaColecao(p) {
    var irmaos = Recorte.PECAS.filter(function (q) {
      return q.colecao === p.colecao && grupoDaPeca(q) === grupoDaPeca(p);
    });
    var i = irmaos.indexOf(p);
    return { x: 50.3 + (i - (irmaos.length - 1) / 2) * PASSO - METADE, y: p.y };
  }
  /* ---------- peças no guarda-roupa ---------- */
  function desenharPecas() {
    pecasEl.innerHTML = "";
    Recorte.PECAS.forEach(function (p) {
      if (colecaoAtual && p.colecao !== colecaoAtual) return;
      if (Recorte.estaVestida(p.id)) return;           /* vestida: sai do armário */
      var livre = Recorte.estaDesbloqueada(p.id);

      var b = document.createElement("button");
      b.type = "button";
      b.className = "gr__peca" + (livre ? "" : " is-bloqueada") + (p.base ? " gr__peca--base" : "");
           var pos = colecaoAtual ? posicaoNaColecao(p) : p;
      b.style.left = pos.x + "%";
      b.style.top = pos.y + "%";
      b.setAttribute("aria-label", livre ? p.nome : "Peça bloqueada");

      var img = document.createElement("img");
      img.alt = "";
      img.src = livre ? p.lado : p.preta;
      aoCarregar(img, function () {
        /* tamanho proporcional ao guarda-roupa (mesma escala do arquivo @4x) */
        if (p.w) b.style.width = p.w + "%";
        else if (armarioImg.naturalWidth) {
          b.style.width = (img.naturalWidth / armarioImg.naturalWidth * 100) + "%";
        }
      });
      b.appendChild(img);

      b.addEventListener("click", function () {
        if (!livre) return;
        Recorte.vestirOuTirar(p.id);
        desenharTudo();
      });
      pecasEl.appendChild(b);
    });
  }

  /* ---------- peças vestidas no manequim ---------- */
  function desenharManequim() {
    roupasEl.innerHTML = "";
    Recorte.PECAS.forEach(function (p) {
      if (!Recorte.estaVestida(p.id)) return;
      var img = document.createElement("img");
      img.className = "gr__roupa";
      img.alt = p.nome;
      img.dataset.id = p.id;
      img.style.left = (p.mx || 0) + "%";
      img.style.top = (p.my || 0) + "%";
      img.style.zIndex = Recorte.ORDEM.indexOf(p.camada) + 1;
      img.src = p.frente;
      aoCarregar(img, function () {
        /* tamanho proporcional ao manequim */
        if (corpoImg.naturalWidth) {
          img.style.width = (img.naturalWidth / corpoImg.naturalWidth * 100) + "%";
        }
      });
      roupasEl.appendChild(img);
    });
  }

  function desenharTudo() { desenharPecas(); desenharManequim(); }

  /* clique no manequim: acha a peça de cima que tem pixel (não transparente) no ponto */
  var canvasCache = {};
  function temPixel(img, e) {
    var r = img.getBoundingClientRect();
    var x = Math.floor((e.clientX - r.left) / r.width * img.naturalWidth);
    var y = Math.floor((e.clientY - r.top) / r.height * img.naturalHeight);
    if (x < 0 || y < 0 || x >= img.naturalWidth || y >= img.naturalHeight) return false;
    try {
      var c = canvasCache[img.src];
      if (!c) {
        c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        c.getContext("2d").drawImage(img, 0, 0);
        canvasCache[img.src] = c;
      }
      return c.getContext("2d").getImageData(x, y, 1, 1).data[3] > 10;
    } catch (err) { return true; }
  }

  function pecaSobMouse(e) {
    var imgs = Array.prototype.slice.call(roupasEl.querySelectorAll(".gr__roupa"));
    imgs.sort(function (a, b) { return b.style.zIndex - a.style.zIndex; });
    for (var i = 0; i < imgs.length; i++) if (temPixel(imgs[i], e)) return imgs[i];
    return null;
  }

  roupasEl.addEventListener("click", function (e) {
     if (AJUSTAR) return;
    var img = pecaSobMouse(e);
    if (!img) return;
    Recorte.vestirOuTirar(img.dataset.id);              /* tira do manequim: volta ao guarda-roupa */
    desenharTudo();
  });

  roupasEl.addEventListener("mousemove", function (e) {
    roupasEl.style.cursor = pecaSobMouse(e) ? "pointer" : "default";
  });
  /* ---------- MODO AJUSTAR (?ajustar) ---------- */
  if (AJUSTAR) {
    var caixa = document.createElement("div");
    caixa.style.cssText = "position:fixed;left:8px;bottom:8px;width:44vw;z-index:9999;" +
      "background:#111;color:#c8f000;font:12px/1.4 monospace;padding:8px 10px;border-radius:6px;";
    caixa.innerHTML =
      '<div style="margin-bottom:6px;color:#fff">Arraste as peças no manequim. Duplo clique tira a peça. ' +
      'Quando terminar, clique em Copiar e cole no pecas.js no lugar do bloco AJUSTE.</div>' +
      '<button type="button" id="copiar-ajuste">Copiar</button>' +
      '<pre id="texto-ajuste" style="margin:6px 0 0;max-height:28vh;overflow:auto;white-space:pre-wrap"></pre>';
    document.body.appendChild(caixa);
    var textoEl = document.getElementById("texto-ajuste");

    var atualizarPainel = function () {
      var linhas = Recorte.PECAS.map(function (p) {
        return "    " + p.id + ": [" + (p.mx || 0).toFixed(1) + ", " + (p.my || 0).toFixed(1) + "]";
      });
      textoEl.textContent = "  var AJUSTE = {\n" + linhas.join(",\n") + "\n  };";
    };
    atualizarPainel();

    document.getElementById("copiar-ajuste").addEventListener("click", function () {
      try { navigator.clipboard.writeText(textoEl.textContent); } catch (err) {}
    });

    var arrastando = null;
    roupasEl.addEventListener("pointerdown", function (e) {
      var img = pecaSobMouse(e);
      if (!img) return;
      var p = Recorte.achar(img.dataset.id);
      arrastando = {
        img: img, p: p, x0: e.clientX, y0: e.clientY,
        mx0: p.mx || 0, my0: p.my || 0, r: roupasEl.getBoundingClientRect()
      };
      roupasEl.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    roupasEl.addEventListener("pointermove", function (e) {
      if (!arrastando) return;
      var a = arrastando;
      a.p.mx = a.mx0 + (e.clientX - a.x0) / a.r.width * 100;
      a.p.my = a.my0 + (e.clientY - a.y0) / a.r.height * 100;
      a.img.style.left = a.p.mx + "%";
      a.img.style.top = a.p.my + "%";
      atualizarPainel();
    });
    roupasEl.addEventListener("pointerup", function () { arrastando = null; });

    roupasEl.addEventListener("dblclick", function (e) {
      var img = pecaSobMouse(e);
      if (!img) return;
      Recorte.vestirOuTirar(img.dataset.id);
      desenharTudo();
    });
  }
  /* ---------- abrir e fechar ---------- */
  function abrir() {
    if (armario.classList.contains("is-aberto")) return;
    mostrarTodas();
    armario.classList.add("is-aberto");
    somPorta(true);
  }

  function fechar() {
    if (!armario.classList.contains("is-aberto")) return;
    armario.classList.remove("is-aberto");
    mostrarTodas();
    somPorta(false);
  }

  document.getElementById("abrir").addEventListener("click", abrir);
  document.getElementById("fechar").addEventListener("click", fechar);
    /* reiniciar: tira todas as roupas do manequim e devolve ao guarda-roupa */
  document.getElementById("reiniciar").addEventListener("click", function () {
    Recorte.despir();
    desenharTudo();
  });
    /* reiniciar jogo completo: apaga todo o progresso para um novo jogador */
  document.getElementById("reiniciar-tudo").addEventListener("click", function () {
    if (!confirm("Reiniciar o jogo completo? Todas as peças voltam a ficar bloqueadas.")) return;
    Recorte.reiniciar();
    if (armario.classList.contains("is-aberto")) fechar();
    mostrarTodas();
    desenharTudo();
  });

  /* ---------- botões das coleções (clicar de novo volta a mostrar todas) ---------- */
  function marcarAtiva() {
    abas.forEach(function (x) {
      x.classList.toggle("is-ativa", x.getAttribute("data-colecao") === colecaoAtual);
    });
  }

  /* volta para a vista com todas as coleções */
  function mostrarTodas() {
    colecaoAtual = null;
    marcarAtiva();
    desenharPecas();
  }

  abas.forEach(function (a) {
    a.addEventListener("click", function () {
      var c = a.getAttribute("data-colecao");
      colecaoAtual = (colecaoAtual === c) ? null : c;
      marcarAtiva();
      desenharPecas();
    });
  });

  aoCarregar(armarioImg, desenharTudo);
  aoCarregar(corpoImg, desenharTudo);
  desenharTudo();
})();





/* nome da peça ao passar o mouse: aviso branco com borda preta */
(function () {
  var armario = document.getElementById("armario");
  if (!armario || !window.Recorte) return;

  var dica = document.createElement("div");
  dica.setAttribute("aria-hidden", "true");
  dica.style.cssText =
    "position:fixed;z-index:9998;pointer-events:none;display:none;padding:.45vw 1vw;" +
    "background:#fff;color:#000;border:.18vw solid #000;" +
    "font:700 .95vw/1.3 Montserrat,sans-serif;white-space:nowrap";
  document.body.appendChild(dica);

  /* esconde o aviso antigo "Peça bloqueada", para ficar só um */
  function esconderAntigo() {
    var alvos = [].slice.call(document.body.children).concat([].slice.call(armario.querySelectorAll("*")));
    alvos.forEach(function (el) {
      if (el === dica) return;
      if (el.textContent.trim() === "Peça bloqueada") {
        el.style.setProperty("display", "none", "important");
      }
    });
  }
  esconderAntigo();
  new MutationObserver(esconderAntigo).observe(document.body, { childList: true });
  new MutationObserver(esconderAntigo).observe(armario, { childList: true, subtree: true });

  function acharPeca(el) {
    var lista = Recorte.PECAS.slice().sort(function (a, b) { return b.id.length - a.id.length; });
    for (var n = 0; el && el !== armario && n < 6; n++, el = el.parentElement) {
      var txt = [
        el.getAttribute("src"), el.getAttribute("data-id"), el.getAttribute("data-peca"),
        el.getAttribute("alt"), el.getAttribute("aria-label"), getComputedStyle(el).backgroundImage
      ].join(" ");
      if (el.dataset) Object.keys(el.dataset).forEach(function (k) { txt += " " + el.dataset[k]; });
      for (var i = 0; i < lista.length; i++) {
        if (txt.indexOf(lista[i].id) > -1) return lista[i];
      }
    }
    return null;
  }

  armario.addEventListener("mousemove", function (e) {
    var dentro = e.target.closest && e.target.closest("#pecas");
    var p = dentro ? acharPeca(e.target) : null;
    if (!p) { dica.style.display = "none"; return; }
    var bloqueada = !Recorte.estaDesbloqueada(p.id);
    dica.innerHTML = p.nome + (bloqueada ? "<br>Peça bloqueada" : "");
    dica.style.left = e.clientX + 16 + "px";
    dica.style.top = e.clientY + 16 + "px";
    dica.style.display = "block";
  });
  armario.addEventListener("mouseleave", function () { dica.style.display = "none"; });
})();
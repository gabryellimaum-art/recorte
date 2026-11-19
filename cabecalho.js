// Barra de navegação fixa: 3 botões, tesoura no meio, 3 botões
(function () {
  var PASTA = "img/garimpar/nav/4x/";

  var ESQUERDA = [
    { rotulo: "Início", icone: "inicio", href: "garimpar.html" },
    { rotulo: "Coleções", icone: "colecoes", menu: true },
    { rotulo: "Guarda-roupa", icone: "guarda-roupa", href: "guarda-roupa.html" }
  ];
  var DIREITA = [
    { rotulo: "Sobre", icone: "sobre", href: "sobre.html" },
    { rotulo: "Ajuda", icone: "ajuda", href: "ajuda.html" },
    { rotulo: "Ajustes", icone: "ajustes", ajustes: true }
  ];
  var COLECOES = [
    { rotulo: "Arretado", id: "arretado", href: "arretado.html" },
    { rotulo: "Faveleiras", id: "faveleiras", href: "faveleiras.html" },
    { rotulo: "Raízes vivas", id: "raizes", href: "raizes-vivas.html" }
  ];

  var arquivo = location.pathname.split("/").pop() || "index.html";

  function el(tag, classe, attrs) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  function montarMenu(caixa, botao) {
    var lista = el("ul", "cabecalho__menu", { id: "menu-colecoes", hidden: "" });
    COLECOES.forEach(function (c) {
      var li = el("li");
      var a = el("a", "", { href: c.href, "data-colecao": c.id });
      a.textContent = c.rotulo;
      li.appendChild(a);
      lista.appendChild(li);
    });
    caixa.appendChild(lista);

    botao.setAttribute("aria-haspopup", "true");
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-controls", "menu-colecoes");

    function abrir() { lista.hidden = false; botao.setAttribute("aria-expanded", "true"); }
    function fechar() { lista.hidden = true; botao.setAttribute("aria-expanded", "false"); }

    botao.addEventListener("click", function () {
      if (lista.hidden) abrir(); else fechar();
    });
    document.addEventListener("click", function (e) {
      if (!caixa.contains(e.target)) fechar();
    }, true);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lista.hidden) { fechar(); botao.focus(); }
    });

    if (COLECOES.some(function (c) { return c.href === arquivo; })) {
      botao.setAttribute("aria-current", "page");
    }
  }

  function criarItem(item) {
    var caixa = el("div", "cabecalho__item");
    var botao;
    if (item.href) {
      botao = el("a", "cab-botao", { href: item.href });
      if (item.href === arquivo) botao.setAttribute("aria-current", "page");
    } else {
      botao = el("button", "cab-botao", { type: "button" });
    }
    if (item.ajustes) botao.setAttribute("data-acess-abrir", "");

    var img = el("img", "cab-icone", {
      src: PASTA + "icone-" + item.icone + "@4x.png",
      alt: "",
      "aria-hidden": "true"
    });
    var texto = el("span");
    texto.textContent = item.rotulo;
    botao.appendChild(img);
    botao.appendChild(texto);
    caixa.appendChild(botao);

    if (item.menu) montarMenu(caixa, botao);
    return caixa;
  }

  var cabecalho = el("header", "cabecalho");
  var nav = el("nav", "cabecalho__nav", { "aria-label": "Principal" });

  var esq = el("div", "cabecalho__grupo");
  ESQUERDA.forEach(function (i) { esq.appendChild(criarItem(i)); });

  var tesoura = el("div", "cabecalho__tesoura", { "aria-hidden": "true" });
  tesoura.appendChild(el("img", "tesoura__fechada", { src: PASTA + "tesoura@4x.png", alt: "" }));
  tesoura.appendChild(el("img", "tesoura__aberta", { src: PASTA + "tesoura-aberta@4x.png", alt: "" }));

  var dir = el("div", "cabecalho__grupo");
  DIREITA.forEach(function (i) { dir.appendChild(criarItem(i)); });

  nav.appendChild(esq);
  nav.appendChild(tesoura);
  nav.appendChild(dir);
  cabecalho.appendChild(nav);
    /* ===== MOBILE: casinha + menu lateral ===== */
  var casa = el("button", "cab-botao cabecalho__casa", {
    type: "button", "aria-label": "Abrir menu",
    "aria-expanded": "false", "aria-controls": "menu-lateral"
  });
  casa.appendChild(el("img", "cab-icone", { src: PASTA + "icone-inicio@4x.png", alt: "", "aria-hidden": "true" }));
  cabecalho.appendChild(casa);

  var fundo = el("div", "lateral__fundo");
  var lateral = el("aside", "lateral", { id: "menu-lateral", "aria-label": "Menu" });
  var btnFechar = el("button", "lateral__fechar", { type: "button", "aria-label": "Fechar menu" });
  btnFechar.textContent = "×";
  var topo = el("div", "lateral__topo");
  topo.appendChild(btnFechar);
  var lista = el("ul", "lateral__lista");

  ESQUERDA.concat(DIREITA).forEach(function (item) {
    var li = el("li");
    var b, sub;
    if (item.menu) {
      b = el("button", "cab-botao", { type: "button", "aria-expanded": "false" });
      sub = el("ul", "lateral__sub", { hidden: "" });
      COLECOES.forEach(function (c) {
        var l = el("li");
        var a = el("a", "", { href: c.href, "data-colecao": c.id });
        a.textContent = c.rotulo;
        l.appendChild(a);
        sub.appendChild(l);
      });
      b.addEventListener("click", function () {
        var abre = sub.hidden;
        sub.hidden = !abre;
        b.setAttribute("aria-expanded", String(abre));
      });
    } else if (item.href) {
      b = el("a", "cab-botao", { href: item.href });
      if (item.href === arquivo) b.setAttribute("aria-current", "page");
    } else {
      b = el("button", "cab-botao", { type: "button" });
      if (item.ajustes) b.setAttribute("data-acess-abrir", "");
    }
    b.appendChild(el("img", "cab-icone", { src: PASTA + "icone-" + item.icone + "@4x.png", alt: "", "aria-hidden": "true" }));
    var rot = el("span");
    rot.textContent = item.rotulo;
    b.appendChild(rot);
    li.appendChild(b);
    if (sub) li.appendChild(sub);
    lista.appendChild(li);
  });

  lateral.appendChild(topo);
  lateral.appendChild(lista);
  document.body.appendChild(fundo);
  document.body.appendChild(lateral);

  function abrirLateral() {
    lateral.classList.add("is-aberto");
    fundo.classList.add("is-aberto");
    casa.setAttribute("aria-expanded", "true");
  }
  function fecharLateral() {
    lateral.classList.remove("is-aberto");
    fundo.classList.remove("is-aberto");
    casa.setAttribute("aria-expanded", "false");
  }
  casa.addEventListener("click", abrirLateral);
  fundo.addEventListener("click", fecharLateral);
  btnFechar.addEventListener("click", fecharLateral);
  lateral.addEventListener("click", function (e) {
    if (e.target.closest("a, [data-acess-abrir]")) fecharLateral();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fecharLateral();
  });
  document.body.insertBefore(cabecalho, document.body.firstChild);

  function medir() {
    document.documentElement.style.setProperty("--altura-cabecalho", cabecalho.offsetHeight + "px");
  }
  medir();
  window.addEventListener("load", medir);
  window.addEventListener("resize", medir);
  if (window.ResizeObserver) new ResizeObserver(medir).observe(cabecalho);
})();
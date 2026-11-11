// Frase do manequim: cada letra em uma cor das estrelas
(function () {
  var CORES = ["#1557FF"];

  document.querySelectorAll("[data-cores]").forEach(function (el) {
    var texto = el.textContent.trim();
    el.textContent = "";

    // texto normal só para leitores de tela
    var leitor = document.createElement("span");
    leitor.className = "so-leitor";
    leitor.textContent = texto;
    el.appendChild(leitor);

    var i = 0;
    texto.split("").forEach(function (ch) {
      if (ch === " ") {
        el.appendChild(document.createTextNode(" "));
        return;
      }
      var s = document.createElement("span");
      s.textContent = ch;
      s.setAttribute("aria-hidden", "true");
      s.style.color = CORES[i % CORES.length];
      i++;
      el.appendChild(s);
    });
  });
})();
// Navegação dos looks
(function () {
  var secao = document.getElementById("manequim");
  if (!secao) return;

  var base = "img/garimpar/manequim/4x/";
  var looks = [
    { img: "manequim-liso", cor: "#1557ff", alt: "Manequim de madeira" },
    { img: "manequim-arretado", cor: "#ff5a1f", nome: "ARRETADO", pagina: "arretado.html",
            texto: "Uma coleção sobre a <strong>Migração Nordestina</strong> na grande São Paulo" },
    { img: "manequim-faveleiras", cor: "#ff2e8a", nome: "FAVELEIRAS", pagina: "faveleiras.html",
            texto: "Uma coleção sobre <strong>as favelas dos anos 1960</strong> na grande São Paulo" },
    { img: "manequim-raizes-vivas", cor: "#7628ff", nome: "RAÍZES VIVAS", pagina: "raizes-vivas.html",
            texto: "Uma coleção sobre a <strong>ancestralidade indígena</strong> na grande São Paulo" }
  ];
  var i = 0;

  var dica = secao.querySelector(".manequim__dica");
  var colecao = secao.querySelector(".manequim__colecao");
  var nome = secao.querySelector(".manequim__nome");
  var texto = secao.querySelector(".manequim__texto");
  var link = document.getElementById("manequim-link");
  var boneco = link.querySelector("img");
  var esq = secao.querySelector(".manequim__vizinho--esq");
  var dir = secao.querySelector(".manequim__vizinho--dir");
  var setaEsq = secao.querySelector(".manequim__seta--esq");
  var setaDir = secao.querySelector(".manequim__seta--dir");

  function src(l) { return base + l.img + "@4x.png"; }

  function vizinho(el, l) {
    if (l) { el.src = src(l); el.hidden = false; } else { el.hidden = true; }
  }

  function mostrar() {
    var l = looks[i];
    boneco.src = src(l);
    boneco.alt = l.nome ? "Manequim vestido com a coleção " + l.nome : l.alt;
    secao.style.setProperty("--cor", l.cor);

    if (l.nome) {
      nome.textContent = l.nome;
            texto.innerHTML = l.texto;
      colecao.hidden = false;
      if (dica) dica.hidden = true;
      link.href = l.pagina;
      link.setAttribute("aria-label", "Conhecer a coleção " + l.nome);
    } else {
      colecao.hidden = true;
      if (dica) dica.hidden = false;
      link.removeAttribute("href");
      link.removeAttribute("aria-label");
    }

    vizinho(esq, looks[i - 1]);
    vizinho(dir, looks[i + 1]);
    setaEsq.hidden = i === 0;
    setaDir.hidden = i === looks.length - 1;
  }

  setaDir.addEventListener("click", function () { if (i < looks.length - 1) { i++; mostrar(); } });
  setaEsq.addEventListener("click", function () { if (i > 0) { i--; mostrar(); } });

  mostrar();
})();
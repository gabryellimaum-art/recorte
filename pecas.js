/* pecas.js: lista de peças e progresso do jogo (salvo no navegador, sem login) */
window.Recorte = (function () {
  var CHAVE = "recorte-jogo";
  var DIR = "img/guarda-roupa/4x/";

  /* ordem das camadas no manequim: a de baixo fica por baixo, a última fica por cima */
    var ORDEM = ["baixo", "cinto", "cima", "cabeca"];

  /* peca(id, nome, coleção, camada, x, y, masculino)
     id = início do nome dos arquivos (ex.: "calcaazul" usa calcaazulguardaroupabloqueada@4x.png etc.)
     x e y = posição da peça NO GUARDA-ROUPA (% do guarda-roupa; x = esquerda, y = topo)
     masculino = true quando o arquivo termina em "bloqueado/desbloqueado" (cinto, boné)
     mx e my (abaixo) = posição da peça NO MANEQUIM (% do manequim). 0 e 0 serve quando
     a imagem foi exportada com o tamanho de prancheta do manequim. */
  function peca(id, nome, colecao, camada, x, y, masculino) {
    var bloq = masculino ? "bloqueado" : "bloqueada";
    var desb = masculino ? "desbloqueado" : "desbloqueada";
    return {
      id: id, nome: nome, colecao: colecao, camada: camada,
      x: x, y: y, mx: 0, my: 0,
      preta:  DIR + id + "guardaroupa" + bloq + "@4x.png",
      lado:   DIR + id + "guardaroupa" + desb + "@4x.png",
      frente: DIR + id + "manequim@4x.png"
    };
  }

  var PECAS = [
    /* prateleira de cima */
    peca("boneazul",        "Boné azul",        "faveleiras", "cabeca",   29.2, 29.8, true),
    peca("cinto",           "Cinto",            "faveleiras", "cinto",    36.9, 30.4, true),
    /* cabide */
       peca("jaquetaverde",    "Jaqueta verde",    "raizes",     "cima",     29.2, 39.9),
    peca("jaquetavermelha", "Jaqueta vermelha", "arretado",   "cima",     34.2, 39.9),
    peca("camisetatime",    "Camiseta do time", "arretado",   "cima",     64.6, 40.5),
    /* dobradas, prateleira de baixo */
        peca("bermudapoesia",   "Bermuda Poesia",   "faveleiras", "baixo",    33.0, 74.8, false, true),
    peca("calcamarrom",     "Calça marrom",     "arretado",   "baixo",    40.5, 74.8, false, true),
    peca("saiavermelha",    "Saia vermelha",    "faveleiras", "baixo",    47.5, 74.8, false, true),
    peca("calcaazul",       "Calça azul",       "arretado",   "baixo",    53.5, 74.8, false, true),
    peca("calcacargo",      "Calça cargo",      "faveleiras", "baixo",    60.0, 74.8, false, true),
        /* Raízes Vivas */
    peca("toucatucum",             "Touca “Tucum”",               "raizes", "cabeca", 45.0, 25.9),
    peca("camisaraflechavermelha", "Camisa “Rã-Flecha-Vermelha”", "raizes", "cima",   43.0, 39.9),
    peca("calcakusiwa",            "Calça “Kusiwa”",              "raizes", "baixo",  67.0, 74.8, false, true),
  ];

  /* o boné não tem arquivo "desbloqueado": usa o mesmo do manequim */
  PECAS[0].lado = PECAS[0].frente;
    PECAS[0].w = 6.3;      /* largura do boné no guarda-roupa (% do guarda-roupa); menor = boné menor */
  /* posição das peças no manequim: id: [mx, my] em % do manequim.
     Gerado pelo modo ?ajustar da página (botão Copiar). */
     /* nomes das peças (aparecem no popup de desbloqueio e no guarda-roupa) */
     /* peças de Raízes Vivas: arquivo de frente sem o sufixo "manequim" */
PECAS.forEach(function (p) {
  if (["toucatucum", "camisaraflechavermelha", "calcakusiwa"].indexOf(p.id) > -1) {
    p.frente = "img/guarda-roupa/4x/" + p.id + "@4x.png";
    if ("manequim" in p) p.manequim = p.frente;
  }
});
/* imagens do guarda-roupa das peças de Raízes Vivas (nomes fora do padrão) */
var CAMINHOS = {
  toucatucum: {
    preta: DIR + "toucatucumbloqueado@4x.png",
    lado:  DIR + "toucatucum@4x.png"                          /* touca desbloqueada = a do manequim */
  },
  camisaraflechavermelha: {
    preta: DIR + "camisaraflechavermelharoupabloqueada@4x.png",
    lado:  DIR + "camisaraflechavermelharoupadesbloqueada@4x.png"
  },
  calcakusiwa: {
    preta: DIR + "calcakusiwabloqueada@4x.png",
    lado:  DIR + "calcakusiwadesbloqueada@4x.png"
  }
};
PECAS.forEach(function (p) {
  if (CAMINHOS[p.id]) { p.preta = CAMINHOS[p.id].preta; p.lado = CAMINHOS[p.id].lado; }
});
/* largura da touca no guarda-roupa (% do guarda-roupa); menor = touca menor */
PECAS.forEach(function (p) {
  if (p.id === "toucatucum") {
    p.w = 4;       /* largura (% do guarda-roupa) */
    p.x = 45.0;    /* esquerda */
    p.y = 29.0;    /* topo: maior desce, menor sobe */
  }
});
var NOMES = {
  bermudapoesia:   "Shorts “Poesia”",
  boneazul:        "Boné “Re-Cap”",
  calcaazul:       "Calça “Valei-me”",
  calcamarrom:     "Calça “Bacurau”",
  camisetatime:    "Camiseta “Sertão F.C.”",
  cinto:           "Cinto “Saideira”",
  cintomanequim:   "Cinto “Saideira”",
  jaquetaverde:    "Jaqueta “Rarõsaba”",
    toucatucum:             "Touca “Tucum”",
  camisaraflechavermelha: "Camisa “Rã-Flecha-Vermelha”",
  calcakusiwa:            "Calça “Kusiwa”",
  jaquetavermelha: "Jaqueta “Mandacaru”",
  saiavermelha:    "Saia “Relô”"
};
PECAS.forEach(function (p) { if (NOMES[p.id]) p.nome = NOMES[p.id]; });
  var AJUSTE = {
    boneazul: [23.4, -0.8],
    cinto: [23.4, 48.4],
    jaquetaverde: [-2.9, 17.0],
    jaquetavermelha: [2.4, 14.2],
    camisetatime: [6.2, 17.4],
    bermudapoesia: [11.9, 48.0],
    calcamarrom: [13.4, 45.8],
    saiavermelha: [23.9, 46.5],
    calcaazul: [18.6, 47.5],
    calcacargo: [11.9, 46.9],
    toucatucum: [33.4, -3.5],
    camisaraflechavermelha: [-3.8, 16.5],
    calcakusiwa: [14.3, 44.3]
  };
  PECAS.forEach(function (p) {
    if (AJUSTE[p.id]) { p.mx = AJUSTE[p.id][0]; p.my = AJUSTE[p.id][1]; }
  });
  function lerEstado() {
    try {
      var s = JSON.parse(localStorage.getItem(CHAVE));
      if (s && s.ok && s.vestidas) return s;
    } catch (e) {}
    return { ok: [], vestidas: {} };
  }

  var estado = lerEstado();

  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {}
  }

  function achar(id) {
    for (var i = 0; i < PECAS.length; i++) if (PECAS[i].id === id) return PECAS[i];
    return null;
  }

  return {
    PECAS: PECAS,
    ORDEM: ORDEM,
    achar: achar,
    estaDesbloqueada: function (id) { return estado.ok.indexOf(id) !== -1; },
    estaVestida: function (id) {
      var p = achar(id);
      return !!p && estado.vestidas[p.camada] === id;
    },
    /* devolve true se a peça era nova (usar no esteregg) */
    desbloquear: function (id) {
      if (estado.ok.indexOf(id) !== -1) return false;
      estado.ok.push(id);
      salvar();
      return true;
    },
    /* vestir; se já estiver vestida, tira. Vestir outra da mesma camada troca. */
    vestirOuTirar: function (id) {
      var p = achar(id);
      if (!p || estado.ok.indexOf(id) === -1) return;
      if (estado.vestidas[p.camada] === id) delete estado.vestidas[p.camada];
      else estado.vestidas[p.camada] = id;
      salvar();
    },
    /* para testar: libera todas as peças */
    liberarTudo: function () {
      PECAS.forEach(function (p) {
        if (estado.ok.indexOf(p.id) === -1) estado.ok.push(p.id);
      });
      salvar();
    },
        /* tira todas as roupas do manequim (as peças continuam desbloqueadas) */
    despir: function () {
      estado.vestidas = {};
      salvar();
    },
    reiniciar: function () {
      estado = { ok: [], vestidas: {} };
      salvar();
    }
  };
})();
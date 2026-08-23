// src/utils/sanitizarCadeiras.js

const CORRECAO_NOMES = {
  "calculo diferencial": "Cálculo Diferencial e Integral I",
  "integral i": "Cálculo Diferencial e Integral I",
  "integral ii": "Cálculo Diferencial e Integral II",
  "organizacao": "Organização e Arquitetura de Computadores",
  "arquitetura de computadores": "Organização e Arquitetura de Computadores",
  "estruturas de dados": "Estruturas de Dados e Algoritmos",
  "algoritmos": "Estruturas de Dados e Algoritmos",
  "laboratorio de estruturas de dados": "Laboratório de Estruturas de Dados e Algoritmos",
  "laboratorio de estruturas de dados e algoritmos": "Laboratório de Estruturas de Dados e Algoritmos",
  "programacao para web i": "Programação para Web I",
  "programacao para web 1": "Programação para Web I",
  "programacao para a web i": "Programação para Web I",
  "programacao para a web 1": "Programação para Web I",
  "programacao para web ii": "Programação para Web II",
  "programacao para web 2": "Programação para Web II",
  "programacao para a web ii": "Programação para Web II",
  "programacao para a web 2": "Programação para Web II",
  "habilidades socioemocionais 1": "Habilidades Socioemocionais I",
  "habilidades socioemocionais i": "Habilidades Socioemocionais I",
  "habilidades socioemocionais 2": "Habilidades Socioemocionais II",
  "habilidades socioemocionais ii": "Habilidades Socioemocionais II",
  "topicos em ciencia da computacao 1": "Tópicos em Ciência da Computação I",
  "topicos em ciencia da computacao i": "Tópicos em Ciência da Computação I",
  "topicos em ciencia da computacao 2": "Tópicos em Ciência da Computação II",
  "topicos em ciencia da computacao ii": "Tópicos em Ciência da Computação II"
};

const PREREQUISITOS_OFICIAIS = {

  "Programação II": ["Programação I", "Laboratório de Programação I"],
  "Laboratório de Programação II": ["Programação I", "Laboratório de Programação I"],
  "Cálculo Diferencial e Integral II": ["Cálculo Diferencial e Integral I"],

  "Estruturas de Dados e Algoritmos": ["Programação II", "Laboratório de Programação II"],
  "Laboratório de Estruturas de Dados e Algoritmos": ["Programação II", "Laboratório de Programação II"],
  "Álgebra Linear I": ["Fundamentos de Matemática para Ciência da Computação II"],

  "Organização e Arquitetura de Computadores": [
    "Estruturas de Dados e Algoritmos",
    "Laboratório de Estruturas de Dados e Algoritmos",
    "Lógica para Computação"
  ],
  "Teoria dos Grafos": [
    "Estruturas de Dados e Algoritmos",
    "Laboratório de Estruturas de Dados e Algoritmos",
    "Fundamentos de Matemática para Ciência da Computação I"
  ],
  "Banco de Dados I": [
    "Estruturas de Dados e Algoritmos",
    "Laboratório de Estruturas de Dados e Algoritmos"
  ],
  "Introdução à Probabilidade": ["Cálculo Diferencial e Integral II"],

  "Redes de Computadores": [
    "Organização e Arquitetura de Computadores",
    "Teoria dos Grafos"
  ],
  "Engenharia de Software": [
    "Banco de Dados I"
  ],
  "Projeto de Software": [
    "Banco de Dados I"
  ],
  "Teoria da Computação": [
    "Lógica para Computação"
  ],
  "Paradigmas de Linguagens de Programação": [
    "Lógica para Computação",
    "Programação II",
    "Laboratório de Programação II"
  ],

  "Inteligência Artificial": [
    "Álgebra Linear I",
    "Teoria da Computação"
  ],
  "Análise de Sistemas": [
    "Engenharia de Software",
    "Projeto de Software"
  ],
  "Análise e Técnicas de Algoritmos": [
    "Estruturas de Dados e Algoritmos",
    "Laboratório de Estruturas de Dados e Algoritmos",
    "Teoria dos Grafos"
  ],
  "Banco de Dados II": [
    "Banco de Dados I"
  ],

  "Algoritmos Avançados I": [
    "Programação I",
    "Laboratório de Programação I"
  ],
  "Algoritmos Avançados II": [
    "Algoritmos Avançados I"
  ],
  "Algoritmos Avançados III": [
    "Algoritmos Avançados II"
  ],
  "Algoritmos Avançados IV": [
    "Algoritmos Avançados III"
  ],

  "Habilidades Socioemocionais I": [],
  "Habilidades Socioemocionais II": [
    "Habilidades Socioemocionais I"
  ],

  "Programação para Web I": [
    "Estruturas de Dados e Algoritmos",
    "Laboratório de Estruturas de Dados e Algoritmos"
  ],
  "Programação para Web II": [
    "Programação para Web I"
  ],

  "Tópicos em Ciência da Computação I": [],
  "Tópicos em Ciência da Computação II": [
    "Tópicos em Ciência da Computação I"
  ]
};

export const COREQUISITOS_PADRAO = {
  "Programação I": ["Laboratório de Programação I"],
  "Laboratório de Programação I": ["Programação I"],
  "Programação II": ["Laboratório de Programação II"],
  "Laboratório de Programação II": ["Programação II"],
  "Estruturas de Dados e Algoritmos": ["Laboratório de Estruturas de Dados e Algoritmos"],
  "Laboratório de Estruturas de Dados e Algoritmos": ["Estruturas de Dados e Algoritmos"]
};

function padronizarTexto(texto) {
  if (!texto || typeof texto !== "string") return "";
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizarNomeCadeira(nomeOriginal) {
  if (!nomeOriginal) return "";
  const chave = padronizarTexto(nomeOriginal);
  return CORRECAO_NOMES[chave] || nomeOriginal.trim();
}

export function sanitizarCadeiras(dadosBrutos) {
  if (!Array.isArray(dadosBrutos)) return [];

  const nomesProcessados = new Set();
  const listaSanitizada = [];

  dadosBrutos.forEach((disc) => {
    if (!disc || !disc.nome) return;

    const nomeLimpo = normalizarNomeCadeira(disc.nome);

    if (nomesProcessados.has(nomeLimpo)) return;
    nomesProcessados.add(nomeLimpo);

    const coreqsDetectados = [];

    const reqsNormalizados = (disc.prerequisitos || []).flatMap((req) => {
      if (!req || typeof req !== "string") return [];

      let texto = req;

      if (/co-requisito:/i.test(texto)) {
        const partes = texto.split(/co-requisito:/i);
        texto = partes[0].trim();
        const textoCoReq = partes[1].trim();

        if (textoCoReq) {
          coreqsDetectados.push(normalizarNomeCadeira(textoCoReq));
        }
      }

      if (!texto) return [];
      return [normalizarNomeCadeira(texto)];
    });

    const coreqsFinais = Array.from(
      new Set([...coreqsDetectados, ...(COREQUISITOS_PADRAO[nomeLimpo] || [])])
    );

    const prerequisitosBase = PREREQUISITOS_OFICIAIS[nomeLimpo] !== undefined
      ? PREREQUISITOS_OFICIAIS[nomeLimpo]
      : reqsNormalizados;

    const reqsUnicos = Array.from(new Set(prerequisitosBase)).filter(
      (req) => req !== nomeLimpo && !coreqsFinais.includes(req)
    );

    listaSanitizada.push({
      ...disc,
      nome: nomeLimpo,
      prerequisitos: reqsUnicos,
      corequisitos: coreqsFinais
    });
  });

  return listaSanitizada;
}

export function isLiberada(cadeira, pagas, todasCadeiras = []) {
  if (!cadeira) return false;
  const requisitos = cadeira.prerequisitos || [];
  if (requisitos.length === 0) return true;

  const pagasNormalizadas = (pagas || []).map((p) => normalizarNomeCadeira(p));

  return requisitos.every((requisito) => {
    const nomeReqNormalizado = normalizarNomeCadeira(requisito);
    return pagasNormalizadas.includes(nomeReqNormalizado);
  });
}
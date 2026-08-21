const CORRECAO_NOMES = {
  "calculo diferencial": "Cálculo Diferencial e Integral I",
  "integral i": "Cálculo Diferencial e Integral I",
  "integral ii": "Cálculo Diferencial e Integral II",
  "organizacao": "Organização e Arquitetura de Computadores",
  "arquitetura de computadores": "Organização e Arquitetura de Computadores",
  "estruturas de dados": "Estruturas de Dados e Algoritmos",
  "algoritmos": "Estruturas de Dados e Algoritmos",
  "laboratorio de estruturas de dados": "Laboratório de Estruturas de Dados e Algoritmos",
  "laboratorio de estruturas de dados e algoritmos": "Laboratório de Estruturas de Dados e Algoritmos"
};

const REQUISITOS_GARANTIDOS = {
  "Programação II": ["Programação I", "Laboratório de Programação I"],
  "Laboratório de Programação II": ["Programação I", "Laboratório de Programação I"],
  "Estruturas de Dados e Algoritmos": ["Programação II", "Laboratório de Programação II"],
  "Laboratório de Estruturas de Dados e Algoritmos": ["Programação II", "Laboratório de Programação II"]
};

export const COREQUISITOS_PADRAO = {
  "Programação I": ["Laboratório de Programação I"],
  "Laboratório de Programação I": ["Programação I"],
  "Programação II": ["Laboratório de Programação II"],
  "Laboratório de Programação II": ["Programação II"],
  "Estruturas de Dados e Algoritmos": ["Laboratório de Estruturas de Dados e Algoritmos"],
  "Laboratório de Estruturas de Dados e Algoritmos": ["Estruturas de Dados e Algoritmos"]
};

export function sanitizarCadeiras(dadosBrutos) {
  if (!Array.isArray(dadosBrutos)) return [];

  return dadosBrutos.map((disc) => {
    if (!disc || !disc.nome) return disc;
    const nomeLimpo = disc.nome.trim();
    const coreqsDetectados = [];

    const reqsNormalizados = (disc.prerequisitos || []).flatMap((req) => {
      if (!req || typeof req !== "string") return [];

      let texto = req;

      if (/co-requisito:/i.test(texto)) {
        const partes = texto.split(/co-requisito:/i);
        texto = partes[0].trim();
        const textoCoReq = partes[1].trim();

        if (textoCoReq) {
          const chaveCoReq = textoCoReq.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          coreqsDetectados.push(CORRECAO_NOMES[chaveCoReq] || textoCoReq);
        }
      }

      if (!texto) return [];

      const chave = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return [CORRECAO_NOMES[chave] || texto];
    });

    const coreqsFinais = Array.from(
      new Set([...coreqsDetectados, ...(COREQUISITOS_PADRAO[nomeLimpo] || [])])
    );

    const requisitosExtras = REQUISITOS_GARANTIDOS[nomeLimpo] || [];
    const todosReqs = [...reqsNormalizados, ...requisitosExtras];

    const reqsUnicos = Array.from(new Set(todosReqs)).filter(
      (req) => req !== nomeLimpo && !coreqsFinais.includes(req)
    );

    return {
      ...disc,
      nome: nomeLimpo,
      prerequisitos: reqsUnicos,
      corequisitos: coreqsFinais
    };
  });
}

export function isLiberada(cadeira, pagas, todasCadeiras = []) {
  if (!cadeira) return false;
  const requisitos = cadeira.prerequisitos || [];
  if (requisitos.length === 0) return true;

  return requisitos.every((requisito) => {
    const objReq = todasCadeiras.find((c) => c.codigo === requisito || c.nome === requisito);
    const nomeReq = objReq ? objReq.nome : requisito;
    return pagas.includes(nomeReq);
  });
}
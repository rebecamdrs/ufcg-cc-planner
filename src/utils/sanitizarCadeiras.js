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
}

const REQUISITOS_GARANTIDOS = {
    "Programação II": ["Programação I", "Laboratório de Programação I"],
    "Laboratório de Programação II": ["Programação I", "Laboratório de Programação I"],
    "Estruturas de Dados e Algoritmos": ["Programação II", "Laboratório de Programação II"],
    "Laboratório de Estruturas de Dados e Algoritmos": ["Programação II", "Laboratório de Programação II"]
}

/** 
 * Normaliza nomes de cadeiras e pré-requisitos 
 * */
function sanitizarCadeiras(dadosBrutos) {
    if (!Array.isArray(dadosBrutos)) return []

    return dadosBrutos.map((disc) => {
        if (!disc || !disc.nome) return disc
        const nomeLimpo = disc.nome.trim()

        const reqsNormalizados = (disc.prerequisitos || []).flatMap((req) => {
            if (!req || typeof req !== "string") return []

            // Remove anotações residuais como "CO-REQUISITO: ..."
            let texto = req.replace(/co-requisito:.*$/i, "").trim()
            if (!texto) return []

            const chave = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

            return [CORRECAO_NOMES[chave] || texto]
        })

        // coloca requisitos necessarios
        const requisitosExtras = REQUISITOS_GARANTIDOS[nomeLimpo] || []
        const todosReqs = [...reqsNormalizados, ...requisitosExtras]

        // Remove duplicatas e referências a si mesma
        const reqsUnicos = Array.from(new Set(todosReqs)).filter((req) => req !== nomeLimpo)

        return { ...disc, nome: nomeLimpo, prerequisitos: reqsUnicos }
    })
}

/** 
 * Verifica se uma cadeira está liberada para pagar
 */
function isLiberada(cadeira, pagas) {
    const requisitos = cadeira.prerequisitos || []
    if (requisitos.length === 0) return true

    // Para cada pré-requisito, busca o objeto da disciplina para pegar o nome
    return requisitos.every((requisito) => {
        const objReq = cadeiras.find((c) => c.codigo === requisito || c.nome === requisito)
        const nomeReq = objReq ? objReq.nome : requisito
        return pagas.includes(nomeReq)
    })
}
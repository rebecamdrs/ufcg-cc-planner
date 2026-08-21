import { useEffect, useState } from "react";
import { isLiberada, COREQUISITOS_PADRAO } from "../utils/sanitizarCadeiras.js";

export function useCadeirasPagas(cadeiras = [], onErroPreRequisito) {
  const [cadeirasPagas, setCadeirasPagas] = useState(() => {
    const salvas = localStorage.getItem("cadeirasPagas");
    return salvas ? JSON.parse(salvas) : [];
  });

  useEffect(() => {
    localStorage.setItem("cadeirasPagas", JSON.stringify(cadeirasPagas));
  }, [cadeirasPagas]);

  function pagarCadeira(cadeira) {
    if (!cadeira?.nome) return;

    const nomeCadeira = cadeira.nome;
    const parceiros = COREQUISITOS_PADRAO[nomeCadeira] || [];
    const grupo = [nomeCadeira, ...parceiros];

    setCadeirasPagas((listaAnterior) => {
      // Se já está marcada, desmarca o par
      if (listaAnterior.includes(nomeCadeira)) {
        return listaAnterior.filter((nome) => !grupo.includes(nome));
      }

      // Se não está marcada, verifica os pré-requisitos e adiciona o par
      if (isLiberada(cadeira, listaAnterior, cadeiras)) {
        const novosNomes = grupo.filter((nome) => !listaAnterior.includes(nome));
        return [...listaAnterior, ...novosNomes];
      }

      onErroPreRequisito?.();
      return listaAnterior;
    });
  }

  return { cadeirasPagas, pagarCadeira };
}
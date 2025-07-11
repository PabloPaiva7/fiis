
import { useState, useMemo } from 'react';

export interface SimulationData {
  cotas: number;
  precoCompra: number;
  dividendo: number;
  meses: number;
}

export interface ScenarioData {
  mes: number;
  conservador: number;
  moderado: number;
  otimista: number;
}

export interface SimulationResults {
  investimentoInicial: number;
  rendimentoMensal: number;
  rendimentoAcumulado: number;
  rentabilidadePercentual: number;
  cenarios: ScenarioData[];
}

export const useFiiSimulator = () => {
  const [simulationData, setSimulationData] = useState<SimulationData>({
    cotas: 100,
    precoCompra: 100,
    dividendo: 0.8,
    meses: 12
  });

  const results = useMemo((): SimulationResults => {
    const { cotas, precoCompra, dividendo, meses } = simulationData;
    
    const investimentoInicial = cotas * precoCompra;
    const rendimentoMensal = cotas * dividendo;
    const rendimentoAcumulado = rendimentoMensal * meses;
    const rentabilidadePercentual = (rendimentoAcumulado / investimentoInicial) * 100;

    // Calcular cenários mês a mês
    const cenarios: ScenarioData[] = [];
    
    for (let mes = 1; mes <= meses; mes++) {
      // Conservador: 0.2% ao mês
      const crescimentoConservador = Math.pow(1.002, mes - 1);
      const acumuladoConservador = rendimentoMensal * mes * crescimentoConservador;
      
      // Moderado: 0.5% ao mês
      const crescimentoModerado = Math.pow(1.005, mes - 1);
      const acumuladoModerado = rendimentoMensal * mes * crescimentoModerado;
      
      // Otimista: 1% ao mês
      const crescimentoOtimista = Math.pow(1.01, mes - 1);
      const acumuladoOtimista = rendimentoMensal * mes * crescimentoOtimista;
      
      cenarios.push({
        mes,
        conservador: Number(acumuladoConservador.toFixed(2)),
        moderado: Number(acumuladoModerado.toFixed(2)),
        otimista: Number(acumuladoOtimista.toFixed(2))
      });
    }

    return {
      investimentoInicial,
      rendimentoMensal,
      rendimentoAcumulado,
      rentabilidadePercentual,
      cenarios
    };
  }, [simulationData]);

  const updateSimulation = (data: Partial<SimulationData>) => {
    setSimulationData(prev => ({ ...prev, ...data }));
  };

  return {
    simulationData,
    results,
    updateSimulation
  };
};

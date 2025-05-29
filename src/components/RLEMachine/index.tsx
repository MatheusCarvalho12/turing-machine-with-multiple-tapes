"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = {
  estado: string;
  fita1: string[];
  fita2: string[];
  fita3: string[];
  pos1: number;
  info: string;
};

function gerarStepsRLE(fita1: string[]): Step[] {
  const estados = [
    "q0_inicializa", "q1_verifica_fim", "q2_prepara_leitura", "q3_ler_caractere",
    "q4_inicializa_contador", "q5_verifica_repeticao", "q6_incrementa_contador",
    "q7_finaliza_contador", "q8_grava_contador", "q9_grava_caractere",
    "q10_avanca_cursor", "q11_finaliza", "q12_saida"
  ];
  let estado = estados[0];
  let pos1 = 0;
  const fita2: string[] = [];
  let fita3: string[] = [];
  const fim1 = fita1.length;
  const steps: Step[] = [];
  let curr_char = "";
  let contador = 1;

  while (true) {
    steps.push({
      estado,
      fita1: [...fita1],
      fita2: [...fita2],
      fita3: [...fita3],
      pos1,
      info: "",
    });

    if (estado === "q0_inicializa") {
      pos1 = 0;
      estado = "q1_verifica_fim";
    } else if (estado === "q1_verifica_fim") {
      if (pos1 >= fim1) {
        estado = "q11_finaliza";
      } else {
        estado = "q2_prepara_leitura";
      }
    } else if (estado === "q2_prepara_leitura") {
      curr_char = fita1[pos1];
      estado = "q3_ler_caractere";
    } else if (estado === "q3_ler_caractere") {
      contador = 1;
      estado = "q4_inicializa_contador";
    } else if (estado === "q4_inicializa_contador") {
      fita3 = [String(contador)];
      estado = "q5_verifica_repeticao";
    } else if (estado === "q5_verifica_repeticao") {
      if (pos1 + 1 < fim1 && fita1[pos1 + 1] === curr_char) {
        estado = "q6_incrementa_contador";
      } else {
        estado = "q7_finaliza_contador";
      }
    } else if (estado === "q6_incrementa_contador") {
      contador += 1;
      pos1 += 1;
      fita3 = [String(contador)];
      estado = "q5_verifica_repeticao";
    } else if (estado === "q7_finaliza_contador") {
      estado = "q8_grava_contador";
    } else if (estado === "q8_grava_contador") {
      for (const d of fita3) fita2.push(d);
      estado = "q9_grava_caractere";
    } else if (estado === "q9_grava_caractere") {
      fita2.push(curr_char);
      estado = "q10_avanca_cursor";
    } else if (estado === "q10_avanca_cursor") {
      pos1 += 1;
      estado = "q1_verifica_fim";
    } else if (estado === "q11_finaliza") {
      estado = "q12_saida";
    } else if (estado === "q12_saida") {
      steps.push({
        estado: "q12_saida",
        fita1: [...fita1],
        fita2: [...fita2],
        fita3: [],
        pos1,
        info: `Compactado: ${fita2.join("")}`,
      });
      break;
    }
  }
  return steps;
}

export default function RLEMachine() {
  const [entrada, setEntrada] = useState("AAAABBBCCDAA");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDone, setIsDone] = useState(false);

  function start() {
    setIsDone(false);
    const s = gerarStepsRLE(entrada.split(""));
    setSteps(s);
    setCurrentStep(0);
  }

  function nextStep() {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
    if (currentStep === steps.length - 2) {
      setIsDone(true);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setIsDone(false);
    }
  }

  const s = steps[currentStep] ?? steps[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="max-w-2xl mx-auto p-7 bg-neutral-900 rounded-3xl shadow-2xl my-10 border border-neutral-800"
    >
      <motion.h2
        layout
        className="text-3xl font-extrabold text-neutral-100 mb-5 flex items-center gap-3"
      >
        <motion.span animate={{ rotate: isDone ? -10 : 0 }}>🧩</motion.span>
        Compactador de Strings <span className="text-xl font-bold opacity-60 text-neutral-400">/ RLE</span>
      </motion.h2>

      <div className="flex flex-col md:flex-row gap-2 items-center">
        <input
          className="border-2 border-neutral-700 bg-neutral-800 focus:border-blue-500 px-4 py-2 rounded-xl outline-none w-full font-mono text-lg text-neutral-100 transition"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value.toUpperCase())}
          placeholder="Digite ex: AAAABBBCCDAA"
          maxLength={30}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:bg-blue-700 transition text-lg"
          onClick={start}
        >
          Iniciar
        </motion.button>
      </div>

      <AnimatePresence>
        {steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="font-mono text-lg flex items-center">
                <span className="mr-2 text-blue-400 font-bold">Estado:</span>
                <span
                  className={`
                    px-4 py-1 rounded-full border
                    ${s.estado.includes("saida") ? "bg-green-900 border-green-700 text-green-300" :
                      "bg-neutral-800 border-neutral-600 text-blue-300"}
                    transition-all
                  `}
                >
                  {s.estado}
                </span>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                key={s.estado}
                className="ml-2"
              >
                {s.info && (
                  <span className={`font-bold text-lg rounded-xl px-4 py-1 shadow 
                    ${s.info.includes("Compactado") ? "bg-green-800 text-green-200" : ""}
                  `}>
                    {s.info}
                  </span>
                )}
              </motion.div>
            </div>

            <div className="flex flex-col gap-2 md:gap-3">
              <LabelFita nome="Fita 1 (Entrada)" fita={s.fita1} pointer={s.pos1} cor="purple" />
              <LabelFita nome="Fita 2 (Saída)" fita={s.fita2} pointer={-1} cor="blue" />
              <LabelFita nome="Fita 3 (Contador)" fita={s.fita3} pointer={0} cor="slate" />
            </div>

            <div className="flex gap-4 mt-3 items-center">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="bg-neutral-700 text-neutral-100 font-bold px-5 py-2 rounded-2xl shadow-xl
                  hover:bg-neutral-600 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={prevStep}
                disabled={currentStep <= 0}
              >
                Voltar passo
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="bg-blue-600 text-white font-bold px-6 py-2 rounded-2xl shadow-xl
                  hover:bg-blue-700 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={nextStep}
                disabled={currentStep >= steps.length - 1}
              >
                {isDone ? "Fim" : "Próximo passo"}
              </motion.button>
              <span className="font-mono text-neutral-400 bg-neutral-800 px-3 py-1 rounded-lg border border-neutral-700 shadow-sm">
                Passo <b>{currentStep + 1}</b> / {steps.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-6 text-sm text-neutral-500 italic flex items-center gap-1">
        <span className="bg-neutral-800 text-blue-400 px-2 py-1 rounded-md font-mono mr-1">Exemplo: AAAABBBCCDAA</span>
        <span className="opacity-80">Use letras repetidas para ver o algoritmo funcionando.</span>
      </div>
    </motion.div>
  );
}

function LabelFita({
  nome,
  fita,
  pointer,
  cor = "purple",
}: {
  nome: string;
  fita: string[];
  pointer: number;
  cor?: string;
}) {
  const corMap: Record<string, string> = {
    blue: "bg-blue-950 border-blue-600 text-blue-200",
    purple: "bg-purple-950 border-purple-600 text-purple-200",
    slate: "bg-slate-800 border-slate-600 text-slate-200",
    gray: "bg-neutral-800 border-neutral-700 text-neutral-200"
  };
  const corClasses = corMap[cor] || corMap.purple;

  return (
    <div className="my-1">
      <div className={`font-semibold mb-1 text-base ${corClasses.split(" ")[2]} `}>{nome}</div>
      <div className="flex gap-1 items-center font-mono text-lg">
        {fita.length === 0 && <span className="text-neutral-500">[vazia]</span>}
        {fita.map((l, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 font-bold ${corClasses} shadow
              ${pointer === i ? "ring-2 ring-offset-2 ring-blue-500 z-10" : ""}
              transition-all
            `}
          >
            {l}
          </motion.div>
        ))}
      </div>
      <div className="flex gap-1 h-5 mt-1">
        {fita.map((_, i) =>
          pointer === i ? (
            <motion.span
              key={i}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`text-blue-400 font-bold text-lg block w-9 text-center`}
            >
              ↑
            </motion.span>
          ) : (
            <span key={i} className="w-9 block" />
          )
        )}
      </div>
    </div>
  );
}

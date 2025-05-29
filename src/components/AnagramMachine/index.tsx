"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Step = {
  estado: string;
  fita1: string[];
  fita2: string[];
  fita3: string[];
  pos1: number;
  pos2: number;
  info: string;
};

function gerarSteps(w1: string[], w2: string[]): Step[] {
  const estados = [
    "q0_inicializa", "q1_inicio_w1", "q2_checa_fim_w1", "q3_ler_letra",
    "q4_salva_letra", "q5_inicio_w2", "q6_busca_letra", "q7_compara_letra",
    "q8_marcar_letra", "q9_volta_w2", "q10_fim_busca", "q11_avanca_w1",
    "q12_verifica_restos", "q13_aceita", "q14_rejeita"
  ];
  let estado = estados[0];
  let pos1 = 0, pos2 = 0;
  const fita1 = [...w1];
  const fita2 = [...w2];
  let fita3: string[] = [];
  let found = false;
  const fim1 = fita1.length;
  const fim2 = fita2.length;
  const steps: Step[] = [];

  while (true) {
    steps.push({
      estado,
      fita1: [...fita1],
      fita2: [...fita2],
      fita3: [...fita3],
      pos1,
      pos2,
      info: "",
    });

    if (estado === "q0_inicializa") {
      pos1 = 0;
      estado = "q1_inicio_w1";
    } else if (estado === "q1_inicio_w1") {
      estado = "q2_checa_fim_w1";
    } else if (estado === "q2_checa_fim_w1") {
      if (pos1 < fim1) {
        estado = "q3_ler_letra";
      } else {
        estado = "q12_verifica_restos";
      }
    } else if (estado === "q3_ler_letra") {
      const letra = fita1[pos1];
      fita3 = [letra];
      estado = "q4_salva_letra";
    } else if (estado === "q4_salva_letra") {
      pos2 = 0;
      estado = "q5_inicio_w2";
    } else if (estado === "q5_inicio_w2") {
      estado = "q6_busca_letra";
    } else if (estado === "q6_busca_letra") {
      found = false;
      estado = "q7_compara_letra";
    } else if (estado === "q7_compara_letra") {
      if (pos2 < fim2) {
        if (fita2[pos2] === fita3[0]) {
          found = true;
          estado = "q8_marcar_letra";
        } else {
          pos2 += 1;
          estado = "q7_compara_letra";
        }
      } else {
        estado = "q10_fim_busca";
      }
    } else if (estado === "q8_marcar_letra") {
      fita2[pos2] = "*";
      estado = "q9_volta_w2";
    } else if (estado === "q9_volta_w2") {
      pos2 = 0;
      estado = "q11_avanca_w1";
    } else if (estado === "q10_fim_busca") {
      if (!found) {
        estado = "q14_rejeita";
      } else {
        estado = "q11_avanca_w1";
      }
    } else if (estado === "q11_avanca_w1") {
      pos1 += 1;
      estado = "q2_checa_fim_w1";
    } else if (estado === "q12_verifica_restos") {
      if (fita2.some((l) => l !== "*")) {
        estado = "q14_rejeita";
      } else {
        estado = "q13_aceita";
      }
    } else if (estado === "q13_aceita" || estado === "q14_rejeita") {
      steps.push({
        estado,
        fita1: [...fita1],
        fita2: [...fita2],
        fita3: [...fita3],
        pos1,
        pos2,
        info: estado === "q13_aceita" ? "São anagramas!" : "Não são anagramas!",
      });
      break;
    }
  }

  return steps;
}

export default function AnagramMachine() {
  const [entrada, setEntrada] = useState("DANIEL#ILENDA");
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDone, setIsDone] = useState(false);

  function start() {
    setIsDone(false);
    const [w1, w2] = entrada.split("#");
    if (!w1 || !w2) return;
    const s = gerarSteps([...w1], [...w2]);
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
      initial={{ opacity: 0, scale: 0.98, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="max-w-2xl mx-auto p-7 bg-neutral-900 rounded-3xl shadow-2xl my-10 border border-neutral-800"
    >
      <motion.h2
        layout
        className="text-3xl font-extrabold text-neutral-100 mb-5 flex items-center gap-3"
      >
        <motion.span animate={{ rotate: isDone ? 15 : 0 }}>🧮</motion.span>
        Verificador de Anagramas <span className="text-xl font-bold opacity-60 text-neutral-400">/ Máquina de Turing</span>
      </motion.h2>

      <div className="flex flex-col md:flex-row gap-2 items-center">
        <input
          className="border-2 border-neutral-700 bg-neutral-800 focus:border-blue-500 px-4 py-2 rounded-xl outline-none w-full font-mono text-lg text-neutral-100 transition"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value.toUpperCase())}
          placeholder="Digite como CASA#ASCA"
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
                    ${s.estado.includes("aceita") ? "bg-green-900 border-green-700 text-green-300" :
                      s.estado.includes("rejeita") ? "bg-red-900 border-red-700 text-red-300" :
                        "bg-neutral-800 border-neutral-600 text-blue-300"}
                    transition-all
                  `}
                >
                  {s.estado}
                </span>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                key={s.estado}
                className="ml-2"
              >
                {s.info && (
                  <span className={`font-bold text-lg rounded-xl px-4 py-1 shadow 
                    ${s.info.includes("anagramas") ? "bg-green-800 text-green-200" : "bg-red-800 text-red-200"}
                  `}>
                    {s.info}
                  </span>
                )}
              </motion.div>
            </div>

            <div className="flex flex-col gap-2 md:gap-3">
              <LabelFita nome="Fita 1" fita={s.fita1} pointer={s.pos1} cor="blue" />
              <LabelFita nome="Fita 2" fita={s.fita2} pointer={s.pos2} cor="purple" />
              <LabelFita nome="Fita 3 (temp.)" fita={s.fita3} pointer={0} cor="slate" />
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
        <span className="bg-neutral-800 text-blue-400 px-2 py-1 rounded-md font-mono mr-1">Exemplo: CASA#ASCA</span>
        <span className="opacity-80">Use <b>#</b> para separar as palavras.</span>
      </div>
    </motion.div>
  );
}

function LabelFita({
  nome,
  fita,
  pointer,
  cor = "blue",
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
  const corClasses = corMap[cor] || corMap.blue;

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

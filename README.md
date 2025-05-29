# 🧮 Turing Machine Visual Simulator — Anagram Checker & RLE Compressor

[![Deploy](https://img.shields.io/badge/Vercel-Live%20Demo-black?logo=vercel)](https://turing-machine-with-multiple-tapes.vercel.app)

Explore e aprenda máquinas de Turing multi-fitas com dois exemplos visuais, 100% interativos:

- **Verificador de Anagramas**  
- **Compactador de Strings (RLE)**

👉 **Acesse agora:** [https://turing-machine-with-multiple-tapes.vercel.app](https://turing-machine-with-multiple-tapes.vercel.app)

---

## ✨ Visão Geral

Esse projeto simula **Máquinas de Turing com múltiplas fitas** resolvendo dois problemas clássicos:

- **Verificação de anagramas**
- **Compactação de strings usando RLE**

Você pode acompanhar cada passo da máquina, vendo o estado, fitas e ponteiros em tempo real.

---

## 🤖 O que é uma Máquina de Turing com Múltiplas Fitas?

Imagine uma **Máquina de Turing tradicional** como um robô que lê e escreve símbolos em uma fita de papel (como uma fita cassete infinita), usando uma única cabeça de leitura. Ela resolve problemas, faz cálculos, mas tudo em uma fita só.

Agora, pense na versão **multi-fitas** como um robô muito mais organizado e eficiente:
em vez de apenas uma fita, ele tem **várias fitas paralelas**, cada uma com sua própria cabeça de leitura e escrita.
É como se você tivesse vários cadernos e várias canetas, podendo anotar e ler coisas diferentes ao mesmo tempo!

---

### 🔥 Por que usar múltiplas fitas?

* **Mais rapidez e clareza:** A máquina pode dividir o trabalho entre as fitas, guardando informações temporárias, resultados parciais e até simular memória extra, tudo sem ficar “apagando e reescrevendo” como na fita única.
* **Organização:** Cada fita pode servir para um propósito — por exemplo, uma guarda a entrada, outra serve de área de trabalho, e outra salva a saída.
* **Didática:** Fica muito mais fácil visualizar e entender algoritmos complexos, já que dá pra separar as tarefas nas fitas!

---

### 🧠 Mas é mais poderosa?

> **Não!**
> Teoricamente, uma máquina de múltiplas fitas pode ser **simulada** por uma máquina de fita única. Ou seja, as duas têm o mesmo poder computacional.
>
> A diferença está na praticidade: **com múltiplas fitas, alguns algoritmos ficam MUITO mais fáceis de programar, visualizar e entender** — principalmente em exemplos didáticos ou simulações, como nesse projeto.

---

### 📚 Como funciona na prática?

* Cada fita tem sua própria “ponta” (cabeça de leitura/escrita), que pode andar para a esquerda ou direita independentemente.
* Em cada passo, a máquina:

  1. Lê o símbolo de cada fita ao mesmo tempo.
  2. Decide (com base no estado atual e nos símbolos lidos) o que escrever em cada fita, para onde mover cada cabeça, e qual será o próximo estado.
* Isso permite que a máquina “trabalhe em paralelo”, facilitando tarefas como buscar, marcar, copiar, contar ou comparar informações.

---

#### **Exemplo visual**

No simulador desse projeto, você pode ver as três fitas lado a lado, cada uma com seu ponteiro e evolução a cada passo, tornando os algoritmos super visuais e fáceis de acompanhar!

---

Se quiser adicionar uma ilustração, pode colocar algo como:

```
Fita 1: | D | A | N | I | E | L | # | _ | _ | ...
           ^
Fita 2: | I | L | E | N | D | A | # | _ | _ | ...
           ^
Fita 3: | _ | _ | _ | _ | _ | _ | _ | _ | _ | ...
           ^
```

A seta `^` representa a cabeça de leitura/escrita de cada fita.

---

## 🔢 **Exemplo 1: Verificador de Anagramas**

### **O que faz?**
Verifica se duas palavras são anagramas usando três fitas, simulando uma máquina de Turing passo a passo.

### **Como funciona (Lógica dos estados):**

1. **Fita 1:** Primeira palavra  
2. **Fita 2:** Segunda palavra  
3. **Fita 3:** Temporária para guardar a letra sendo buscada  

#### **Fluxo resumido:**

- Para cada letra da palavra 1:
    - Procura essa letra na palavra 2.
    - Marca como usada (substitui por `*`) para não contar duas vezes.
    - Se não encontrar, rejeita (não são anagramas).
- No final, aceita só se todas as letras das duas palavras casaram.

#### **Estados Principais**

| Estado               | Descrição                                                                                       |
|----------------------|------------------------------------------------------------------------------------------------|
| `q0_inicializa`      | Reseta ponteiros                                                                               |
| `q1_inicio_w1`       | Início do processamento                                                                        |
| `q2_checa_fim_w1`    | Checa se terminou a fita 1                                                                     |
| `q3_ler_letra`       | Lê letra da fita 1                                                                             |
| `q4_salva_letra`     | Prepara busca na fita 2                                                                        |
| `q5_inicio_w2`       | Início da busca                                                                                |
| `q6_busca_letra`     | Busca letra na fita 2                                                                          |
| `q7_compara_letra`   | Compara e marca letra                                                                          |
| `q8_marcar_letra`    | Marca letra na fita 2                                                                          |
| `q9_volta_w2`        | Reinicia busca                                                                                 |
| `q10_fim_busca`      | Decide se achou                                                                                |
| `q11_avanca_w1`      | Avança para próxima letra                                                                     |
| `q12_verifica_restos`| Checa se sobrou alguma letra não usada                                                         |
| `q13_aceita`         | São anagramas                                                                                  |
| `q14_rejeita`        | Não são anagramas                                                                              |

#### **Exemplo prático**

Entrada:  
```

DANIEL#ILENDA

```

Etapas:
- Pega letra por letra de "DANIEL", procura e marca em "ILENDA".
- Se todas casarem e não sobrar letra extra, são anagramas.

---

## 🧩 **Exemplo 2: Compactador de Strings (RLE)**

### **O que faz?**
Compacta sequências de caracteres repetidos usando Run Length Encoding (RLE):  
Exemplo: `AAAABBBCCDAA` → `4A3B2C1D2A`

### **Como funciona (Lógica dos estados):**

1. **Fita 1:** Entrada (string original)
2. **Fita 2:** Saída (string compactada)
3. **Fita 3:** Temporária (contador de repetições)

#### **Fluxo resumido:**

- Lê cada caractere da fita 1.
- Conta quantas vezes ele aparece seguido.
- Escreve `quantidade + letra` na fita 2.
- Repete até acabar.

#### **Estados Principais**

| Estado                  | Descrição                                                  |
|-------------------------|------------------------------------------------------------|
| `q0_inicializa`         | Reseta ponteiro                                            |
| `q1_verifica_fim`       | Checa se terminou                                          |
| `q2_prepara_leitura`    | Lê letra atual                                             |
| `q3_ler_caractere`      | Inicializa contador                                        |
| `q4_inicializa_contador`| Coloca contador na fita 3                                  |
| `q5_verifica_repeticao` | Checa próxima letra                                        |
| `q6_incrementa_contador`| Incrementa contador se for igual                           |
| `q7_finaliza_contador`  | Finaliza bloco de letras iguais                            |
| `q8_grava_contador`     | Escreve quantidade na saída                                |
| `q9_grava_caractere`    | Escreve caractere na saída                                 |
| `q10_avanca_cursor`     | Avança ponteiro                                            |
| `q11_finaliza`          | Finaliza processamento                                     |
| `q12_saida`             | Mostra resultado                                           |

#### **Exemplo prático**

Entrada:  
```

AAAABBBCCDAA

```

Saída:  
```

4A3B2C1D2A

````

---

## 🖥️ **Demonstração**

Clique para experimentar:  
👉 [https://turing-machine-with-multiple-tapes.vercel.app](https://turing-machine-with-multiple-tapes.vercel.app)

- Visualize cada passo da máquina, estado por estado.
- Navegue pelos passos usando os botões "Voltar passo" e "Próximo passo".
- Veja como as fitas evoluem visualmente em tempo real.

---

## 🛠️ **Tecnologias**

- **Next.js + React** — Aplicação serverless, rápida e responsiva
- **TailwindCSS** — Estilização moderna e responsiva
- **Framer Motion** — Animações suaves
- **TypeScript** — Segurança de tipos e legibilidade

---

## 🤓 **Como rodar localmente**

```bash
git clone https://github.com/seu-usuario/turing-machine-with-multiple-tapes.git
cd turing-machine-with-multiple-tapes
npm install
npm run dev
````

Acesse [http://localhost:3000](http://localhost:3000)

## ✨ **Créditos**

Projeto feito por Davi Tuma Furtado, Elias Bariani Cardoso, Matheus Carvalho de Mendonça.

---

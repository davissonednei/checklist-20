/* ========================================
   DADOS DO CHECKLIST (MOCKADOS)
   Depois vamos substituir pela integração com Supabase
   ======================================== */

const DADOS = {
    viaturas: [
        {
            id: 1,
            codigo: "ABTS 01",
            nome: "Auto Bomba Tanque Salvamento",
            icone: "🚒"
        },
        {
            id: 2,
            codigo: "ABTS 02",
            nome: "Auto Bomba Tanque Salvamento",
            icone: "🚒"
        },
        {
            id: 3,
            codigo: "UR 01",
            nome: "Unidade de Resgate",
            icone: "🚑"
        },
        {
            id: 4,
            codigo: "ASE 01",
            nome: "Auto Salvamento e Escada",
            icone: "🚒"
        }
    ],

    categorias: [
        {
            id: 1,
            nome: "Compartimento 01",
            icone: "📦"
        },
        {
            id: 2,
            nome: "Compartimento 02",
            icone: "🧥"
        },
        {
            id: 3,
            nome: "Compartimento 03",
            icone: "🫁"
        },
        {
            id: 4,
            nome: "Compartimento 04",
            icone: "🩹"
        },
        {
            id: 5,
            nome: "Compartimento 05",
            icone: "💉"
        },
        {
            id: 6,
            nome: "Compartimento 06",
            icone: "💊"
        },
        {
            id: 7,
            nome: "Compartimento 07",
            icone: "🧰"
        },
        {
            id: 8,
            nome: "Compartimento 08 - BAU",
            icone: "📦"
        },
        {
            id: 9,
            nome: "Compartimento 09 - Pranchas",
            icone: "🛏️"
        },
        {
            id: 10,
            nome: "Compartimento 10 - Lateral da UR",
            icone: "🚑"
        }
    ],

    // Materiais por categoria - UR 01 (Unidade de Resgate)
    materiais: {
        1: [ // Compartimento 01
            { id: 101, nome: "Desfibrilador Externo Automático", qtdEsperada: 1, tipo: "quantidade" },
            { id: 102, nome: "Lanterna de Segurança (ADALIT)", qtdEsperada: 3, tipo: "quantidade" },
            { id: 103, nome: "Microrretifica Dremel 300 + acessórios", qtdEsperada: 1, tipo: "quantidade" },
            { id: 104, nome: "Lanterna tática + acessórios (kit)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 105, nome: "Tourniquet (CAT Resources)", qtdEsperada: 3, tipo: "quantidade" },
            { id: 106, nome: "Oxímetro de pulso", qtdEsperada: 1, tipo: "quantidade" },
            { id: 107, nome: "Termômetro analógico (estet. + esfig. adulto)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 108, nome: "Tensômetro analógico (estet. + esfig. infantil)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 109, nome: "Termômetro digital infravermelho de testa", qtdEsperada: 1, tipo: "quantidade" },
            { id: 110, nome: "Glicosímetro kit (aparelho+lancetador)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 111, nome: "Algodão pct", qtdEsperada: 1, tipo: "quantidade" }
        ],
        2: [ // Compartimento 02
            { id: 201, nome: "Roupa de proteção tipo C (nível 2)", qtdEsperada: 4, tipo: "quantidade" },
            { id: 202, nome: "Fita crepe adesiva", qtdEsperada: 4, tipo: "quantidade" },
            { id: 203, nome: "Colar cervical regulável adulto", qtdEsperada: 2, tipo: "quantidade" },
            { id: 204, nome: "Colar cervical regulável pediátrico", qtdEsperada: 1, tipo: "quantidade" },
            { id: 205, nome: "Face Shield (protetor facial)", qtdEsperada: 4, tipo: "quantidade" },
            { id: 206, nome: "Avental descartável", qtdEsperada: 10, tipo: "quantidade" }
        ],
        3: [ // Compartimento 03
            { id: 301, nome: "Aspirador manual (und)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 302, nome: "Kit parto de emergência (und)", qtdEsperada: 2, tipo: "quantidade" },
            { id: 303, nome: "Mangueira de aspiração (und)", qtdEsperada: 2, tipo: "quantidade" }
        ],
        4: [ // Compartimento 04
            { id: 401, nome: "Ataduras (tamanhos diferentes - rl)", qtdEsperada: 12, tipo: "quantidade" },
            { id: 402, nome: "Bandagem (tamanhos diferentes - rl)", qtdEsperada: 5, tipo: "quantidade" },
            { id: 403, nome: "Campo operatório (und)", qtdEsperada: 15, tipo: "quantidade" },
            { id: 404, nome: "Cloreto de sódio, 100ml (amp)", qtdEsperada: 15, tipo: "quantidade" },
            { id: 405, nome: "Dispositivo duplo para transferência de fluído (und)", qtdEsperada: 5, tipo: "quantidade" },
            { id: 406, nome: "Esparadrapo (rl)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 407, nome: "Gaze (pct)", qtdEsperada: 15, tipo: "quantidade" },
            { id: 408, nome: "Éter Alcoolizado 500 ml", qtdEsperada: 1, tipo: "quantidade" }
        ],
        5: [ // Compartimento 05
            { id: 501, nome: "Itens diversos (aguardando imagem completa)", qtdEsperada: 1, tipo: "quantidade" }
        ],
        6: [ // Compartimento 06
            { id: 601, nome: "Tiante adulto (und)", qtdEsperada: 2, tipo: "quantidade" },
            { id: 602, nome: "Tiante infantil (und)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 603, nome: "Imobilizador lateral de cabeça (protetor lateral)", qtdEsperada: 1, tipo: "quantidade" }
        ],
        7: [ // Compartimento 07
            { id: 701, nome: "Caixa de ferramenta (und)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 702, nome: "Caixa de EPI (und)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 703, nome: "Cravo de risco (und)", qtdEsperada: 2, tipo: "quantidade" }
        ],
        8: [ // Compartimento 08 - BAU
            { id: 801, nome: "Kit adulto (completo)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 802, nome: "Kit infantil (completo)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 803, nome: "Padiola (und)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 804, nome: "Pano para limpeza (und)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 805, nome: "Hidrocólio (l)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 806, nome: "Água Oxigenada (l)", qtdEsperada: 1, tipo: "quantidade" },
            { id: 807, nome: "Tala de papelão (tamanhos diferentes - und)", qtdEsperada: 5, tipo: "quantidade" },
            { id: 808, nome: "Tala moldável (tamanhos diferentes - und)", qtdEsperada: 5, tipo: "quantidade" }
        ],
        9: [ // Compartimento 09 - Pranchas
            { id: 901, nome: "Prancha rígida adulta em polietileno", qtdEsperada: 1, tipo: "quantidade" },
            { id: 902, nome: "Prancha rígida adulta em polietileno", qtdEsperada: 1, tipo: "quantidade" },
            { id: 903, nome: "Prancha para imobilização em polietileno", qtdEsperada: 1, tipo: "quantidade" }
        ],
        10: [ // Compartimento 10 - Lateral da UR
            { id: 1001, nome: "Cone de sinalização", qtdEsperada: 10, tipo: "quantidade" },
            { id: 1002, nome: "Fita de sinalização", qtdEsperada: 1, tipo: "quantidade" },
            { id: 1003, nome: "Maca de rádio", qtdEsperada: 1, tipo: "quantidade" },
            { id: 1004, nome: "Disco de sinalização (un)", qtdEsperada: 3, tipo: "quantidade" }
        ]
    }
};

/* ========================================
   DADOS DO CHECKLIST (MOCKADOS)
   Depois vamos substituir pela integração com Supabase
   ======================================== */

const DADOS = {
    viaturas: [
        {
            id: 1,
            codigo: "UR 01",
            nome: "Unidade de Resgate",
            icone: "🚑",
            categorias: [
                { id: 1, nome: "Compartimento 01", icone: "📦" },
                { id: 2, nome: "Compartimento 02", icone: "🧥" },
                { id: 3, nome: "Compartimento 03", icone: "🫁" },
                { id: 4, nome: "Compartimento 04", icone: "🩹" },
                { id: 5, nome: "Compartimento 05", icone: "💉" },
                { id: 6, nome: "Compartimento 06", icone: "💊" },
                { id: 7, nome: "Compartimento 07", icone: "🧰" },
                { id: 8, nome: "Compartimento 08 - BAU", icone: "📦" },
                { id: 9, nome: "Compartimento 09 - Pranchas", icone: "🛏️" },
                { id: 10, nome: "Compartimento 10 - Lateral", icone: "🚑" }
            ],
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
                5: [],
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
                10: [ // Compartimento 10 - Lateral
                    { id: 1001, nome: "Cone de sinalização", qtdEsperada: 10, tipo: "quantidade" },
                    { id: 1002, nome: "Fita de sinalização", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 1003, nome: "Maca de rádio", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 1004, nome: "Disco de sinalização (un)", qtdEsperada: 3, tipo: "quantidade" }
                ]
            }
        },
        {
            id: 2,
            codigo: "ATB",
            nome: "Auto Tanque",
            icone: "🚒",
            categorias: [
                { id: 1, nome: "Cabine", icone: "🚗" },
                { id: 2, nome: "Janela Lateral - Motorista", icone: "🔧" },
                { id: 3, nome: "Gaveta 01 - Motorista", icone: "💧" },
                { id: 4, nome: "Gaveta 02 - Passageiro", icone: "💧" },
                { id: 5, nome: "Janela Lateral - Passageiro", icone: "🫁" },
                { id: 6, nome: "Compartimento Superior", icone: "📦" },
                { id: 7, nome: "Mochila de Saída de Viatura", icone: "🎒" }
            ],
            materiais: {
                1: [ // Cabine
                    { id: 2101, nome: "Chave (válvula de sucção)", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2102, nome: "Caixa de luvas de procedimento", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2103, nome: "Máscara MSA", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2104, nome: "Fita zebrada", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2105, nome: "Apito de emergência", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2106, nome: "Conector entre Mangotes", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2107, nome: "Combustível Acima de 3/4", qtdEsperada: 1, tipo: "check" },
                    { id: 2108, nome: "Mochila APH", qtdEsperada: 1, tipo: "quantidade" }
                ],
                2: [ // Janela Lateral - Motorista
                    { id: 2201, nome: "Chave de Magote", qtdEsperada: 1, tipo: "quantidade" }
                ],
                3: [ // Gaveta 01 - Motorista
                    { id: 2301, nome: "Mangueira 2,5 Polegadas", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2302, nome: "Mangueira 1,5 Polegadas", qtdEsperada: 1, tipo: "quantidade" }
                ],
                4: [ // Gaveta 02 - Passageiro
                    { id: 2401, nome: "Mangueira 2,5", qtdEsperada: 1, tipo: "quantidade" }
                ],
                5: [ // Janela Lateral - Passageiro
                    { id: 2501, nome: "EPR (cilindro com suporte dorsal) - MSA", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2502, nome: "Cilindro ar respirável", qtdEsperada: 1, tipo: "quantidade" }
                ],
                6: [ // Compartimento Superior
                    { id: 2601, nome: "Mangote de sucção", qtdEsperada: 2, tipo: "quantidade" },
                    { id: 2602, nome: "Saco de serragem", qtdEsperada: 1, tipo: "quantidade" }
                ],
                7: [ // Mochila de Saída de Viatura
                    { id: 2701, nome: "Manta térmica aluminizada (und)", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2702, nome: "Capa de chuva", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2703, nome: "Esparadrapo", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2704, nome: "Fita cirúrgica hipoalergênica", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2705, nome: "Luva de procedimentos (Cx)", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2706, nome: "Pocket mask", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2707, nome: "Faca pequena", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2708, nome: "Colar cervical", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2709, nome: "Óculos de Proteção", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2710, nome: "Álcool em Gel", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2711, nome: "Cloreto de sódio, 100ml (amp)", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2712, nome: "Ataduras (tamanhos diferentes - rl)", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2713, nome: "Gaze / compressas (pct)", qtdEsperada: 1, tipo: "quantidade" },
                    { id: 2714, nome: "Dispositivo duplo para transferência de fluído (und)", qtdEsperada: 1, tipo: "quantidade" }
                ]
            }
        }
    ],

    // DEPRECATED: Manter por compatibilidade
    categorias: [],
    materiais: {}
};

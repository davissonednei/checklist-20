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
            nome: "Viatura",
            icone: "🚗"
        },
        {
            id: 2,
            nome: "Material de Sapa",
            icone: "🔧"
        },
        {
            id: 3,
            nome: "Material Hidráulico",
            icone: "💧"
        },
        {
            id: 4,
            nome: "EPIs",
            icone: "🦺"
        }
    ],

    // Materiais por categoria (aplicáveis a todas as viaturas por enquanto)
    materiais: {
        1: [ // Viatura
            { id: 101, nome: "Pneus em bom estado", qtdEsperada: 6, tipo: "check" },
            { id: 102, nome: "Balão cheio", qtdEsperada: 1, tipo: "check" },
            { id: 103, nome: "Faróis funcionando", qtdEsperada: 4, tipo: "check" },
            { id: 104, nome: "Sirene funcionando", qtdEsperada: 1, tipo: "check" },
            { id: 105, nome: "Nível de óleo OK", qtdEsperada: 1, tipo: "check" },
            { id: 106, nome: "Tanque de água (litros)", qtdEsperada: 6000, tipo: "numero" }
        ],
        2: [ // Material de Sapa
            { id: 201, nome: "Pás", qtdEsperada: 4, tipo: "quantidade" },
            { id: 202, nome: "Enxadas", qtdEsperada: 2, tipo: "quantidade" },
            { id: 203, nome: "Picaretas", qtdEsperada: 2, tipo: "quantidade" },
            { id: 204, nome: "Machados", qtdEsperada: 2, tipo: "quantidade" },
            { id: 205, nome: "Cavadeiras", qtdEsperada: 2, tipo: "quantidade" },
            { id: 206, nome: "Foices", qtdEsperada: 2, tipo: "quantidade" }
        ],
        3: [ // Material Hidráulico
            { id: 301, nome: "Mangueiras 1.1/2\" (15m)", qtdEsperada: 8, tipo: "quantidade" },
            { id: 302, nome: "Mangueiras 2.1/2\" (15m)", qtdEsperada: 6, tipo: "quantidade" },
            { id: 303, nome: "Esguichos reguláveis", qtdEsperada: 4, tipo: "quantidade" },
            { id: 304, nome: "Divisores", qtdEsperada: 2, tipo: "quantidade" },
            { id: 305, nome: "Redutores", qtdEsperada: 2, tipo: "quantidade" },
            { id: 306, nome: "Chaves de mangueira", qtdEsperada: 4, tipo: "quantidade" }
        ],
        4: [ // EPIs
            { id: 401, nome: "Capacetes", qtdEsperada: 6, tipo: "quantidade" },
            { id: 402, nome: "Capas de aproximação", qtdEsperada: 6, tipo: "quantidade" },
            { id: 403, nome: "Botas", qtdEsperada: 6, tipo: "quantidade" },
            { id: 404, nome: "Luvas", qtdEsperada: 6, tipo: "quantidade" },
            { id: 405, nome: "Lanternas", qtdEsperada: 4, tipo: "quantidade" },
            { id: 406, nome: "EPR (Equipamento Proteção Respiratória)", qtdEsperada: 4, tipo: "quantidade" }
        ]
    }
};

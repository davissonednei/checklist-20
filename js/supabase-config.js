/* ========================================
   CONFIGURAÇÃO DO SUPABASE
   ======================================== */

// ATENÇÃO: Substitua pelos dados do seu projeto Supabase
const SUPABASE_URL = 'https://wcoesnawuhceaynqwfir.supabase.co'; // Ex: https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjb2VzbmF3dWhjZWF5bnF3ZmlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NDc5MjUsImV4cCI6MjA4NTUyMzkyNX0.7u0z1A374Of6FQus2gkEHNyr9KufrWjtcjyNtaF2IQA';

// Inicializar cliente Supabase
let supabaseClient = null;

function inicializarSupabase() {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase inicializado!');
        return true;
    } else {
        console.warn('⚠️ Supabase SDK não carregado. Modo offline.');
        return false;
    }
}

// Verificar se está configurado
function supabaseConfigurado() {
    return SUPABASE_URL !== 'SUA_URL_AQUI' && supabaseClient !== null;
}

/* ========================================
   FUNÇÕES DE BANCO DE DADOS
   ======================================== */

// Salvar checklist completo
async function salvarChecklistNoBanco(dadosChecklist) {
    if (!supabaseConfigurado()) {
        console.warn('Supabase não configurado. Salvando apenas localmente.');
        return { success: false, offline: true };
    }

    try {
        const { data, error } = await supabaseClient
            .from('checklists')
            .insert([dadosChecklist])
            .select()
            .single();

        if (error) throw error;

        console.log('✅ Checklist salvo no banco:', data);
        return { success: true, data };
    } catch (error) {
        console.error('❌ Erro ao salvar:', error);
        return { success: false, error };
    }
}

// Buscar checklist por ID (para verificação)
async function buscarChecklistPorId(id) {
    if (!supabaseConfigurado()) {
        return { success: false, offline: true };
    }

    try {
        const { data, error } = await supabaseClient
            .from('checklists')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('❌ Erro ao buscar:', error);
        return { success: false, error };
    }
}

// Buscar viaturas do banco
async function buscarViaturas() {
    if (!supabaseConfigurado()) {
        console.log('Usando dados locais (Supabase não configurado)');
        return { success: false, offline: true, data: DADOS.viaturas };
    }

    try {
        const { data, error } = await supabaseClient
            .from('viaturas')
            .select('*')
            .order('codigo');

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('❌ Erro ao buscar viaturas:', error);
        return { success: false, error, data: DADOS.viaturas };
    }
}

// Buscar categorias do banco
async function buscarCategorias() {
    if (!supabaseConfigurado()) {
        return { success: false, offline: true, data: DADOS.categorias };
    }

    try {
        const { data, error } = await supabaseClient
            .from('categorias')
            .select('*')
            .order('id');

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('❌ Erro ao buscar categorias:', error);
        return { success: false, error, data: DADOS.categorias };
    }
}

// Buscar materiais do banco
async function buscarMateriais() {
    if (!supabaseConfigurado()) {
        return { success: false, offline: true, data: DADOS.materiais };
    }

    try {
        const { data, error } = await supabaseClient
            .from('materiais')
            .select('*')
            .order('categoria_id, nome');

        if (error) throw error;

        // Agrupar por categoria
        const materiaisAgrupados = {};
        data.forEach(m => {
            if (!materiaisAgrupados[m.categoria_id]) {
                materiaisAgrupados[m.categoria_id] = [];
            }
            materiaisAgrupados[m.categoria_id].push(m);
        });

        return { success: true, data: materiaisAgrupados };
    } catch (error) {
        console.error('❌ Erro ao buscar materiais:', error);
        return { success: false, error, data: DADOS.materiais };
    }
}

/* ========================================
   FUNÇÕES DE HASH E VERIFICAÇÃO
   ======================================== */

// Gerar hash SHA-256 do documento
async function gerarHashDocumento(dados) {
    const texto = JSON.stringify(dados);
    const encoder = new TextEncoder();
    const data = encoder.encode(texto);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Gerar ID único para o checklist
function gerarIdUnico() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `CHK-${timestamp}-${random}`.toUpperCase();
}

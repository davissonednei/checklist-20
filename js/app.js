/* ========================================
   CHECKLIST DE VIATURAS - APLICAÇÃO PRINCIPAL
   ======================================== */

// Função para obter data/hora no fuso horário de Brasília
function obterDataHoraBrasilia() {
    const agora = new Date();
    // Formatar para o fuso de Brasília (America/Sao_Paulo)
    const opcoes = {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const formatter = new Intl.DateTimeFormat('pt-BR', opcoes);
    const partes = formatter.formatToParts(agora);
    
    let ano, mes, dia, hora, minuto;
    partes.forEach(p => {
        if (p.type === 'year') ano = p.value;
        if (p.type === 'month') mes = p.value;
        if (p.type === 'day') dia = p.value;
        if (p.type === 'hour') hora = p.value;
        if (p.type === 'minute') minuto = p.value;
    });
    
    // Formato para input datetime-local: YYYY-MM-DDTHH:MM
    return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}

// Funções helper para acessar dados da viatura
function obterCategoriasViatura(viaturaId = null) {
    const id = viaturaId || estado.viaturaSelecionada;
    if (!id) return [];
    const viatura = DADOS.viaturas.find(v => v.id === id);
    return viatura ? viatura.categorias : [];
}

function obterMateriaisCategoria(categoriaId, viaturaId = null) {
    const id = viaturaId || estado.viaturaSelecionada;
    if (!id) return [];
    const viatura = DADOS.viaturas.find(v => v.id === id);
    const chave = Number(categoriaId);
    return viatura && viatura.materiais[chave] ? viatura.materiais[chave] : [];
}

function obterTodosMateriaisViatura(viaturaId = null) {
    const id = viaturaId || estado.viaturaSelecionada;
    if (!id) return [];
    const viatura = DADOS.viaturas.find(v => v.id === id);
    if (!viatura || !viatura.materiais) return [];
    return Object.values(viatura.materiais).flat();
}

// Estado global da aplicação
const estado = {
    responsavel: '',
    dataHora: '',
    viaturaSelecionada: null,
    categoriaAtiva: 1,
    checklist: {}, // { materialId: { qtdAtual: X, obs: '' } }
    checklistsCompletos: {}, // { viaturaId: { checklist, concluido } }
    assinaturaDataURL: null, // Imagem da assinatura
    documentoId: null, // ID único do checklist
    documentoHash: null // Hash para verificação
};

// Variáveis do canvas de assinatura
let canvasAssinatura = null;
let ctxAssinatura = null;
let desenhando = false;
let assinaturaVazia = true;

/* ========================================
   INICIALIZAÇÃO
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    inicializarApp();
});

function inicializarApp() {
    // Resetar estado para novo checklist
    resetarEstado();
    
    // Inicializar Supabase
    if (typeof inicializarSupabase === 'function') {
        inicializarSupabase();
    }
    
    // Preencher data/hora atual (fuso de Brasília)
    document.getElementById('data-hora').value = obterDataHoraBrasilia();

    // Event listener do formulário de identificação
    document.getElementById('form-identificacao').addEventListener('submit', (e) => {
        e.preventDefault();
        iniciarChecklist();
    });

    // Renderizar lista de viaturas
    renderizarViaturas();
    
    // Inicializar canvas de assinatura
    inicializarCanvasAssinatura();
    
    // Mostrar status de conexão
    atualizarStatusConexao();
}

function resetarEstado() {
    estado.responsavel = '';
    estado.dataHora = '';
    estado.viaturaSelecionada = null;
    estado.categoriaAtiva = 1;
    estado.checklist = {};
    estado.checklistsCompletos = {};
    estado.assinaturaDataURL = null;
    estado.documentoId = null;
    estado.documentoHash = null;
}

function novoChecklist() {
    if (Object.keys(estado.checklistsCompletos).length > 0) {
        const confirma = confirm(
            '⚠️ ATENÇÃO!\n\n' +
            'Você tem um checklist em andamento.\n' +
            'Se voltar, todo o progresso será perdido.\n\n' +
            'Deseja iniciar um novo checklist?'
        );
        if (!confirma) return;
    }
    
    resetarEstado();
    
    // Atualizar data/hora para agora (fuso de Brasília)
    document.getElementById('data-hora').value = obterDataHoraBrasilia();
    document.getElementById('graduacao-nome').value = '';
    
    renderizarViaturas();
    mostrarTela('tela-identificacao');
}

/* ========================================
   NAVEGAÇÃO ENTRE TELAS
   ======================================== */

function mostrarTela(telaId) {
    document.querySelectorAll('.tela').forEach(tela => {
        tela.classList.remove('ativa');
    });
    document.getElementById(telaId).classList.add('ativa');
    window.scrollTo(0, 0);
}

function voltarTela(telaId) {
    mostrarTela(telaId);
}

/* ========================================
   TELA 1: IDENTIFICAÇÃO
   ======================================== */

function iniciarChecklist() {
    estado.responsavel = document.getElementById('graduacao-nome').value.trim();
    estado.dataHora = document.getElementById('data-hora').value;

    if (!estado.responsavel) {
        alert('Por favor, insira sua graduação e nome de guerra.');
        return;
    }

    atualizarProgressoViaturas();
    mostrarTela('tela-viaturas');
}

/* ========================================
   TELA 2: SELEÇÃO DE VIATURA
   ======================================== */

function renderizarViaturas() {
    const container = document.getElementById('lista-viaturas');
    container.innerHTML = '';

    DADOS.viaturas.forEach(viatura => {
        const concluido = estado.checklistsCompletos[viatura.id]?.concluido;
        const card = document.createElement('div');
        card.className = `viatura-card ${concluido ? 'viatura-concluida' : ''}`;
        card.onclick = () => selecionarViatura(viatura);
        card.innerHTML = `
            <div class="viatura-icone">${viatura.icone}</div>
            <div class="viatura-info">
                <h3>${viatura.codigo}</h3>
                <p>${viatura.nome}</p>
            </div>
            ${concluido ? '<div class="viatura-check">✓</div>' : ''}
        `;
        container.appendChild(card);
    });
}

function selecionarViatura(viatura) {
    estado.viaturaSelecionada = viatura.id;
    // Definir categoria ativa para a primeira da viatura
    const categorias = obterCategoriasViatura();
    estado.categoriaAtiva = categorias.length > 0 ? categorias[0].id : null;

    // Verificar se já existe checklist salvo para esta viatura
    if (estado.checklistsCompletos[viatura.id]) {
        estado.checklist = JSON.parse(JSON.stringify(estado.checklistsCompletos[viatura.id].checklist));
    } else {
        estado.checklist = {};
        // Inicializar checklist com quantidade 0 (desmarcado)
        obterTodosMateriaisViatura().forEach(material => {
            estado.checklist[material.id] = {
                qtdAtual: 0,
                obs: ''
            };
        });
    }

    document.getElementById('titulo-viatura').textContent = viatura.codigo;
    renderizarAbas();
    renderizarChecklist();
    mostrarTela('tela-checklist');
}

/* ========================================
   TELA 3: CHECKLIST
   ======================================== */

function renderizarAbas() {
    const container = document.getElementById('abas-categorias');
    container.innerHTML = '';

    obterCategoriasViatura().forEach(categoria => {
        const aba = document.createElement('button');
        aba.className = `aba ${categoria.id === estado.categoriaAtiva ? 'ativa' : ''}`;
        aba.onclick = () => {
            estado.categoriaAtiva = categoria.id;
            renderizarAbas();
            renderizarChecklist();
        };
        aba.innerHTML = `${categoria.icone} ${categoria.nome}`;
        container.appendChild(aba);
    });
}

function renderizarChecklist() {
    const container = document.getElementById('conteudo-checklist');
    const materiais = obterMateriaisCategoria(estado.categoriaAtiva);

    container.innerHTML = '';

    materiais.forEach(material => {
        const itemEstado = estado.checklist[material.id];
        const qtdAtual = itemEstado.qtdAtual;
        const qtdEsperada = material.qtdEsperada;
        const isOk = qtdAtual >= qtdEsperada;

        const item = document.createElement('div');
        item.className = 'checklist-item';
        item.innerHTML = `
            <div class="item-header">
                <span class="item-nome">${material.nome}</span>
                <div class="item-contador">
                    <button class="btn-contador menos" onclick="alterarQuantidade(${material.id}, -1)">−</button>
                    <span class="quantidade-display ${isOk ? 'quantidade-ok' : 'quantidade-falta'}">
                        ${qtdAtual}/${qtdEsperada}
                    </span>
                    <button class="btn-contador mais" onclick="alterarQuantidade(${material.id}, 1)">+</button>
                </div>
            </div>
            <div class="item-obs">
                <input 
                    type="text" 
                    placeholder="Observação (opcional)"
                    value="${itemEstado.obs}"
                    onchange="atualizarObs(${material.id}, this.value)"
                >
            </div>
        `;
        container.appendChild(item);
    });
}

function alterarQuantidade(materialId, delta) {
    const itemEstado = estado.checklist[materialId];
    const novaQtd = Math.max(0, itemEstado.qtdAtual + delta);
    itemEstado.qtdAtual = novaQtd;
    renderizarChecklist();
}

function atualizarObs(materialId, obs) {
    estado.checklist[materialId].obs = obs;
}

function finalizarChecklist() {
    // Salvar checklist da viatura atual
    const viatura = DADOS.viaturas.find(v => v.id === estado.viaturaSelecionada);
    estado.checklistsCompletos[estado.viaturaSelecionada] = {
        viatura: viatura,
        checklist: JSON.parse(JSON.stringify(estado.checklist)),
        concluido: true
    };
    
    renderizarResumo();
    mostrarTela('tela-resumo');
}

function salvarEVoltar() {
    // Salvar checklist da viatura atual
    const viatura = DADOS.viaturas.find(v => v.id === estado.viaturaSelecionada);
    estado.checklistsCompletos[estado.viaturaSelecionada] = {
        viatura: viatura,
        checklist: JSON.parse(JSON.stringify(estado.checklist)),
        concluido: true
    };
    
    atualizarProgressoViaturas();
    mostrarTela('tela-viaturas');
}

function atualizarProgressoViaturas() {
    const total = DADOS.viaturas.length;
    const concluidos = Object.keys(estado.checklistsCompletos).length;
    const porcentagem = (concluidos / total) * 100;
    
    const container = document.getElementById('progresso-viaturas');
    container.innerHTML = `
        <div class="progresso-info">
            <span class="progresso-texto">Viaturas verificadas: <strong>${concluidos}/${total}</strong></span>
            <div class="progresso-barra">
                <div class="progresso-preenchido" style="width: ${porcentagem}%"></div>
            </div>
        </div>
    `;
    
    // Atualizar botão com barra de progresso
    const btnBarra = document.getElementById('btn-progresso-barra');
    const btnStatus = document.getElementById('btn-progresso-status');
    const btnIcon = document.getElementById('btn-progresso-icon');
    const btnContainer = document.getElementById('btn-pdf-completo');
    
    btnBarra.style.width = `${porcentagem}%`;
    btnStatus.textContent = `(${concluidos}/${total})`;
    
    if (concluidos === total) {
        btnContainer.classList.add('completo');
        btnIcon.textContent = '✅';
    } else {
        btnContainer.classList.remove('completo');
        btnIcon.textContent = '📄';
    }
    
    // Atualizar visual das viaturas concluídas
    renderizarViaturas();
}

function tentarGerarPDFCompleto() {
    const total = DADOS.viaturas.length;
    const concluidos = Object.keys(estado.checklistsCompletos).length;
    
    if (concluidos === 0) {
        alert('Você ainda não verificou nenhuma viatura!');
        return;
    }
    
    if (concluidos < total) {
        const faltam = total - concluidos;
        const viaturasFeitas = Object.values(estado.checklistsCompletos).map(c => c.viatura.codigo).join(', ');
        const confirma = confirm(
            `⚠️ CHECKLIST INCOMPLETO!\n\n` +
            `Você verificou ${concluidos} de ${total} viaturas.\n` +
            `Faltam ${faltam} viatura(s).\n\n` +
            `Viaturas verificadas: ${viaturasFeitas}\n\n` +
            `Deseja continuar mesmo assim?\n` +
            `(O documento será marcado como INCOMPLETO)`
        );
        
        if (!confirma) return;
    }
    
    // Abrir tela de assinatura
    abrirTelaAssinatura();
}

/* ========================================
   TELA 4: RESUMO
   ======================================== */

function renderizarResumo() {
    const container = document.getElementById('resumo-conteudo');
    const viatura = DADOS.viaturas.find(v => v.id === estado.viaturaSelecionada);

    const dataFormatada = formatarDataHora(estado.dataHora);

    let html = `
        <div class="resumo-header">
            <h3>CHECKLIST ${viatura.codigo}</h3>
            <p class="resumo-info">
                <strong>Responsável:</strong> ${estado.responsavel}<br>
                <strong>Data/Hora:</strong> ${dataFormatada}
            </p>
        </div>
    `;

    obterCategoriasViatura().forEach(categoria => {
        const materiais = obterMateriaisCategoria(categoria.id) || [];

        html += `<div class="resumo-categoria">
            <h4>${categoria.icone} ${categoria.nome}</h4>`;

        materiais.forEach(material => {
            const itemEstado = estado.checklist[material.id];
            const isOk = itemEstado.qtdAtual >= material.qtdEsperada;
            const classeStatus = isOk ? 'resumo-item-ok' : 'resumo-item-problema';
            const obs = itemEstado.obs ? `<span class="resumo-obs">(${itemEstado.obs})</span>` : '';

            html += `
                <div class="resumo-item">
                    <span>${material.nome} ${obs}</span>
                    <span class="${classeStatus}">${itemEstado.qtdAtual}/${material.qtdEsperada}</span>
                </div>
            `;
        });

        html += '</div>';
    });

    container.innerHTML = html;
}

function formatarDataHora(dataHora) {
    const data = new Date(dataHora);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

/* ========================================
   GERAÇÃO DE PDF
   ======================================== */

function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const margemEsquerda = 20;
    let y = 20;

    // Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CHECKLIST DE VIATURA', 105, y, { align: 'center' });
    y += 10;

    const viatura = DADOS.viaturas.find(v => v.id === estado.viaturaSelecionada);
    doc.setFontSize(14);
    doc.text(viatura.codigo + ' - ' + viatura.nome, 105, y, { align: 'center' });
    y += 15;

    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(margemEsquerda, y, 190, y);
    y += 10;

    // Informações do responsável
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Responsável: ${estado.responsavel}`, margemEsquerda, y);
    y += 7;
    doc.text(`Data/Hora: ${formatarDataHora(estado.dataHora)}`, margemEsquerda, y);
    y += 12;

    // Categorias e itens
    obterCategoriasViatura().forEach(categoria => {
        // Verificar se precisa de nova página
        if (y > 260) {
            doc.addPage();
            y = 20;
        }

        const materiais = obterMateriaisCategoria(categoria.id) || [];

        // Título da categoria
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(220, 38, 38);
        doc.rect(margemEsquerda, y - 5, 170, 8, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(`${categoria.nome}`, margemEsquerda + 3, y);
        doc.setTextColor(0, 0, 0);
        y += 10;

        // Itens
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        materiais.forEach(material => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            const itemEstado = estado.checklist[material.id];
            const isOk = itemEstado.qtdAtual >= material.qtdEsperada;
            const status = `${itemEstado.qtdAtual}/${material.qtdEsperada}`;
            const obs = itemEstado.obs ? ` (${itemEstado.obs})` : '';

            // Cor baseada no status
            if (isOk) {
                doc.setTextColor(22, 163, 74); // Verde
            } else {
                doc.setTextColor(220, 38, 38); // Vermelho
            }

            doc.text(`• ${material.nome}${obs}`, margemEsquerda + 3, y);
            doc.text(status, 180, y, { align: 'right' });
            doc.setTextColor(0, 0, 0);
            y += 6;
        });

        y += 8;
    });

    // Linha para assinatura
    y += 10;
    if (y > 250) {
        doc.addPage();
        y = 50;
    }

    doc.setLineWidth(0.3);
    doc.line(40, y + 20, 170, y + 20);
    doc.setFontSize(10);
    doc.text('Assinatura do Responsável', 105, y + 27, { align: 'center' });

    // Rodapé com data de geração
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Documento gerado em ${new Date().toLocaleString('pt-BR')}`, 105, 290, { align: 'center' });

    // Salvar PDF
    const viaturaPDF = DADOS.viaturas.find(v => v.id === estado.viaturaSelecionada);
    const nomeArquivo = `Checklist_${viaturaPDF.codigo}_${estado.dataHora.replace(/[:-]/g, '')}.pdf`;
    doc.save(nomeArquivo);
}

/* ========================================
   GERAÇÃO DE PDF COMPLETO (TODAS AS VIATURAS)
   ======================================== */

function gerarPDFCompleto(incompleto = false) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const margemEsquerda = 20;
    let y = 20;
    
    const viaturasVerificadas = Object.values(estado.checklistsCompletos).map(c => c.viatura);
    const total = DADOS.viaturas.length;
    const concluidos = viaturasVerificadas.length;

    // Capa
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('CHECKLIST DIÁRIO DE VIATURAS', 105, 60, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    
    if (incompleto) {
        doc.setTextColor(220, 38, 38);
        doc.text(`Relatório INCOMPLETO (${concluidos}/${total} viaturas)`, 105, 75, { align: 'center' });
        doc.setTextColor(0, 0, 0);
    } else {
        doc.text('Relatório Completo', 105, 75, { align: 'center' });
    }
    
    doc.setFontSize(12);
    y = 100;
    doc.text(`Responsável: ${estado.responsavel}`, 105, y, { align: 'center' });
    y += 10;
    doc.text(`Data/Hora: ${formatarDataHora(estado.dataHora)}`, 105, y, { align: 'center' });
    y += 10;
    doc.text(`Total de Viaturas: ${DADOS.viaturas.length}`, 105, y, { align: 'center' });
    
    // Lista de viaturas na capa
    y += 30;
    doc.setFontSize(11);
    doc.text('Viaturas Verificadas:', 105, y, { align: 'center' });
    y += 10;
    
    viaturasVerificadas.forEach(viatura => {
        doc.text(`• ${viatura.codigo} - ${viatura.nome}`, 105, y, { align: 'center' });
        y += 7;
    });
    
    if (incompleto) {
        y += 5;
        doc.setTextColor(220, 38, 38);
        doc.setFontSize(10);
        const naoVerificadas = DADOS.viaturas.filter(v => !estado.checklistsCompletos[v.id]);
        doc.text('Viaturas NÃO verificadas:', 105, y, { align: 'center' });
        y += 7;
        naoVerificadas.forEach(v => {
            doc.text(`• ${v.codigo}`, 105, y, { align: 'center' });
            y += 6;
        });
        doc.setTextColor(0, 0, 0);
    }

    // Rodapé da capa
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Documento gerado em ${new Date().toLocaleString('pt-BR', { hour12: false })}`, 105, 280, { align: 'center' });
    doc.setTextColor(0, 0, 0);

    // Páginas para cada viatura verificada
    viaturasVerificadas.forEach(viatura => {
        doc.addPage();
        y = 20;

        const checklistViatura = estado.checklistsCompletos[viatura.id];

        // Título da viatura
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(viatura.codigo, 105, y, { align: 'center' });
        y += 8;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(viatura.nome, 105, y, { align: 'center' });
        y += 12;

        // Linha separadora
        doc.setLineWidth(0.5);
        doc.line(margemEsquerda, y, 190, y);
        y += 10;

        // Categorias e itens
        obterCategoriasViatura(viatura.id).forEach(categoria => {
            if (y > 260) {
                doc.addPage();
                y = 20;
            }

            const materiais = obterMateriaisCategoria(categoria.id, viatura.id) || [];

            // Título da categoria
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.setFillColor(220, 38, 38);
            doc.rect(margemEsquerda, y - 4, 170, 7, 'F');
            doc.setTextColor(255, 255, 255);
            doc.text(`${categoria.nome}`, margemEsquerda + 3, y);
            doc.setTextColor(0, 0, 0);
            y += 8;

            // Itens
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');

            materiais.forEach(material => {
                if (y > 275) {
                    doc.addPage();
                    y = 20;
                }

                const itemEstado = checklistViatura.checklist[material.id];
                const isOk = itemEstado.qtdAtual >= material.qtdEsperada;
                const status = `${itemEstado.qtdAtual}/${material.qtdEsperada}`;
                const obs = itemEstado.obs ? ` (${itemEstado.obs})` : '';

                if (isOk) {
                    doc.setTextColor(22, 163, 74);
                } else {
                    doc.setTextColor(220, 38, 38);
                }

                doc.text(`• ${material.nome}${obs}`, margemEsquerda + 3, y);
                doc.text(status, 180, y, { align: 'right' });
                doc.setTextColor(0, 0, 0);
                y += 5;
            });

            y += 5;
        });
    });

    // Página de assinaturas
    doc.addPage();
    y = 30;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMO DE VERIFICAÇÃO', 105, y, { align: 'center' });
    y += 20;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    let textoTermo;
    if (incompleto) {
        textoTermo = `Declaro que realizei a verificação de ${concluidos} das ${total} viaturas. Este documento está INCOMPLETO. As viaturas não verificadas estão listadas na capa deste relatório.`;
    } else {
        textoTermo = `Declaro que realizei a verificação de todas as ${total} viaturas listadas neste documento, conferindo os materiais e equipamentos conforme os itens especificados em cada categoria.`;
    }
    
    const linhasTexto = doc.splitTextToSize(textoTermo, 160);
    doc.text(linhasTexto, margemEsquerda, y);
    y += 40;

    doc.text(`Local: _______________________________________`, margemEsquerda, y);
    y += 15;
    doc.text(`Data: ${formatarDataHora(estado.dataHora)}`, margemEsquerda, y);
    y += 30;

    // Assinatura
    doc.line(50, y, 160, y);
    y += 7;
    doc.setFontSize(10);
    doc.text(estado.responsavel, 105, y, { align: 'center' });
    y += 5;
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text('Assinatura do Responsável', 105, y, { align: 'center' });

    // Salvar PDF
    const dataArquivo = estado.dataHora.replace(/[:-]/g, '').replace('T', '_');
    const nomeArquivo = `Checklist_Completo_${dataArquivo}.pdf`;
    doc.save(nomeArquivo);
}

/* ========================================
   COMPARTILHAMENTO WHATSAPP
   ======================================== */

function compartilharWhatsApp() {
    const viatura = DADOS.viaturas.find(v => v.id === estado.viaturaSelecionada);
    let mensagem = `*CHECKLIST ${viatura.codigo}*\n`;
    mensagem += `📋 ${viatura.nome}\n`;
    mensagem += `👤 ${estado.responsavel}\n`;
    mensagem += `📅 ${formatarDataHora(estado.dataHora)}\n\n`;

    let temProblema = false;

    obterCategoriasViatura().forEach(categoria => {
        const materiais = obterMateriaisCategoria(categoria.id) || [];
        let categoriaMensagem = `*${categoria.nome}*\n`;
        let itensComProblema = [];

        materiais.forEach(material => {
            const itemEstado = estado.checklist[material.id];
            const isOk = itemEstado.qtdAtual >= material.qtdEsperada;

            if (!isOk || itemEstado.obs) {
                const status = isOk ? '✅' : '❌';
                const obs = itemEstado.obs ? ` - ${itemEstado.obs}` : '';
                itensComProblema.push(`${status} ${material.nome}: ${itemEstado.qtdAtual}/${material.qtdEsperada}${obs}`);
                if (!isOk) temProblema = true;
            }
        });

        if (itensComProblema.length > 0) {
            mensagem += categoriaMensagem + itensComProblema.join('\n') + '\n\n';
        }
    });

    if (!temProblema) {
        mensagem += '✅ *Todos os itens OK!*\n';
    }

    mensagem += '\n_Checklist realizado via Sistema de Viaturas_';

    const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsApp, '_blank');
}

/* ========================================
   ASSINATURA DIGITAL
   ======================================== */

function inicializarCanvasAssinatura() {
    canvasAssinatura = document.getElementById('canvas-assinatura');
    if (!canvasAssinatura) return;
    
    ctxAssinatura = canvasAssinatura.getContext('2d');
    
    // Ajustar tamanho do canvas
    function ajustarCanvas() {
        const container = canvasAssinatura.parentElement;
        const rect = container.getBoundingClientRect();
        canvasAssinatura.width = rect.width;
        canvasAssinatura.height = 200;
        
        // Configurar estilo do traço
        ctxAssinatura.strokeStyle = '#1f2937';
        ctxAssinatura.lineWidth = 3;
        ctxAssinatura.lineCap = 'round';
        ctxAssinatura.lineJoin = 'round';
    }
    
    ajustarCanvas();
    window.addEventListener('resize', ajustarCanvas);
    
    // Eventos de mouse
    canvasAssinatura.addEventListener('mousedown', iniciarDesenho);
    canvasAssinatura.addEventListener('mousemove', desenhar);
    canvasAssinatura.addEventListener('mouseup', pararDesenho);
    canvasAssinatura.addEventListener('mouseout', pararDesenho);
    
    // Eventos de touch
    canvasAssinatura.addEventListener('touchstart', iniciarDesenhoTouch);
    canvasAssinatura.addEventListener('touchmove', desenharTouch);
    canvasAssinatura.addEventListener('touchend', pararDesenho);
}

function iniciarDesenho(e) {
    desenhando = true;
    assinaturaVazia = false;
    ctxAssinatura.beginPath();
    ctxAssinatura.moveTo(e.offsetX, e.offsetY);
}

function desenhar(e) {
    if (!desenhando) return;
    ctxAssinatura.lineTo(e.offsetX, e.offsetY);
    ctxAssinatura.stroke();
}

function pararDesenho() {
    desenhando = false;
}

function iniciarDesenhoTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasAssinatura.getBoundingClientRect();
    desenhando = true;
    assinaturaVazia = false;
    ctxAssinatura.beginPath();
    ctxAssinatura.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
}

function desenharTouch(e) {
    if (!desenhando) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasAssinatura.getBoundingClientRect();
    ctxAssinatura.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
    ctxAssinatura.stroke();
}

function limparAssinatura() {
    if (!ctxAssinatura) return;
    ctxAssinatura.clearRect(0, 0, canvasAssinatura.width, canvasAssinatura.height);
    assinaturaVazia = true;
    estado.assinaturaDataURL = null;
}

function abrirTelaAssinatura() {
    // Preencher informações
    document.getElementById('info-responsavel').textContent = estado.responsavel;
    document.getElementById('info-datahora').textContent = formatarDataHora(estado.dataHora);
    
    const viaturasTexto = Object.values(estado.checklistsCompletos)
        .map(c => c.viatura.codigo)
        .join(', ');
    document.getElementById('info-viaturas').textContent = viaturasTexto || 'Nenhuma';
    
    // Limpar assinatura anterior
    limparAssinatura();
    
    // Reajustar canvas ao mostrar tela
    setTimeout(() => {
        if (canvasAssinatura) {
            const container = canvasAssinatura.parentElement;
            const rect = container.getBoundingClientRect();
            canvasAssinatura.width = rect.width;
            canvasAssinatura.height = 200;
            ctxAssinatura.strokeStyle = '#1f2937';
            ctxAssinatura.lineWidth = 3;
            ctxAssinatura.lineCap = 'round';
            ctxAssinatura.lineJoin = 'round';
        }
    }, 100);
    
    mostrarTela('tela-assinatura');
}

async function confirmarAssinatura() {
    if (assinaturaVazia) {
        alert('Por favor, assine antes de confirmar.');
        return;
    }
    
    // Capturar assinatura
    estado.assinaturaDataURL = canvasAssinatura.toDataURL('image/png');
    
    // Gerar ID único e hash
    estado.documentoId = gerarIdUnico();
    
    const dadosParaHash = {
        id: estado.documentoId,
        responsavel: estado.responsavel,
        dataHora: estado.dataHora,
        viaturas: Object.keys(estado.checklistsCompletos),
        timestamp: Date.now()
    };
    
    estado.documentoHash = await gerarHashDocumento(dadosParaHash);
    
    // Salvar no Supabase
    await salvarNoSupabase();
    
    // Gerar PDF com assinatura e QR Code
    await gerarPDFComAssinatura();
}

async function salvarNoSupabase() {
    const viaturasVerificadas = Object.values(estado.checklistsCompletos).map(c => c.viatura.codigo);
    
    const dadosChecklist = {
        id: estado.documentoId,
        responsavel: estado.responsavel,
        data_hora: estado.dataHora,
        viaturas_verificadas: viaturasVerificadas.join(', '),
        total_viaturas: DADOS.viaturas.length,
        completo: viaturasVerificadas.length === DADOS.viaturas.length,
        hash: estado.documentoHash,
        dados_checklist: JSON.stringify(estado.checklistsCompletos),
        assinatura: estado.assinaturaDataURL
    };
    
    if (typeof salvarChecklistNoBanco === 'function') {
        const resultado = await salvarChecklistNoBanco(dadosChecklist);
        if (resultado.success) {
            console.log('✅ Checklist salvo com sucesso!');
        } else if (resultado.offline) {
            console.log('📴 Modo offline - checklist será sincronizado depois');
        }
    }
}

async function gerarPDFComAssinatura() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const margemEsquerda = 20;
    let y = 20;
    
    const viaturasVerificadas = Object.values(estado.checklistsCompletos);
    const total = DADOS.viaturas.length;
    const concluidos = viaturasVerificadas.length;
    const incompleto = concluidos < total;

    // Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CHECKLIST DIÁRIO DE VIATURAS', 105, y, { align: 'center' });
    y += 10;

    if (incompleto) {
        doc.setTextColor(220, 38, 38);
        doc.setFontSize(12);
        doc.text(`INCOMPLETO (${concluidos}/${total} viaturas)`, 105, y, { align: 'center' });
        doc.setTextColor(0, 0, 0);
    }
    y += 10;

    // ID do documento
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`ID: ${estado.documentoId}`, 105, y, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    y += 15;

    // Informações
    doc.setFontSize(11);
    doc.text(`Responsável: ${estado.responsavel}`, margemEsquerda, y);
    y += 7;
    doc.text(`Data/Hora: ${formatarDataHora(estado.dataHora)}`, margemEsquerda, y);
    y += 7;
    doc.text(`Viaturas: ${viaturasVerificadas.map(v => v.viatura.codigo).join(', ')}`, margemEsquerda, y);
    y += 15;

    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(margemEsquerda, y, 190, y);
    y += 10;

    // Detalhes de cada viatura (resumido)
    viaturasVerificadas.forEach(viaturaData => {
        if (y > 230) {
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(220, 38, 38);
        doc.rect(margemEsquerda, y - 4, 170, 7, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(viaturaData.viatura.codigo, margemEsquerda + 3, y);
        doc.setTextColor(0, 0, 0);
        y += 10;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        obterCategoriasViatura().forEach(categoria => {
            const materiais = obterMateriaisCategoria(categoria.id);
            materiais.forEach(material => {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }

                const itemEstado = viaturaData.checklist[material.id];
                if (!itemEstado) return;
                
                const isOk = itemEstado.qtdAtual >= material.qtdEsperada;
                const status = `${itemEstado.qtdAtual}/${material.qtdEsperada}`;
                const obs = itemEstado.obs ? ` (${itemEstado.obs})` : '';

                if (isOk) {
                    doc.setTextColor(22, 163, 74);
                } else {
                    doc.setTextColor(220, 38, 38);
                }

                doc.text(`• ${material.nome}${obs}`, margemEsquerda + 3, y);
                doc.text(status, 180, y, { align: 'right' });
                doc.setTextColor(0, 0, 0);
                y += 5;
            });
        });
        y += 5;
    });

    // Nova página para assinatura
    doc.addPage();
    y = 30;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMO DE VERIFICAÇÃO', 105, y, { align: 'center' });
    y += 20;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const textoTermo = `Declaro que realizei a verificação das viaturas listadas neste documento, conferindo os materiais e equipamentos conforme os itens especificados. Este documento foi assinado digitalmente e pode ser verificado através do QR Code.`;
    const linhasTexto = doc.splitTextToSize(textoTermo, 160);
    doc.text(linhasTexto, margemEsquerda, y);
    y += 30;

    // Assinatura
    if (estado.assinaturaDataURL) {
        doc.text('Assinatura Digital:', margemEsquerda, y);
        y += 5;
        doc.addImage(estado.assinaturaDataURL, 'PNG', margemEsquerda, y, 80, 40);
        y += 45;
    }

    doc.text(estado.responsavel, margemEsquerda, y);
    y += 5;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(formatarDataHora(estado.dataHora), margemEsquerda, y);
    doc.setTextColor(0, 0, 0);

    // QR Code para verificação
    try {
        const urlVerificacao = `${window.location.origin}/verificar.html?id=${estado.documentoId}&hash=${estado.documentoHash}`;
        
        // Criar elemento temporário para gerar QR Code
        const qrContainer = document.createElement('div');
        qrContainer.style.position = 'absolute';
        qrContainer.style.left = '-9999px';
        document.body.appendChild(qrContainer);
        
        const qr = new QRCode(qrContainer, {
            text: urlVerificacao,
            width: 150,
            height: 150,
            colorDark: '#000000',
            colorLight: '#ffffff'
        });
        
        // Aguardar geração do QR Code
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const qrCanvas = qrContainer.querySelector('canvas');
        if (qrCanvas) {
            const qrDataURL = qrCanvas.toDataURL('image/png');
            doc.addImage(qrDataURL, 'PNG', 140, y - 50, 40, 40);
            doc.setFontSize(8);
            doc.text('Escaneie para verificar', 160, y - 5, { align: 'center' });
        }
        
        document.body.removeChild(qrContainer);
    } catch (e) {
        console.log('QR Code não disponível:', e);
    }

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`ID: ${estado.documentoId}`, 105, 280, { align: 'center' });
    doc.text(`Hash: ${estado.documentoHash.substring(0, 32)}...`, 105, 285, { align: 'center' });

    // Salvar
    const dataArquivo = estado.dataHora.replace(/[:-]/g, '').replace('T', '_');
    doc.save(`Checklist_${estado.documentoId}_${dataArquivo}.pdf`);
    
    // Mostrar confirmação
    alert(`✅ Checklist salvo com sucesso!\n\nID: ${estado.documentoId}\n\nO PDF foi gerado com assinatura digital e QR Code de verificação.`);
}

/* ========================================
   STATUS DE CONEXÃO
   ======================================== */

function atualizarStatusConexao() {
    // Criar indicador se não existir
    let indicador = document.querySelector('.status-conexao');
    if (!indicador) {
        indicador = document.createElement('div');
        indicador.className = 'status-conexao';
        document.body.appendChild(indicador);
    }
    
    const online = navigator.onLine;
    indicador.className = `status-conexao ${online ? 'status-online' : 'status-offline'}`;
    indicador.innerHTML = `
        <span class="status-dot"></span>
        ${online ? 'Online' : 'Offline'}
    `;
}

// Listeners de conexão
window.addEventListener('online', atualizarStatusConexao);
window.addEventListener('offline', atualizarStatusConexao);

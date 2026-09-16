// Carrega o carrinho armazenado na memória do navegador
let carrinho = JSON.parse(localStorage.getItem('carrinho_confeitaria')) || [];

// Executa automaticamente quando qualquer página carrega
document.addEventListener('DOMContentLoaded', () => {
    atualizarContadorMenu();

    // Se estiver na página do carrinho, renderiza os itens
    if (document.getElementById('lista-carrinho')) {
        renderizarPaginaCarrinho();
    }
});

// Adiciona um item ao carrinho
function adicionarAoCarrinho(nome, preco) {
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ nome, preco, quantidade: 1 });
    }

    salvarEAtualizar();
    alert(`"${nome}" foi adicionado ao seu carrinho!`);
}

// Remove um item do carrinho
function removerDoCarrinho(nome) {
    carrinho = carrinho.filter(item => item.nome !== nome);
    salvarEAtualizar();
    if (document.getElementById('lista-carrinho')) {
        renderizarPaginaCarrinho();
    }
}

// Salva no LocalStorage do navegador e atualiza o número no topo
function salvarEAtualizar() {
    localStorage.setItem('carrinho_confeitaria', JSON.stringify(carrinho));
    atualizarContadorMenu();
}

// Atualiza a bolha numérica no menu
function atualizarContadorMenu() {
    const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
    const contadorElem = document.getElementById('cart-count');
    if (contadorElem) {
        contadorElem.innerText = totalItens;
    }
}

// Monta o HTML da página 'carrinho.html'
function renderizarPaginaCarrinho() {
    const container = document.getElementById('lista-carrinho');
    const totalElem = document.getElementById('cart-total');

    container.innerHTML = '';
    let totalGeral = 0;

    if (carrinho.length === 0) {
        container.innerHTML = '<p>Seu carrinho está vazio no momento.</p>';
        totalElem.innerText = '0,00';
        return;
    }

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item-carrinho');
        itemDiv.innerHTML = `
            <div class="item-info">
                <h3>${item.nome}</h3>
                <p>Qtd: ${item.quantidade} x R$ ${item.preco.toFixed(2)}</p>
            </div>
            <div>
                <strong>R$ ${subtotal.toFixed(2)}</strong>
                <button class="btn-remover" onclick="removerDoCarrinho('${item.nome}')">Remover</button>
            </div>
        `;
        container.appendChild(itemDiv);
    });

    totalElem.innerText = totalGeral.toFixed(2).replace('.', ',');
}

// Envia a lista detalhada para o WhatsApp da loja
function enviarPedidoWhatsapp() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        mensagem += `• ${item.quantidade}x ${item.nome} - R$ ${subtotal.toFixed(2)}\n`;
    });

    mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

    // Substitua pelo número da sua confeitaria
    const telefone = "5592999999999"; 
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, '_blank');
}
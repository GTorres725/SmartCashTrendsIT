const abrirFecharCardsFlut = (element) => {
    document.getElementById(element).classList.toggle("oculto");
};

//
// arr q armazena as transacoes 
let transacoes = [
]

//
// Funcao que cria o obj e adiciona no array transacoes
const addOperacao = (desc, cat, val, tipOp) => {
    const obj = {
        descricao: desc,
        categoria: cat,
        valor: Number(val),
        tipoOperacao: tipOp
    }
    transacoes.push(obj)
}

//
// funcao para o onclick do botao salvar do card de add transacao, ele monta o obj, limpa os inputs e renderiza os novos dados na tabela da tela incial
const btnAddOperacao = () => {
    //pegando os inputs
    let descTransacao = document.getElementById("descTransacao")
    let categoriaTransacao = document.getElementById("categoriaTransacao")
    let valorTransacao = document.getElementById("valorTransacao")
    let tipoOperacaoTransacao = document.getElementById("tipoOperacaoTransacao")

    //chamando a func que adc o obj no arr e passando os elementos necessarioss coletados do input
    addOperacao(
        descTransacao.value,
        categoriaTransacao.value,
        valorTransacao.value,
        tipoOperacaoTransacao.value
    )

    renderizarTransacoes();

    //Limpando inputs
    descTransacao.value = "";
    categoriaTransacao.value = "";
    valorTransacao.value = "";
    tipoOperacaoTransacao.value = "";
}

//
//funcao para o onclick do botao salvar do card de add transacao, ele att cards de valores totais da tela inicial
const attValorTotalTransacoes = () => {
    let valorTotalEntradaTransacoes = 0;
    let valorTotalSaidaTransacoes = 0;

    transacoes.forEach((i) => {
        if (i.tipoOperacao === "entrada") {
            valorTotalEntradaTransacoes += Number(i.valor);
        }

        if (i.tipoOperacao === "saida") {
            valorTotalSaidaTransacoes += Number(i.valor);
        }
    });

    document.getElementById("valorTotalEntradaTransacoes").textContent =
        valorTotalEntradaTransacoes;

    document.getElementById("valorTotalSaidaTransacoes").textContent =
        valorTotalSaidaTransacoes;

    document.getElementById("valorTotalResultadoTransacoes").textContent =
        valorTotalEntradaTransacoes - valorTotalSaidaTransacoes;
};


// Renderizando transacoes na pag principal
const renderizarTransacoes = () => {
    const tabela = document.getElementById("tabelaTransacoes");

    tabela.innerHTML = "";

    transacoes.forEach(i => {
        tabela.innerHTML += `
            <tr>
                <td>${i.descricao}</td>
                <td>${i.categoria}</td>
                <td>R$ ${i.valor}</td>
                <td>${i.tipoOperacao}</td>
            </tr>
        `;
    });
};
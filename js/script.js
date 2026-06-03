const abrirFecharCardsFlut = (element) => {
    document.getElementById(element).classList.toggle("oculto");
};

//
// arr q armazena as transacoes
let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

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

    localStorage.setItem(
        "transacoes",
        JSON.stringify(transacoes)
    );
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
        `R$ ${valorTotalEntradaTransacoes}`;

    document.getElementById("valorTotalSaidaTransacoes").textContent =
       `R$ ${valorTotalSaidaTransacoes}`;

    document.getElementById("valorTotalResultadoTransacoes").textContent =
        `R$ ${valorTotalEntradaTransacoes - valorTotalSaidaTransacoes}`;
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

//
// Categorias
//

//
// arr que armazena as categorias
let categorias = JSON.parse(localStorage.getItem("categorias")) || [];

//
// Funcao que cria o obj e adiciona no array categorias
const addCategoria = (cat, val) => {
    const obj = {
        categoria: cat,
        valorLimite: Number(val)
    }

    categorias.push(obj)

    localStorage.setItem(
    "categorias",
    JSON.stringify(categorias)
);
}


//
//funcao para o onclick do botao salvar do card de add categoria para add categoria nova
const btnAddCategoria = () => {
    //pegando os inputs
    let categoria = document.getElementById("nomeCategoria")
    let valorLimite = document.getElementById("limiteCategoria")
    
    //chamando a func que adc o obj no arr e passando os elementos necessarioss coletados do input
    addCategoria(
        categoria.value,
        valorLimite.value,
    )

    console.log(categorias);
    

    renderizarCategorias()

    //Limpando inputs
    categoria.value = "";
    valorLimite.value = "";
}

//
// Renderizar no card as categorias
const renderizarCategorias = () => {
    const tabela = document.getElementById("tabelaCategorias");

    tabela.innerHTML = "";

    categorias.forEach(i => {
        tabela.innerHTML += `
            <tr>
                <td>${i.categoria}</td>
                <td>R$ ${i.valorLimite}</td>
            </tr>
        `;
    });
};

renderizarTransacoes();
renderizarCategorias();
attValorTotalTransacoes();

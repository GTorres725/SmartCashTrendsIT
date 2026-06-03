//
//Abrir e fechar cards
const abrirFecharCardsFlut = (element) => {
    document.getElementById(element).classList.toggle("oculto");
};

//
// arr q armazena as transacoes
let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];

//
// Funcao que cria o obj e adiciona no array transacoes
const addOperacao = (data, desc, cat, val, tipOp) => {
    const obj = {
        id: Date.now(),
        data: data,
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
    let dataTransacao = document.getElementById("dataTransacao")
    let descTransacao = document.getElementById("descTransacao")
    let categoriaTransacao = document.getElementById("categoriaTransacao")
    let valorTransacao = document.getElementById("valorTransacao")
    let tipoOperacaoTransacao = document.getElementById("tipoOperacaoTransacao")

    //Verificando se já existe a categoria, caso não, chamo a func q add categoria no arr atráves do add transacao
    const catExiste = categorias.some((i) => {
        return i.categoria.toLowerCase() == categoriaTransacao.value.toLowerCase()
    })

    if (!catExiste) {
        addCategoria(categoriaTransacao.value, 0)
        renderizarCategorias()
    }

    // Verificando se há itens obrigatórios em branco
    if (dataTransacao.value == '' || categoriaTransacao.value  == '' || tipoOperacaoTransacao.value  == '' || valorTransacao.value == '') {
        alert("Há dados obrigatórios não preenchidos")
    } else {
        //chamando a func que adc o obj no arr e passando os elementos necessarioss coletados do input
        addOperacao(
            dataTransacao.value,
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
}

//
// Adc opçoes de categorias já existentes no input do card de adc transacao
function opcoesCategorias() {
    const datalist = document.getElementById("categorias");

    datalist.innerHTML = "";

    categorias.forEach(i => {
        datalist.innerHTML += `
            <option value="${i.categoria}"></option>
        `;
    });
}

//
//funcao para o onclick do botao salvar do card de add transacao, ele att cards de valores totais da tela inicial
function attValorTotalTransacoes() {
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
function renderizarTransacoes() {
    const tabela = document.getElementById("tabelaTransacoes");

    tabela.innerHTML = "";

    transacoes.forEach(i => {
        tabela.innerHTML += `
            <tr>
                <td> ${i.data} </td>
                <td>${i.descricao}</td>
                <td>${i.categoria}</td>
                <td>R$ ${i.valor}</td>
                <td>${i.tipoOperacao}</td>
                <td>
                    <button onclick="excluirTransacao(${i.id})"> Excluir <button/>
                </td>
            </tr>
        `;
    });
};

//
// funcao botao excluir
const excluirTransacao = (id) => {
    transacoes = transacoes.filter((i) => {
        return i.id !== id
    })

    localStorage.setItem(
        "transacoes",
        JSON.stringify(transacoes)
    );

    renderizarTransacoes();

    attValorTotalTransacoes();
}

//
// Categorias
//

//
// arr que armazena as categorias
let categorias = JSON.parse(localStorage.getItem("categorias")) || [];

//
// Funcao que cria o obj e adiciona no array categorias
function addCategoria(cat, val) {
    const obj = {
        id: Date.now(),
        categoria: cat,
        valorLimite: Number(val),
        editando: false
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

    const existente = categorias.some((i) => {
       return i.categoria.toLowerCase() == categoria.value.toLowerCase()
    })

    if (existente || categoria.value == '') {
        alert('Categoria não preenchida ou já existente')
    }

    if (!existente) {
        //chamando a func que adc o obj no arr e passando os elementos necessarioss coletados do input
        addCategoria(
            categoria.value,
            valorLimite.value,
        )

        renderizarCategorias()

        //Limpando inputs
        categoria.value = "";
        valorLimite.value = "";
    }
}

//
// Renderizar no card as categorias
function renderizarCategorias() {
    const tabela = document.getElementById("tabelaCategorias");

    tabela.innerHTML = "";

    categorias.forEach(i => {
        tabela.innerHTML += `
            <tr>
                <td>${i.categoria}</td>
                <td>R$ ${i.valorLimite}</td>
                <td>
                    <button onclick="editarCategoria(${i.id})">
                        Editar
                    </button>
                </td>
                <td>
                    <button onclick="excluirCategoria(${i.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
};

//
// funcao botao excluir
const excluirCategoria = (id) => {
    categorias = categorias.filter((i) => {
        return i.id !== id
    })

    localStorage.setItem(
        "categorias",
        JSON.stringify(categorias)
    );

    renderizarCategorias();
}

// funcao botao editar
const editarCategoria = (id) => {
    const categoria = categorias.find(
        categoria => categoria.id === id
    );

    const novoNome = prompt(
        "Novo nome da categoria:",
        categoria.categoria
    );

    if (novoNome === null) return;

    const existe = categorias.some(
        i =>
            i.id !== id &&
            i.categoria.toLowerCase() === novoNome.toLowerCase()
    );

    if (existe) {
        alert("Já existe uma categoria com esse nome.");
        return;
    }

    categoria.categoria = novoNome;

    localStorage.setItem(
        "categorias",
        JSON.stringify(categorias)
    );

    renderizarCategorias();
}

//
//Renders
//
renderizarTransacoes();
renderizarCategorias();
attValorTotalTransacoes();

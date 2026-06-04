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

    //Verificando se a data é maior do que o dia atual
    
    // Verificando se há itens obrigatórios em branco
    if (dataTransacao.value == '' || categoriaTransacao.value  == '' || tipoOperacaoTransacao.value  == '' || valorTransacao.value == '') {
        alert("Há dados obrigatórios não preenchidos")
    } else if (new Date(dataTransacao.value) > new Date()) {
        alert("A data da transação não pode ser maior que a data atual")
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

    document.getElementById("valorTotalEntradaTransacoes").innerHTML =
        `R$ <br> ${valorTotalEntradaTransacoes.toFixed(2)}`;

    document.getElementById("valorTotalSaidaTransacoes").innerHTML =
       `R$ <br> ${valorTotalSaidaTransacoes.toFixed(2)}`;

    document.getElementById("valorTotalResultadoTransacoes").innerHTML =
        `R$ <br> ${(valorTotalEntradaTransacoes - valorTotalSaidaTransacoes).toFixed(2)}`;
};

// Renderizando transacoes na pag principal
function renderizarTransacoes() {
    const tabela = document.getElementById("tabelaTransacoes");

    //Periodo levado em consideracao
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;

    let transacoesFilter = [...transacoes];

    if (dataInicio) {
        transacoesFilter = transacoesFilter.filter(
            i => i.data >= dataInicio
        );
    }
    if (dataFim) {
        transacoesFilter = transacoesFilter.filter(
            i => i.data <= dataFim
        );
    }

    //Ordenando em data
    transacoesFilter.sort((a, b) => {
        if( new Date(a.data) < new Date(b.data)) return -1
        if(new Date(a.data) > new Date(b.data)) return 1
        return 0
    })

    tabela.innerHTML = "";

    transacoesFilter.forEach(i => {
        tabela.innerHTML += `
            <tr>
                <td class="${i.tipoOperacao}"> ${i.data} </td>
                <td class="${i.tipoOperacao}">${i.descricao}</td>
                <td class="${i.tipoOperacao}">${i.categoria}</td>
                <td class="${i.tipoOperacao}">R$ ${i.valor}</td>
                <td>     
                    <i class="fa-solid fa-trash" onclick="excluirTransacao(${i.id})" style="cursor: pointer; color: white;"></i>  
                </td>
            </tr>
        `;
    });
};

//funcao btn limpar filtros do periodo a ser levado em consideração
function limparFiltroPeriodo() {
    document.getElementById("dataInicio").value = ''
    document.getElementById("dataFim").value = ''
    renderizarTransacoes()
}

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
    } else {
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
                    <i class="fa-regular fa-pen-to-square" onclick="editarCategoria(${i.id})" style="cursor: pointer; color: white;"></i>
                </td>
                <td>                      
                    <i class="fa-solid fa-trash" onclick="excluirCategoria(${i.id})" style="cursor: pointer; color: white;"></i>
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

    const novoLimite = prompt(
        "Novo limite da categoria:",
        categoria.valorLimite
    );

    if (novoNome === "") {
        alert("O nome da categoria não pode ficar em branco.");
        return;
    }

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
    categoria.valorLimite = novoLimite;

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

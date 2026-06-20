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
                <td class="${i.tipoOperacao}">R$ ${i.valor.toFixed(2)}</td>
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
if (document.getElementById("tabelaTransacoes")) {
    renderizarTransacoes();
}

if (document.getElementById("tabelaCategorias")) {
    renderizarCategorias();
}

attValorTotalTransacoes();

//
// DAsh
//

function ordenarDash(id) {
    btn = document.getElementById(id)
    if (btn.value == 'crescente') {
        btn.value = 'decrescente';
    } else {
        btn.value = 'crescente'
    }
}

function dashValores(tip, id, inpt, idOrd) {
    const tabela = document.getElementById(id);
    const input = document.getElementById(inpt);

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
    //

    let categoriasValores = {}

    if (input.value != '' && transacoesFilter.some(i => i.categoria == input.value)) {
        categoriasValores[input.value] = 0
        transacoesFilter.forEach((i) => {
            if (i.tipoOperacao != tip) return;

            if (i.categoria == input.value) {
                categoriasValores[input.value] += i.valor;    
            }
        })


    } else if (input.value != '' && !transacoesFilter.some(i => i.categoria == input.value)) {
        alert ("Insira uma categoria existente");
        input.value = ''
        return;

    } else {
        transacoesFilter.forEach((i) => {
            if (i.tipoOperacao != tip) return;

            if (!categoriasValores[i.categoria]) {
                categoriasValores[i.categoria] = 0;
            }

        categoriasValores[i.categoria] += i.valor;        
        })
    }

    tabela.innerHTML = ''

    Object.entries(categoriasValores)
        .sort((a, b) => {
            if(document.getElementById(idOrd).value == 'crescente') {
                if(a[1] > b[1]) return -1;
                if(a[1] < b[1]) return 1;
                return 0
            } else {
                if(a[1] < b[1]) return -1;
                if(a[1] > b[1]) return 1;
                return 0
            }
        })
        .slice(0, 5)
        .forEach(([cat, val]) => {
            tabela.innerHTML += `
                <tr>
                    <td>${cat}</td>
                    <td>R$${val.toFixed(2)}</td>
                </tr>
            `;
        });
};

//qtd

function dashQtd(tip, id, inpt, idOrd) {
    const tabela = document.getElementById(id)
    const input = document.getElementById(inpt);

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
    //

    let categoriasValores = {}

    if (input.value != '') {
        categoriasValores[input.value] = transacoesFilter.filter(t => t.tipoOperacao == tip && t.categoria == input.value).length;

        input.value = '';

    } else {
        transacoesFilter.forEach((i) => {
            if (i.tipoOperacao !== tip) return;

            if (!categoriasValores[i.categoria]) {
                categoriasValores[i.categoria] = transacoesFilter.filter(t => t.tipoOperacao == tip && t.categoria == i.categoria).length;
            }
        });
    }

    tabela.innerHTML = ''

    Object.entries(categoriasValores)
        .sort((a, b) => {
            if(document.getElementById(idOrd).value == 'crescente') {
                if(a[1] > b[1]) return -1;
                if(a[1] < b[1]) return 1;
                return 0
            } else {
                if(a[1] < b[1]) return -1;
                if(a[1] > b[1]) return 1;
                return 0
            }
        })
        .slice(0, 5)
        .forEach(([cat, val]) => {
            tabela.innerHTML += `
                <tr>
                    <td>${cat}</td>
                    <td>${val}</td>
                </tr>
            `;
        });
}


function limparFiltroPeriodoDash() {
    document.getElementById("dataInicio").value = ''
    document.getElementById("dataFim").value = ''
    dashValores("saida", "tabelaValoresSaida", "dashSaidaInputCat", "ordenarDashSaidas");
    dashValores("entrada", "tabelaValoresEntrada", "dashEntradaInputCat", "ordenarDashEntradas");
    dashQtd("saida", "tabelaQtdSaida", "dashSaidaInputCat", "ordenarDashSaidas")
    dashQtd("entrada", "tabelaQtdEntrada", "dashEntradaInputCat", "ordenarDashEntradas")
}

dashValores("saida", "tabelaValoresSaida", "dashSaidaInputCat", "ordenarDashSaidas");
dashValores("entrada", "tabelaValoresEntrada", "dashEntradaInputCat", "ordenarDashEntradas");

dashQtd("saida", "tabelaQtdSaida", "dashSaidaInputCat", "ordenarDashSaidas")
dashQtd("entrada", "tabelaQtdEntrada", "dashEntradaInputCat", "ordenarDashEntradas")


// 
//tabela limite

function dashTblLimit() {
    const tabela = document.getElementById('tabelaLimite')
    const periodo = document.getElementById('periodoTabelaLimite');

    //periodo
    let transacoesFilter = [...transacoes];
    let categoriasDashLimit = [...categorias];

    if (periodo.value == '') {
        alert('Insira um período válido');
        return
    }
    transacoesFilter = transacoesFilter.filter(i => i.data.startsWith(periodo.value) && i.tipoOperacao == 'saida');


    //montando
    let obj = {}
    transacoesFilter.forEach(i => {
        const categoria = categoriasDashLimit.find(t => t.categoria == i.categoria);

        if (categoria.categoria)
        if (categoria.valorLimite <= 0) return;

        if (!obj[i.categoria]) {
            obj[i.categoria] = {
                valor: 0,
                limite: +categoria.valorLimite,
                porc: 0
            };
        }

        obj[i.categoria].valor += i.valor;
    });

    Object.values(obj).forEach(i => {
        i.porc = ((i.valor / i.limite) * 100).toFixed(0)
    })

    //tabela
    tabela.innerHTML = ''


    Object.entries(obj)
        .sort((a, b) => b[1].porc - a[1].porc)
        .forEach(([cat, dados]) => {

            let classePorcentagem = "";

            if (dados.porc <= 69) {
                classePorcentagem = "verde";
            } else if (dados.porc <= 85) {
                classePorcentagem = "amarelo";
            } else if (dados.porc <= 99) {
                classePorcentagem = "laranja";
            } else {
                classePorcentagem = "vermelho";
            }

            tabela.innerHTML += `
                <tr>
                    <td>${cat}</td>
                    <td>R$ ${dados.valor.toFixed(2)}</td>
                    <td>R$ ${dados.limite.toFixed(2)}</td>
                    <td class="${classePorcentagem}">
                        ${dados.porc}%
                    </td>
                </tr>`;
        });
}

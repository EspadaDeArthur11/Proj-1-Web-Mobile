/* =========================================================
   Índice:
     1. A lista de resíduos
     2. As variáveis do jogo
     3. Funções de salvar e ler
     4. Funções do jogo
     5. O que roda em cada página
   ========================================================= */


let residuos = [

    // ----- VIDRO -----
    { arquivo: "garrafa-de-cerveja.png", nome: "Garrafa de cerveja", categoria: "vidro",
      explicacao: "Vidro pode ser reciclado infinitas vezes sem perder qualidade." },

    { arquivo: "pote-de-conserva.png", nome: "Pote de conserva", categoria: "vidro",
      explicacao: "O pote é vidro. A tampa é metal e deve ser separada antes." },

    { arquivo: "copo-de-vidro.png", nome: "Copo de vidro", categoria: "vidro",
      explicacao: "Vai no vidro, mas embrulhe em papel grosso para não machucar quem coleta." },

    // ----- PLÁSTICO -----
    { arquivo: "garrafa-pet.png", nome: "Garrafa de refrigerante", categoria: "plastico",
      explicacao: "É PET, que é plástico, mesmo sendo transparente e parecendo vidro." },

    { arquivo: "pote-de-iogurte.png", nome: "Pote de iogurte", categoria: "plastico",
      explicacao: "É plástico, mas precisa estar lavado: resto de comida contamina o material." },

    { arquivo: "sacola-plastica.png", nome: "Sacola de mercado", categoria: "plastico",
      explicacao: "Plástico fino também é reciclável, desde que esteja limpo e seco." },

    // ----- PAPEL -----
    { arquivo: "jornal.png", nome: "Jornal velho", categoria: "papel",
      explicacao: "Jornal é papel, desde que esteja seco e sem gordura." },

    { arquivo: "caixa-de-papelao.png", nome: "Caixa de papelão", categoria: "papel",
      explicacao: "Papelão é papel. Desmonte a caixa para ocupar menos espaço." },

    { arquivo: "caderno.png", nome: "Caderno usado", categoria: "papel",
      explicacao: "As folhas são papel. Tire o espiral antes: ele é metal." },

    // ----- ORGÂNICO -----
    { arquivo: "casca-de-banana.png", nome: "Casca de banana", categoria: "organico",
      explicacao: "Restos de comida são orgânicos e viram adubo em compostagem." },

    { arquivo: "maca-mordida.png", nome: "Maçã mordida", categoria: "organico",
      explicacao: "Resto de fruta é orgânico, mesmo parecendo pouca coisa." },

    { arquivo: "casca-de-ovo.png", nome: "Casca de ovo", categoria: "organico",
      explicacao: "Casca de ovo é orgânica e ainda repõe cálcio na terra." },

    // ----- METAL -----
    { arquivo: "latinha.png", nome: "Latinha de refrigerante", categoria: "metal",
      explicacao: "Latinha é alumínio, um dos materiais mais reciclados do Brasil." },

    { arquivo: "lata-de-conserva.png", nome: "Lata de milho", categoria: "metal",
      explicacao: "Lata de conserva é aço. Vai no metal, junto com o alumínio." },

    { arquivo: "papel-aluminio.png", nome: "Papel alumínio", categoria: "metal",
      explicacao: "Apesar do nome, papel alumínio é metal, e não papel." }
];


let nomesLixeira = {
    vidro: "vidro",
    plastico: "plástico",
    papel: "papel",
    organico: "orgânico",
    metal: "metal"
};


let pontuacao = 0;
let vidas = 3;
let acertos = 0;
let erros = 0;
let consecutivos = 0;        
let melhorSequencia = 0;     

let residuoAtual = null;     
let posicaoAnterior = -1;    

let podeJogar = true;        

let errosPorCategoria = {
    vidro: 0,
    plastico: 0,
    papel: 0,
    organico: 0,
    metal: 0
};


function salvar(gaveta, chave, valor) {
    try {
        gaveta.setItem(chave, valor);
    } catch (erro) {
        console.log("Não consegui salvar: " + chave);
    }
}


function pegar(gaveta, chave, padrao) {
    try {
        let valor = gaveta.getItem(chave);

        if (valor === null) {
            return padrao;
        }

        return valor;

    } catch (erro) {
        return padrao;
    }
}


function aplicarDaltonico() {
    let escolha = pegar(localStorage, "ecomania_daltonico", "nao");

    if (escolha === "sim") {
        document.body.classList.add("daltonico");
        return true;
    } else {
        document.body.classList.remove("daltonico");
        return false;
    }
}


function sortearResiduo() {
    let posicao = Math.floor(Math.random() * residuos.length);

    while (posicao === posicaoAnterior) {
        posicao = Math.floor(Math.random() * residuos.length);
    }

    posicaoAnterior = posicao;
    residuoAtual = residuos[posicao];

    let imagem = document.getElementById("residuo");
    imagem.src = "assets/residuos/" + residuoAtual.arquivo;

    imagem.alt = residuoAtual.nome;

    document.getElementById("residuo-nome").textContent = residuoAtual.nome;
}


function verificarResposta(lixeiraEscolhida) {

    if (podeJogar === false) {
        return;
    }

    podeJogar = false;
    let tempoDePausa = 0;

    if (lixeiraEscolhida === residuoAtual.categoria) {

        acertos = acertos + 1;
        consecutivos = consecutivos + 1;

        if (consecutivos > melhorSequencia) {
            melhorSequencia = consecutivos;
        }

        let mensagem = "Certo! " + residuoAtual.nome + " vai no " +
                       nomesLixeira[lixeiraEscolhida] + ".";

        if (consecutivos >= 3) {
            pontuacao = pontuacao + 15;
            mensagem = mensagem + " " + consecutivos + " seguidos, +15 pontos.";
        } else {
            pontuacao = pontuacao + 10;
        }

        mostrarFeedback(mensagem, "acerto");
        tempoDePausa = 1200;

    } else {

        erros = erros + 1;
        consecutivos = 0;
        vidas = vidas - 1;

        let categoriaCerta = residuoAtual.categoria;
        errosPorCategoria[categoriaCerta] = errosPorCategoria[categoriaCerta] + 1;

        let mensagem = "Não é aí. " + residuoAtual.nome + " vai no " +
                       nomesLixeira[categoriaCerta] + ". " + residuoAtual.explicacao;

        mostrarFeedback(mensagem, "erro");

        tempoDePausa = 3000;
    }

    atualizarPainel();

    if (vidas <= 0) {
        setTimeout(terminarPartida, tempoDePausa);
    } else {
        setTimeout(proximaRodada, tempoDePausa);
    }
}


function proximaRodada() {
    podeJogar = true;

    let faixa = document.getElementById("feedback");
    faixa.textContent = "Arraste o resíduo até a lixeira certa, ou clique nela.";
    faixa.className = "feedback";

    sortearResiduo();
}


function atualizarPainel() {
    document.getElementById("pontuacao").textContent = pontuacao;

    let coracoes = "";

    for (let i = 0; i < vidas; i++) {
        coracoes = coracoes + "♥ ";
    }

    if (coracoes === "") {
        coracoes = "—";
    }

    document.getElementById("vidas").textContent = coracoes;
}


function mostrarFeedback(texto, tipo) {
    let faixa = document.getElementById("feedback");
    faixa.textContent = texto;
    faixa.className = "feedback " + tipo;
}


function categoriaComMaisErros() {
    let pior = "";
    let maior = 0;

    for (let categoria in errosPorCategoria) {
        if (errosPorCategoria[categoria] > maior) {
            maior = errosPorCategoria[categoria];
            pior = categoria;
        }
    }

    return pior;
}


function terminarPartida() {
    let recordeAntigo = Number(pegar(localStorage, "ecomania_recorde_classico", 0));
    let bateuRecorde = "nao";

    if (pontuacao > recordeAntigo) {
        salvar(localStorage, "ecomania_recorde_classico", pontuacao);
        recordeAntigo = pontuacao;
        bateuRecorde = "sim";
    }

    salvar(sessionStorage, "ecomania_modo", "classico");
    salvar(sessionStorage, "ecomania_pontuacao", pontuacao);
    salvar(sessionStorage, "ecomania_vidas", vidas);
    salvar(sessionStorage, "ecomania_acertos", acertos);
    salvar(sessionStorage, "ecomania_erros", erros);
    salvar(sessionStorage, "ecomania_consecutivos", melhorSequencia);
    salvar(sessionStorage, "ecomania_recorde", recordeAntigo);
    salvar(sessionStorage, "ecomania_bateu_recorde", bateuRecorde);
    salvar(sessionStorage, "ecomania_pior", categoriaComMaisErros());

    window.location.href = "final.html";
}


function prepararLixeiras() {
    let lixeiras = document.querySelectorAll(".lixeira");

    for (let i = 0; i < lixeiras.length; i++) {
        let botao = lixeiras[i];

        botao.addEventListener("click", function () {
            verificarResposta(botao.dataset.tipo);
        });

        botao.addEventListener("dragover", function (evento) {
            evento.preventDefault();
            botao.classList.add("sobrevoo");
        });

        botao.addEventListener("dragleave", function () {
            botao.classList.remove("sobrevoo");
        });

        botao.addEventListener("drop", function (evento) {
            evento.preventDefault();
            botao.classList.remove("sobrevoo");
            verificarResposta(botao.dataset.tipo);
        });
    }
}


function prepararResiduo() {
    let imagem = document.getElementById("residuo");

    imagem.addEventListener("dragstart", function (evento) {
        /* O Firefox não começa o arrasto se nada for colocado
           no dataTransfer, mesmo que a gente não use o valor. */
        evento.dataTransfer.setData("text/plain", residuoAtual.categoria);
        imagem.classList.add("arrastando");
    });

    imagem.addEventListener("dragend", function () {
        imagem.classList.remove("arrastando");
    });
}


function comecarJogo() {
    aplicarDaltonico();
    prepararLixeiras();
    prepararResiduo();
    atualizarPainel();
    sortearResiduo();
}


function prepararMenu() {
    let caixa = document.getElementById("check-daltonico");

    caixa.checked = aplicarDaltonico();

    caixa.addEventListener("change", function () {
        if (caixa.checked === true) {
            salvar(localStorage, "ecomania_daltonico", "sim");
            document.body.classList.add("daltonico");
        } else {
            salvar(localStorage, "ecomania_daltonico", "nao");
            document.body.classList.remove("daltonico");
        }
    });
}


function mostrarResultado() {
    let modo = pegar(sessionStorage, "ecomania_modo", "");

    if (modo === "") {
        window.location.href = "index.html";
        return;
    }

    aplicarDaltonico();

    document.getElementById("pontuacao-final").textContent =
        pegar(sessionStorage, "ecomania_pontuacao", "0");

    document.getElementById("recorde").textContent =
        "Seu recorde neste modo: " + pegar(sessionStorage, "ecomania_recorde", "0");

    if (pegar(sessionStorage, "ecomania_bateu_recorde", "nao") === "sim") {
        document.getElementById("selo").textContent = "Novo recorde";
    }


    if (modo === "classico") {
        document.getElementById("titulo-final").textContent = "Acabaram as vidas";
        document.getElementById("modo-jogado").textContent = "Modo clássico";
        document.getElementById("resultado-tempo").style.display = "none";

        document.getElementById("vidas-classico").textContent =
            pegar(sessionStorage, "ecomania_vidas", "0");
        document.getElementById("acertos-classico").textContent =
            pegar(sessionStorage, "ecomania_acertos", "0");
        document.getElementById("consecutivos-classico").textContent =
            pegar(sessionStorage, "ecomania_consecutivos", "0");
        document.getElementById("erros-classico").textContent =
            pegar(sessionStorage, "ecomania_erros", "0");

        document.getElementById("jogar-de-novo").href = "game_regular.html";

    } else {
        document.getElementById("titulo-final").textContent = "Tempo esgotado";
        document.getElementById("modo-jogado").textContent = "Modo por tempo";
        document.getElementById("resultado-classico").style.display = "none";

        document.getElementById("acertos-tempo").textContent =
            pegar(sessionStorage, "ecomania_acertos", "0");
        document.getElementById("consecutivos-tempo").textContent =
            pegar(sessionStorage, "ecomania_consecutivos", "0");
        document.getElementById("erros-tempo").textContent =
            pegar(sessionStorage, "ecomania_erros", "0");

        document.getElementById("jogar-de-novo").href = "game_timed.html";
    }

    escreverDica();
}


function escreverDica() {
    let pior = pegar(sessionStorage, "ecomania_pior", "");
    let texto = document.getElementById("licao-texto");

    if (pior === "") {
        texto.textContent = "Você não errou nenhuma nesta partida. Mandou bem.";
        return;
    }

    let exemplos = "";

    for (let i = 0; i < residuos.length; i++) {
        if (residuos[i].categoria === pior) {
            if (exemplos !== "") {
                exemplos = exemplos + ", ";
            }
            exemplos = exemplos + residuos[i].nome.toLowerCase();
        }
    }

    texto.textContent = "Você errou mais na categoria " + nomesLixeira[pior] +
                        ". Vão nessa lixeira: " + exemplos + ".";
}


if (document.getElementById("check-daltonico")) {
    prepararMenu();          // estamos na tela inicial
}

if (document.getElementById("residuo")) {
    comecarJogo();           // estamos numa tela de jogo
}

if (document.getElementById("titulo-final")) {
    mostrarResultado();      // estamos na tela de resultado
}
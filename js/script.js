/* =========================================================
   ECO MANIA — script.js
   Carregado pelas quatro páginas. No final do arquivo tem a
   parte que decide o que roda em cada uma.
   ========================================================= */


/* =========================================================
   1. A LISTA DE RESÍDUOS
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

/* =========================================================
   2. AS VARIÁVEIS DO JOGO
   ========================================================= */

let modoAtual = "classico";   // vira "tempo" se a página tiver relógio

let pontuacao = 0;
let vidas = 3;
let acertos = 0;
let erros = 0;
let consecutivos = 0;        
let melhorSequencia = 0;    

let tempoRestante = 60;
let cronometro = null;        // guarda o setInterval para poder cancelar

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

/* =========================================================
   3. SALVAR E LER

   localStorage   — continua salvo depois de fechar o navegador
   sessionStorage — some quando a aba fecha

   O try/catch protege o jogo: se alguém abrir o arquivo com
   dois cliques na pasta, alguns navegadores bloqueiam essas
   gavetas e disparam erro.
   ========================================================= */


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

/* =========================================================
   4. FUNÇÕES DO JOGO
   ========================================================= */


function sortearResiduo() {
    let posicao = Math.floor(Math.random() * residuos.length);

    // se caiu o mesmo da rodada anterior, sorteia de novo
    while (posicao === posicaoAnterior) {
        posicao = Math.floor(Math.random() * residuos.length);
    }

    posicaoAnterior = posicao;
    residuoAtual = residuos[posicao];

    let imagem = document.getElementById("residuo");
    imagem.src = "assets/residuos/" + residuoAtual.arquivo;

    // o alt diz o nome do objeto, nunca a categoria:
    // senão o leitor de tela entregaria a resposta
    imagem.alt = residuoAtual.nome;

    document.getElementById("residuo-nome").textContent = residuoAtual.nome;
}

/* A função mais importante. O clique e o arrastar chamam ela,
   então a regra do jogo existe num lugar só. */
function verificarResposta(lixeiraEscolhida) {

    if (podeJogar === false) {
        return;
    }

    podeJogar = false;
    let tempoDePausa = 0;

    if (lixeiraEscolhida === residuoAtual.categoria) {

        // ---------- ACERTOU ----------
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
        // no modo por tempo a pausa é menor: o relógio não para
        if (modoAtual === "tempo") {
            tempoDePausa = 600;
        } else {
            tempoDePausa = 1200;
        }

    } else {

        // ---------- ERROU ----------
        erros = erros + 1;
        consecutivos = 0;
        
        // só o modo clássico tem vidas
        if (modoAtual === "classico") {
            vidas = vidas - 1;
        }

        let categoriaCerta = residuoAtual.categoria;
        errosPorCategoria[categoriaCerta] = errosPorCategoria[categoriaCerta] + 1;

        let mensagem = "Não é aí. " + residuoAtual.nome + " vai no " +
                       nomesLixeira[categoriaCerta] + ". " + residuoAtual.explicacao;

        mostrarFeedback(mensagem, "erro");

        if (modoAtual === "tempo") {
            tempoDePausa = 1600;
        } else {
            tempoDePausa = 3000;
        }
    }

    atualizarPainel();

    // no modo clássico a partida acaba quando zeram as vidas
    if (modoAtual === "classico" && vidas <= 0) {
        setTimeout(terminarPartida, tempoDePausa);
    } else {
        setTimeout(proximaRodada, tempoDePausa);
    }
}


function proximaRodada() {
    // se o tempo acabou durante a pausa, não continua
    if (modoAtual === "tempo" && tempoRestante <= 0) {
        return;
    }

    podeJogar = true;

    let faixa = document.getElementById("feedback");

    if (modoAtual === "tempo") {
        faixa.textContent = "Clique ou arraste até a lixeira certa.";
    } else {
        faixa.textContent = "Arraste o resíduo até a lixeira certa, ou clique nela.";
    }

    faixa.className = "feedback";

    sortearResiduo();
}


function atualizarPainel() {
    document.getElementById("pontuacao").textContent = pontuacao;

    // cada modo tem um marcador diferente no painel
    if (modoAtual === "classico") {
        mostrarVidas();
    } else {
        mostrarTempo();
    }
}


function mostrarVidas() {

    let coracoes = "";

    for (let i = 0; i < vidas; i++) {
        coracoes = coracoes + "♥ ";
    }

    if (coracoes === "") {
        coracoes = "—";
    }

    document.getElementById("vidas").textContent = coracoes;
}

function mostrarTempo() {
    let minutos = Math.floor(tempoRestante / 60);
    let segundos = tempoRestante % 60;

    // o % devolve o resto da divisão: 75 % 60 dá 15
    if (segundos < 10) {
        segundos = "0" + segundos;
    }

    document.getElementById("tempo").textContent = minutos + ":" + segundos;
}


/* setInterval repete a função a cada intervalo, sem parar, até
   alguém chamar clearInterval. */
function iniciarCronometro() {

    cronometro = setInterval(function () {
        tempoRestante = tempoRestante - 1;
        mostrarTempo();

        if (tempoRestante <= 0) {
            pararCronometro();
            podeJogar = false;
            mostrarFeedback("Tempo esgotado!", "erro");
            setTimeout(terminarPartida, 1200);
        }
    }, 1000);
}


/* Sem este clearInterval o relógio continua correndo em
   segundo plano. Se o jogador jogar duas vezes seguidas sem
   recarregar a página, ficam dois cronômetros rodando e o
   tempo cai de dois em dois. */
function pararCronometro() {
    clearInterval(cronometro);
    cronometro = null;
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

/* =========================================================
   5. HISTÓRICO DAS DUAS ÚLTIMAS PARTIDAS

   Cada partida vira uma frase pronta. Assim não precisa de
   JSON: é só texto entrando e saindo do localStorage.

   Funciona como uma fila de duas posições. Quando entra uma
   partida nova, a que era "última" passa a ser "penúltima", e
   a penúltima antiga é descartada.
   ========================================================= */

function montarTextoDaPartida(modo, pontos) {
    let nomeModo = "Modo clássico";

    if (modo === "tempo") {
        nomeModo = "Modo por tempo";
    }

    let agora = new Date();

    let dia = agora.getDate();
    let mes = agora.getMonth() + 1;    // getMonth devolve 0 para janeiro
    let hora = agora.getHours();
    let minuto = agora.getMinutes();

    // acrescenta o zero à esquerda quando o número tem um dígito
    if (dia < 10)    { dia = "0" + dia; }
    if (mes < 10)    { mes = "0" + mes; }
    if (hora < 10)   { hora = "0" + hora; }
    if (minuto < 10) { minuto = "0" + minuto; }

    return nomeModo + " · " + pontos + " pontos · " +
           dia + "/" + mes + " às " + hora + ":" + minuto;
}


function guardarNoHistorico(modo, pontos) {
    // o que era a última passa a ser a penúltima
    let ultimaAntiga = pegar(localStorage, "ecomania_ultima", "");
    salvar(localStorage, "ecomania_penultima", ultimaAntiga);

    // a partida que acabou de terminar vira a última
    salvar(localStorage, "ecomania_ultima", montarTextoDaPartida(modo, pontos));
}


function mostrarHistorico() {
    let ultima = pegar(localStorage, "ecomania_ultima", "");
    let penultima = pegar(localStorage, "ecomania_penultima", "");

    let bloco = document.getElementById("historico");

    // quem nunca jogou não precisa ver um bloco vazio
    if (ultima === "") {
        bloco.style.display = "none";
        return;
    }

    document.getElementById("historico-ultima").textContent = ultima;

    if (penultima === "") {
        document.getElementById("historico-penultima").style.display = "none";
    } else {
        document.getElementById("historico-penultima").textContent = penultima;
    }
}


/* =========================================================
   6. FIM DA PARTIDA
   ========================================================= */

function terminarPartida() {
    pararCronometro();
    podeJogar = false;

    let chaveRecorde = "ecomania_recorde_" + modoAtual;
    let recordeAntigo = Number(pegar(localStorage, chaveRecorde, 0));
    let bateuRecorde = "nao";

    // Number() converte texto em número. Sem isso "90" > "100"
    // daria verdadeiro, porque a comparação seria letra a letra.
    if (pontuacao > recordeAntigo) {
        salvar(localStorage, chaveRecorde, pontuacao);
        recordeAntigo = pontuacao;
        bateuRecorde = "sim";
    }

    guardarNoHistorico(modoAtual, pontuacao);
    salvar(sessionStorage, "ecomania_modo", modoAtual);
    salvar(sessionStorage, "ecomania_pontuacao", pontuacao);
    salvar(sessionStorage, "ecomania_vidas", vidas);
    salvar(sessionStorage, "ecomania_acertos", acertos);
    salvar(sessionStorage, "ecomania_erros", erros);
    salvar(sessionStorage, "ecomania_consecutivos", melhorSequencia);
    salvar(sessionStorage, "ecomania_recorde", recordeAntigo);
    salvar(sessionStorage, "ecomania_bateu_recorde", bateuRecorde);
    salvar(sessionStorage, "ecomania_pior", categoriaComMaisErros());

    
    window.location.href = "final_menu.html";
}


/* =========================================================
   7. CLIQUE NAS LIXEIRAS
   ========================================================= */

function prepararLixeiras() {
    let lixeiras = document.querySelectorAll(".lixeira");

    for (let i = 0; i < lixeiras.length; i++) {
        let botao = lixeiras[i];

        // dataset.tipo lê o atributo data-tipo do HTML
        botao.addEventListener("click", function () {
            verificarResposta(botao.dataset.tipo);
        });
    }
}

/* =========================================================
   8. ARRASTAR O RESÍDUO

   Usamos eventos de ponteiro (pointerdown, pointermove,
   pointerup) no lugar dos de mouse.

   É isso que faz o jogo funcionar no celular: o navegador
   trata dedo, mouse e caneta como a mesma coisa, então um
   código só atende os três. Com mousedown, o toque na tela
   simplesmente não dispararia nada.
   ========================================================= */

let arrastando = false;
let pontoInicialX = 0;
let pontoInicialY = 0;
let lixeiraSobrevoada = null;

function prepararArraste() {
    let residuo = document.getElementById("residuo");
    residuo.addEventListener("pointerdown", iniciarArraste);
}


function iniciarArraste(evento) {
    if (podeJogar === false) {
        return;
    }

    evento.preventDefault();
    arrastando = true;

    // guarda onde o dedo encostou, para calcular o quanto
    // ele andou a partir dali
    pontoInicialX = evento.clientX;
    pontoInicialY = evento.clientY;

    let residuo = document.getElementById("residuo");

    residuo.style.zIndex = "1000";

    // sem isto, elementFromPoint devolveria a própria imagem em
    // vez da lixeira que está embaixo dela
    residuo.style.pointerEvents = "none";

    residuo.classList.add("arrastando");

    document.addEventListener("pointermove", moverResiduo);
    document.addEventListener("pointerup", soltarResiduo);
    document.addEventListener("pointercancel", soltarResiduo);
}

function moverResiduo(evento) {
    if (arrastando === false) {
        return;
    }

    // o quanto o dedo andou desde que encostou
    let deslocouX = evento.clientX - pontoInicialX;
    let deslocouY = evento.clientY - pontoInicialY;

    let residuo = document.getElementById("residuo");

    /* transform desloca a imagem só na aparência: ela continua
       ocupando o mesmo espaço no layout.

       Se usássemos position: fixed, a imagem sairia do fluxo,
       a página inteira subiria e as lixeiras mudariam de lugar
       no meio do arrasto — soltar em cima delas erraria o alvo. */
    residuo.style.transform = "translate(" + deslocouX + "px, " + deslocouY + "px)";

    destacarLixeiraEmbaixo(evento.clientX, evento.clientY);
}

/* Acende a lixeira que está embaixo do resíduo durante o
   arrasto. Sem isso o jogador solta às cegas. */
function destacarLixeiraEmbaixo(x, y) {
    let lixeira = acharLixeiraEm(x, y);

    // se continua sobre a mesma lixeira, não precisa fazer nada
    if (lixeira === lixeiraSobrevoada) {
        return;
    }

    if (lixeiraSobrevoada !== null) {
        lixeiraSobrevoada.classList.remove("sobrevoo");
    }

    if (lixeira !== null) {
        lixeira.classList.add("sobrevoo");
    }

    lixeiraSobrevoada = lixeira;
}

/* elementFromPoint devolve o elemento que está naquele ponto
   da tela. closest sobe pelos pais até achar uma lixeira, o
   que resolve quando o dedo cai sobre a imagem ou sobre o nome
   dentro do botão. */
function acharLixeiraEm(x, y) {
    let elemento = document.elementFromPoint(x, y);

    if (elemento === null) {
        return null;
    }

    return elemento.closest(".lixeira");
}

function soltarResiduo(evento) {
    if (arrastando === false) {
        return;
    }

    arrastando = false;

    let lixeira = acharLixeiraEm(evento.clientX, evento.clientY);

    devolverResiduoAoLugar();

    document.removeEventListener("pointermove", moverResiduo);
    document.removeEventListener("pointerup", soltarResiduo);
    document.removeEventListener("pointercancel", soltarResiduo);

    if (lixeira !== null) {
        verificarResposta(lixeira.dataset.tipo);
    }
}

/* Limpa os estilos que o arrasto aplicou, para a imagem voltar
   a obedecer o CSS. */
function devolverResiduoAoLugar() {
    let residuo = document.getElementById("residuo");

    residuo.style.transform = "";
    residuo.style.zIndex = "";
    residuo.style.pointerEvents = "";

    residuo.classList.remove("arrastando");

    if (lixeiraSobrevoada !== null) {
        lixeiraSobrevoada.classList.remove("sobrevoo");
        lixeiraSobrevoada = null;
    }
}

/* =========================================================
   9. COMEÇAR
   ========================================================= */
function comecarJogo() {
    // é a página do relógio ou a das vidas?
    if (document.getElementById("tempo")) {
        modoAtual = "tempo";
    } else {
        modoAtual = "classico";
    }

    aplicarDaltonico();
    prepararLixeiras();
    prepararArraste();
    atualizarPainel();
    sortearResiduo();

    if (modoAtual === "tempo") {
        iniciarCronometro();
    }
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

    mostrarHistorico();
}

/* =========================================================
   10. TELA DE RESULTADO
   ========================================================= */

function mostrarResultado() {
    let modo = pegar(sessionStorage, "ecomania_modo", "");

    // abriu final.html sem ter jogado: volta para o menu
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
    prepararMenu();          // tela inicial
}

if (document.getElementById("residuo")) {
    comecarJogo();           // uma das telas de jogo
}

if (document.getElementById("titulo-final")) {
    mostrarResultado();      // tela de resultado
}

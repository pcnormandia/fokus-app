//Manipulando elementos com variáveis
const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('./sons/luna-rise-part-one.mp3');
const startPauseBT = document.querySelector('#start-pause');
let tempoDecorridoEmSegundos = 1500;
let intervaloID = null;
const somDePlay = new Audio('./sons/play.wav');
const somDePause = new Audio('./sons/pause.mp3');
const somDeTerminado = new Audio('./sons/beep.mp3');
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const pauseBt = document.querySelector('.app__card-primary-butto-icon src')
const tempoNatela = document.getElementById('timer')


//Funções para alteração de classes e mudança de estado dos elementos

musica.loop = true;
musicaFocoInput.addEventListener("change", function() {
  if (musica.paused) {
      musica.play();      
  } else {
      musica.pause();      
  }
});

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    focoBt.classList.add('active');
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active'); 
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');  
})

function alterarContexto(contexto){
    mostrarTempo()
    botoes.forEach(function (contexto){
        contexto.classList.remove('active');
    })
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case 'descanso-curto':
            titulo.innerHTML = `Que tal dar uma respirada? <br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>`
            break;
        case 'descanso-longo':
            titulo.innerHTML = `Hora de voltar à superfície. <br>
            <strong class="app__title-strong">Faça uma pausa longa!</strong>`
            break;
                
        default:
            break;
    }
}

const contagemRegressiva = () =>{ //Realizar a contagem regressiva
    if(tempoDecorridoEmSegundos <=0){       
        //somDeTerminado.play()
        alert('Tempo Finalizado!')         
        
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';//Objetivo é verificar se o foco está ativo
        if(focoAtivo){
            const evento = new CustomEvent('FocoFinalizado')//criação de um evento customizado
            document.dispatchEvent(evento);//Fazendo o brodcast deste evento (tornando-o disponível por toda aplicação)
        }  
        zerar() 
        return
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
}

startPauseBT.addEventListener('click', iniciarOuPausar); //Ouvindo o click do botão play/pause para chamar a função

//Funções

function iniciarOuPausar(){
    if(intervaloID){
        somDePause.play();
        zerar();
        return
    }
    somDePlay.play();
    intervaloID = setInterval(contagemRegressiva, 1000);
    iniciarOuPausarBt.textContent = 'Pausar';
    iniciarOuPausarBt.previousElementSibling.setAttribute('src', './imagens/pause.png')
}

function zerar(){
    clearInterval(intervaloID);
    iniciarOuPausarBt.textContent = "Começar"
    iniciarOuPausarBt.previousElementSibling.setAttribute('src','./imagens/play_arrow.png')
    intervaloID = null;
}

function mostrarTempo () {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
    tempoNatela.innerHTML = `${tempoFormatado}`
}

mostrarTempo();



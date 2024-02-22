//Variáveis para os elementos HTML
const btnAddTask = document.querySelector('.app__button--add-task');
const formAddTask = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea')
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []; //Array para receber as tarefas e armazenar no localStorage
let tarefaSelecionada = null; //definir variáveis para lidar com a seleção e descrição de tarefas
let liDaTarefaSelecionada = null;
const ulTarefas = document.querySelector('.app__section-task-list');
const btCancelar = document.querySelector('.app__form-footer__button--cancel');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');

//Funções

function atualizarTarefas(){ //Função para update do array tarefas
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function cancelarCriarTarefa(){ //Função para cancelar a criação de uma nova tarefa
    textArea.value = '';
    formAddTask.classList.add('hidden')
}

function criarElementoTarefa(tarefa){ //Função para criar uma tarefa
    const li = document.createElement('li'); //Criando um novo elemento lista
    li.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg'); //Criando um novo elemento svg
    svg.innerHTML = `    
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `;

    const paragrafo = document.createElement('p'); //Criando um novo elemento paragrafo
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button'); //Criando um novo elemento botão
    botao.classList.add('app_button-edit');    

    botao.onclick = () => { //Chamando prompt para receber e validar nova descrição (!= null ou != vazio)
        const novaDescricao = prompt('Qual é o novo nome da tarefa?');
        if (novaDescricao) {        
            paragrafo.textContent = novaDescricao;
            tarefa.descricao = novaDescricao
            atualizarTarefas();
        }        
    }

    const imagemDoBotao = document.createElement('img'); //Criando um novo elemento img apartir de um arquivo
    imagemDoBotao.setAttribute('src', '/imagens/edit.png')
    
    botao.append(imagemDoBotao); //Juntando todos os elementos na hieraquia do html via li
    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    //Verifica se uma tarefa está completa e, se não, ao clicar no botão do li uma tarefa será selecionada
    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete'); //altera o style para complete
        botao.setAttribute('disabled', 'disabled');//desabilita o botão de edição
    }else{
        li.onclick = ()=>{//Selecionando apenas uma tarefa como ativa
        document.querySelectorAll('.app__section-task-list-item-active')
            .forEach(elemento => {
                elemento.classList.remove('app__section-task-list-item-active')
            })
        
        if(tarefaSelecionada == tarefa){ //Limpar o conteúdo da tarefa ativa
            paragrafoDescricaoTarefa.textContent = '';
            tarefaSelecionada = null;
            liDaTarefaSelecionada = null
            return
        }
        tarefaSelecionada = tarefa //manter um registro da tarefa atualmente selecionada, junto com o seu li.
        liDaTarefaSelecionada = li //acomplando o evento de clique a li
        paragrafoDescricaoTarefa.textContent = tarefa.descricao //Adicionar a capacidade de selecionar uma tarefa específica.        
        li.classList.add('app__section-task-list-item-active')
    }
    }
    
    return li
}

//Ações após eventos

btnAddTask.addEventListener('click', () =>{  //Ação após click para criar uma tarefa
    formAddTask.classList.toggle('hidden'); 
})

formAddTask.addEventListener('submit', (evento) => { //Após submissão prevenir comportamento padrão e adicionar tarefa no form 
    evento.preventDefault();    
    const tarefa = {
        descricao: textArea.value
    }
    tarefas.push(tarefa); //Atualizar o array
    const elementoTarefa = criarElementoTarefa(tarefa); //Criar um novo elemento de tarefa
    ulTarefas.append(elementoTarefa);
    atualizarTarefas(); //Atualizar as informações do localStorage
    textArea.value = '';
    formAddTask.classList.add('hidden')
})

tarefas.forEach(tarefa => { //Ação de chamar as informações da localStorage e criar os elementos na tela
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
});

btCancelar.addEventListener('click', () =>{ //Após click no botão cancelar, cancela a criação de uma nova tarefa
    cancelarCriarTarefa();
})

//adicionando o evento customizado para ser ouvido
//Implementando uma função que altera a tarefa selecionada de active para complete, mude o estilo e desabilite o botão.
document.addEventListener('FocoFinalizado', () => { 
    //Verificando se há uma tarefa e li selecionada.
    if(tarefaSelecionada && liDaTarefaSelecionada){
        liDaTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liDaTarefaSelecionada.classList.add('app__section-task-list-item-complete'); //altera o style para complete
        liDaTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');//desabilita o botão de edição
        tarefaSelecionada.completa = true;
        atualizarTarefas()
    }
})
//Função para remover tarefas completas ou todas
 const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas? ".app__section-task-list-item-complete":".app__section-task-list-item"
    document.querySelectorAll(seletor).forEach(elemento =>{
        elemento.remove();
    })
    tarefas = somenteCompletas? tarefas.filter(tarefa => !tarefa.completa): [] //Filtrando todas as tarefas que não estão completas
    atualizarTarefas();//Atualizando o localStorage
}

btnRemoverConcluidas.onclick = () => removerTarefas(true)
btnRemoverTodas.onclick = () => removerTarefas(false)
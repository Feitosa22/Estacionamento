//Usando operador ternário, se tiver no LocalStorage do navegador o json dados ele pega, se não tiver nada cria uma array vazio.
//Para verificar LocalStorage no navegador aperta F12(Inspecionar) > Application > Storage > LocalStorage
let dadosDoLocalStorage;
const pegarDadosDoLocalStorage = () => {
  dadosDoLocalStorage = localStorage.dados
    ? JSON.parse(localStorage.dados)
    : [];
  return dadosDoLocalStorage;
};

//Fornece uma maneira concisa de direcionar elementos em seu documento HTML usando seletores CSS
function pegarElementoPeloSeletorCss(selector) {
  const diretamentoDoHTML = document.querySelector(selector);
  return diretamentoDoHTML;
}

pegarElementoPeloSeletorCss(".dataDeHoje").innerText =
  new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

//Colocar uma lista de sugestões de nomes de carros no campo modelo
const listaNomeDeCarros = () => {
  let carros = pegarElementoPeloSeletorCss("#carros");
  fetch("json/nomesDosCarros.json").then(function (dados) {
    dados.json().then(function (dados) {
      dados.forEach(function (elemento) {
        let option = document.createElement("option");
        option.value = elemento.Modelo;
        carros.appendChild(option);
      });
    });
  });
};
listaNomeDeCarros();

//Pegar o horário atual e jogar no local destino passado como argunmento.
const PegarHorarioAtual = (localDeDestinoDoHorarioAtual) => {
  
  let hora = new Date().toLocaleString("pt-BR", {
    hour: "numeric",
    minute: "numeric",
  });
  pegarElementoPeloSeletorCss(localDeDestinoDoHorarioAtual).value = hora;
};

//mostrar os dados que foi passado como argumento para a interface
const mostrarDadosNaTabelaProUsuario = (dados, index) => {
  let corpoTabela = pegarElementoPeloSeletorCss("#corpoTabela");
  let tr = document.createElement("tr");
  corpoTabela.appendChild(tr);  
  tr.innerHTML = `    
      <tr>
      <td>${dados.Modelo}</td>
      <td>${dados.Placa}</td>
      <td class='color' id='${dados.Cor}'></td>
      <td data-time='${new Date().toLocaleDateString()}'>${dados.Entrada}</td>
      <td>${dados.Saida}</td>
      <td>
        <button type="button" id="checkout-${index}" data-action='checkout' data-indice="${index}"  class="button red">Baixar</button>
      </td>
      </tr>
      `;
};
const alertCustomizado = (msg) => {
  alert("Teste da função", msg);
};

const criarRegistroEntradaVeiculo = () => {
  let Modelo = pegarElementoPeloSeletorCss("#Modelo").value;
  let Placa = pegarElementoPeloSeletorCss("#Placa").value;
  let Cor = pegarElementoPeloSeletorCss("#Cor").value;
  let horarioEntrada = pegarElementoPeloSeletorCss("#horarioEntrada").value;
  let horarioSaida = pegarElementoPeloSeletorCss("#horarioSaida").value;
  if (!Modelo || !Placa || !horarioEntrada) {
    alertCustomizado(Modelo);
    return;
  }
  let dataObject = {
    Id: Date.now(),
    Modelo: `${Modelo}`,
    Placa: `${Placa}`,
    Cor: `${Cor}`,
    Entrada: `${horarioEntrada}`,
    Saida: `${horarioSaida}`,
    Register: new Date().toLocaleString(),
  };
  pegarDadosDoLocalStorage();
  dadosDoLocalStorage.push(dataObject);
  localStorage.dados = JSON.stringify(dadosDoLocalStorage);
  mostrarDadosNaTabelaProUsuario(dataObject, 0);
  const limparCamposInput = document
    .querySelectorAll(".cleanField")
    .forEach((eachField) => (eachField.value = ""));
};

const calcularValorPagar = (horas) => {
  const valorHora = 2;
  const valorMinimo = 5;
  return horas <= 1 ? valorMinimo : horas * valorHora + valorMinimo;
};

const calcularTempoEstacionado = (entrada, saida) => {
  const entradaDate = new Date(entrada);
  console.log("entrada date : \n"+entradaDate);
  const saidaDate = new Date(saida);
  const diffMilliseconds = saidaDate - entradaDate;
  return Math.ceil(diffMilliseconds / (1000 * 60 * 60));
};

const saidaDeCarro = () => {
  // //   const registerCheckOut = (index) => {
  // //     const dados = getGarage();
  // //     const carro = dados[index];
  let placaEncontrada = false;
  let dadosDoLocalStorage = pegarDadosDoLocalStorage();
  let Placa = pegarElementoPeloSeletorCss("#Placa").value;
  // let Saida = pegarElementoPeloSeletorCss("#horarioSaida").value;
  let Saida = Date.now();
  if (!Placa || !Saida) {
    alert("Digite a placa e saida!");
    return;
  }
  dadosDoLocalStorage.forEach((elemento) => {
    if (Placa === elemento.Placa) {
      placaEncontrada = true;
      const tempoEstacionado = calcularTempoEstacionado(elemento.Id, Saida);
      const valorPagar = calcularValorPagar(tempoEstacionado);
      alert(`Tempo estacionado: ${tempoEstacionado} horas \n valorPagar: ${valorPagar} Reais`);
      // //     localStorage.setItem("dados", JSON.stringify(dados));
      return;
    }
  });
  if(!placaEncontrada){
    alert("Placa não Encontrada!@")
  }
};

function mostrarCarrosEstacionados() {
  let corpoTabela = pegarElementoPeloSeletorCss("#corpoTabela");
  corpoTabela.innerHTML = "";
  
  fetch("json/dadosAmostra.json").then(function (dadosDoFetch) {
    dadosDoFetch.json().then(function (dadosDoFetch) {
      dadosDoFetch.forEach(function (elemento, index) {
        mostrarDadosNaTabelaProUsuario(elemento, index);
      });
    });
  });
}

pegarElementoPeloSeletorCss("#corpoTabela").addEventListener(
  "click",
  (event) => {
    let Saida = Date.now();
    let index = event.target.dataset.indice;
    let carro = pegarDadosDoLocalStorage()[index];
    if (event.target.type == "button") {      
      const tempoEstacionado = calcularTempoEstacionado(carro.Id, Saida);
      const valorPagar = calcularValorPagar(tempoEstacionado);
      alert(`Tempo estacionado: ${tempoEstacionado} horas \n valorPagar: ${valorPagar} Reais`);
    }
  }
);

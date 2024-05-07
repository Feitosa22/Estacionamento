let dadosDoLocalStorage;
const pegarDadosDoLocalStorage = () => {
  dadosDoLocalStorage = localStorage.dados
    ? JSON.parse(localStorage.dados)
    : [];
  return dadosDoLocalStorage;
};

const historicoDeCarrosEstacionados = () => {
  let historicoDoEstacioanmento = localStorage.historico
    ? JSON.parse(localStorage.historico)
    : [];
  return historicoDoEstacioanmento;
};

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

const listaNomeDeCarros = () => {
  let carros = document.querySelector("#carros");
  fetch("./json/dadosAmostra.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao carregar o JSON");
      }
      return response.json();
    })
    .then((data) => {
      const marcasDosCarros = data.marcaModelo;
      marcasDosCarros.forEach((carro) => {
        let option = document.createElement("option");
        option.value = carro.Modelo;
        carros.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
};
listaNomeDeCarros();

const PegarHorarioAtual = (localDeDestinoDoHorarioAtual) => {
  let horaEMinuto = new Date().toLocaleString("pt-BR", {
    hour: "numeric",
    minute: "numeric",
  });
  pegarElementoPeloSeletorCss(localDeDestinoDoHorarioAtual).value = horaEMinuto;
};

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
  try {
    let Modelo = pegarElementoPeloSeletorCss("#Modelo").value;
    let Placa = pegarElementoPeloSeletorCss("#Placa").value;
    let Cor = pegarElementoPeloSeletorCss("#Cor").value;
    let horarioEntrada = pegarElementoPeloSeletorCss("#horarioEntrada").value;
    let horarioSaida = pegarElementoPeloSeletorCss("#horarioSaida").value;
    let corpoTabela = pegarElementoPeloSeletorCss("#corpoTabela");

    if (!Modelo || !Placa || !horarioEntrada) {
      alert("Preencha os campos Modelo, Placa e Entrada!");
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

    corpoTabela.innerHTML = "";
    mostrarDadosNaTabelaProUsuario(dataObject, 0);

    const limparCamposInput = document
      .querySelectorAll(".cleanField")
      .forEach((eachField) => (eachField.value = ""));
  } catch (error) {
    alert("Erro Interno");
  }
};

const calcularValorPagar = (horas) => {
  const valorHora = 2;
  const valorMinimo = 5;
  return horas <= 1 ? valorMinimo : horas * valorHora + valorMinimo;
};

const calcularTempoEstacionado = (entrada, saida) => {
  const entradaDate = new Date(entrada);
  const saidaDate = new Date(saida);
  const diffMilliseconds = saidaDate - entradaDate;
  return Math.ceil(diffMilliseconds / (1000 * 60 * 60));
};

const saidaDeCarro = () => {
  let Placa = pegarElementoPeloSeletorCss("#Placa").value;
  let Saida = Date.now();
  let hora = new Date(Saida).toLocaleString("pt-BR", {
    hour: "numeric",
    minute: "numeric",
  });
  let corpoTabela = pegarElementoPeloSeletorCss("#corpoTabela");
  let placaEncontrada = false;
  pegarDadosDoLocalStorage();

  if (!Placa || !Saida) {
    alert("Digite a placa e saida!");
    return;
  }

  pegarDadosDoLocalStorage();
  dadosDoLocalStorage.forEach((elemento, index) => {
    if (Placa === elemento.Placa) {
      console.log(elemento);
      elemento.Saida = hora;
      placaEncontrada = true;
      const tempoEstacionado = calcularTempoEstacionado(elemento.Id, Saida);
      const valorPagar = calcularValorPagar(tempoEstacionado);
      alert(
        `Tempo estacionado: ${tempoEstacionado} horas \n valorPagar: ${valorPagar} Reais`
      );
      // //     localStorage.setItem("dados", JSON.stringify(dados));
      localStorage.dados = JSON.stringify(dadosDoLocalStorage);

      corpoTabela.innerHTML = "";
      mostrarDadosNaTabelaProUsuario(elemento, 0);
      return;
    }
  });
  if (!placaEncontrada) {
    alert("Placa não Encontrada!@");
  }
};

function mostrarCarrosEstacionados() {
  let corpoTabela = pegarElementoPeloSeletorCss("#corpoTabela");
  corpoTabela.innerHTML = "";
  pegarDadosDoLocalStorage();
  dadosDoLocalStorage.forEach((elemento, index) => {
    mostrarDadosNaTabelaProUsuario(elemento, index);
  });
}

pegarElementoPeloSeletorCss("#corpoTabela").addEventListener(
  "click",
  (event) => {
    pegarDadosDoLocalStorage();
    let corpoTabela = pegarElementoPeloSeletorCss("#corpoTabela");
    let Saida = Date.now();
    let hora = new Date(Saida).toLocaleString("pt-BR", {
      hour: "numeric",
      minute: "numeric",
    });
    let index = event.target.dataset.indice;
    let carro = pegarDadosDoLocalStorage()[index];
    if (event.target.type == "button") {
      corpoTabela.innerHTML = "";
      carro.Saida = hora;
      console.log(carro);
      const tempoEstacionado = calcularTempoEstacionado(carro.Id, Saida);
      const valorPagar = calcularValorPagar(tempoEstacionado);
      alert(
        `Tempo estacionado: ${tempoEstacionado} horas \n valorPagar: ${valorPagar} Reais`
      );
      localStorage.dados = JSON.stringify(dadosDoLocalStorage);
      mostrarDadosNaTabelaProUsuario(carro, 0);
    }
  }
);

let dadosDoLocalStorage;
const pegarDadosDoLocalStorage = () => {
  dadosDoLocalStorage = localStorage.dados
    ? JSON.parse(localStorage.dados)
    : [];
  return dadosDoLocalStorage;
};

const historico = () => {
  let historicoDoEstacioanmento = localStorage.historico
    ? JSON.parse(localStorage.historico)
    : [];
  return historicoDoEstacioanmento;
};

function pegarElemento(selector) {
  const diretamentoDoHTML = document.querySelector(selector);
  return diretamentoDoHTML;
}

const limparTabelaEInputs = () => {
  let corpoTabela = pegarElemento("#corpoTabela");
  corpoTabela.innerHTML = "";
  const limparCamposInput = document
    .querySelectorAll(".cleanField")
    .forEach((eachField) => (eachField.value = ""));
};

pegarElemento(".dataDeHoje").innerText = new Date().toLocaleString("pt-BR", {
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
        option.value = `${carro.modelo} (${carro.marca})`;
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
  pegarElemento(localDeDestinoDoHorarioAtual).value = horaEMinuto;
};

const mostrarDadosNaTabelaProUsuario = (dados, index) => {
  let corpoTabela = pegarElemento("#corpoTabela");
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

const alertCustomizado = (msg, cor) => {
  let MostrarnaTela = document.querySelector("#container");
  let divCriada = document.createElement("div");
  divCriada.classList.add("alertaCustomizado");
  divCriada.innerText = msg;
  MostrarnaTela.appendChild(divCriada);
  divCriada.style.backgroundColor = cor;
  setTimeout(() => {
    MostrarnaTela.removeChild(divCriada);
  }, 4500);
};

function verificarDuplicidade(Placa) {
  let boolean = false;
  let carroJaNaGaragem;
  dadosDoLocalStorage.forEach((carro) => {
    if (carro.Placa === Placa) {
      carroJaNaGaragem = carro;
      boolean = true;
      return;
    }
  });
  if (boolean) {
    limparTabelaEInputs();
    mostrarDadosNaTabelaProUsuario(carroJaNaGaragem, 0);
  }
  return boolean;
}

const criarRegistroEntradaVeiculo = () => {
  try {
    let Modelo = pegarElemento("#Modelo").value;
    let Placa = pegarElemento("#Placa").value;
    let Cor = pegarElemento("#Cor").value;
    let horarioEntrada = pegarElemento("#horarioEntrada").value;
    let horarioSaida = pegarElemento("#horarioSaida").value;

    pegarDadosDoLocalStorage();
    let carroJaEstacionado = verificarDuplicidade(Placa);
    if (!Modelo || !Placa || !horarioEntrada) {
      alertCustomizado("Preencha os campos Modelo, Placa e Entrada!", "red");
      return;
    } else if (carroJaEstacionado) {
      alertCustomizado("Veiculo já estacionado!", "yellow");
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

    dadosDoLocalStorage.push(dataObject);
    console.log(dadosDoLocalStorage.length);
    localStorage.dados = JSON.stringify(dadosDoLocalStorage);

    limparTabelaEInputs();
    
    mostrarDadosNaTabelaProUsuario(dataObject, dadosDoLocalStorage.length);
    alertCustomizado(`Veículo ${Modelo}\nPlaca ${Placa} estacionado!`, "blue");
  } catch (error) {
    alertCustomizado("Erro Interno!", "purple");
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
  let Placa = pegarElemento("#Placa").value;
  let Saida = pegarElemento("#horarioSaida").value;
  let horarioAtualizado = Date.now();
  horarioAtualizado = new Date(horarioAtualizado).setHours(
    Saida.substring(0, 2)
  );
  horarioAtualizado = new Date(horarioAtualizado).setMinutes(
    Saida.substring(3, 5)
  );
  let hora = new Date(horarioAtualizado).toLocaleString("pt-BR", {
    hour: "numeric",
    minute: "numeric",
  });
  let placaEncontrada = false;
  pegarDadosDoLocalStorage();

  if (!Placa || !Saida) {
    alertCustomizado("Placa e Horário de Saida Obrigatório!", "red");
    return;
  }

  pegarDadosDoLocalStorage();
  dadosDoLocalStorage.forEach((elemento, index) => {
    if (Placa === elemento.Placa) {
      let entradaAtualizada = new Date(elemento.Id).setHours(
        elemento.Entrada.substring(0, 2)
      );
      entradaAtualizada = new Date(elemento.Id).setMinutes(
        elemento.Entrada.substring(3, 5)
      );
      elemento.Saida = hora;
      placaEncontrada = true;
      const tempoEstacionado = calcularTempoEstacionado(
        entradaAtualizada,
        Saida
      );
      const valorPagar = calcularValorPagar(tempoEstacionado);
      alertCustomizado(`Valor a pagar: ${valorPagar} Reais`, "green");
      localStorage.dados = JSON.stringify(dadosDoLocalStorage);
      limparTabelaEInputs();
      mostrarDadosNaTabelaProUsuario(elemento, 0);
      return;
    }
  });
  if (!placaEncontrada) {
    alertCustomizado("Placa não Encontrada!", "yellow");
  }
};

function mostrarCarrosEstacionados() {
  limparTabelaEInputs();
  pegarDadosDoLocalStorage();
  dadosDoLocalStorage.forEach((elemento, index) => {
    mostrarDadosNaTabelaProUsuario(elemento, index);
  });
}

pegarElemento("#corpoTabela").addEventListener("click", (event) => {
  let Saida = Date.now();
  let hora = new Date(Saida).toLocaleString("pt-BR", {
    hour: "numeric",
    minute: "numeric",
  });
  let index = event.target.dataset.indice;
  pegarDadosDoLocalStorage();
  let carro = pegarDadosDoLocalStorage()[index];
  if (event.target.type == "button") {
    limparTabelaEInputs();
    carro.Saida = hora;
    let entradaAtualizada = new Date(carro.Id).setHours(carro.Entrada.substring(0, 2));
    entradaAtualizada = new Date(entradaAtualizada).setMinutes(carro.Entrada.substring(3, 5));
    const tempoEstacionado = calcularTempoEstacionado(entradaAtualizada, Saida);
    const valorPagar = calcularValorPagar(tempoEstacionado);
    alertCustomizado(`Valor a pagar: ${valorPagar} Reais`, "green");
    localStorage.dados = JSON.stringify(dadosDoLocalStorage);
    mostrarDadosNaTabelaProUsuario(carro, index);
  }
});

let dados = [];
// usar uma api para salvar os dados nos cookies como se fosse uma banco de dados offline
function InCar() {
  document.querySelector("#corpoTabela").innerText = "";
  let Modelo = document.querySelector("#Modelo").value;
  let Cor = document.querySelector("#Cor").value;
  let Placa = document.querySelector("#Placa").value;
  let Entrada = document.querySelector("#Entrada").value;
  let Saida = document.querySelector("#Saida").value;

  let objeto = {
    Modelo: `${Modelo}`,
    Placa: `${Placa}`,
    Cor: `${Cor}`,
    Entrada: `${Entrada}`,
    Saida: `${Saida}`,
  };
  dados.push(objeto);
  console.log(dados);
  let teste = parseFloat(Entrada).toFixed[2];
  console.log(teste)
  console.log(typeof teste)
  
  document.querySelector("#Modelo").value = "";
  document.querySelector("#Placa").value = "";
  document.querySelector("#Entrada").value = "";
  document.querySelector("#Saida").value = "";
  document.querySelector("#corpoTabela").innerHTML = `    
  <tr>
      <td>${Modelo}</td>
      <td>${Placa}</td>
      <td id='${Cor}'></td>
      <td>${Entrada}</td>
      <td>${Saida}</td>
  </tr>
`;
  let corpoTabela = document.querySelector("#corpoTabela");
  let tr = document.createElement("tr");
  corpoTabela.appendChild(tr);
}
function historico() {
  document.querySelector("#corpoTabela").innerText = "";
  dados.forEach(function (elem, index) {
    let corpoTabela = document.querySelector("#corpoTabela");
    let tr = document.createElement("tr");

    tr.innerHTML = `    
            <tr>
                <td>${dados[index].Modelo}</td>
                <td>${dados[index].Placa}</td>
                <td id='${dados[index].Cor}'></td>
                <td>${dados[index].Entrada}</td>
                <td>${dados[index].Saida}</td>
            </tr>
        `;

    corpoTabela.appendChild(tr);
  });
}
function OutCar() {
  let Placa = document.querySelector("#Placa").value;
  let Saida = document.querySelector("#Saida").value;
  for (let i = 0; i < dados.length; i++) {
    let entrou = dados[i].Entrada;
    if (Placa == dados[i].Placa) {
      // melhorar o código para contabilizar dias estacionados...
      // adicionar campo, valor pago na tela paga contabilizar no final o valor total bruto recebido.
      // adicionar botão com o horário atual para disponibilizar ao usuário
      let tEstacionado = parseInt(Saida) - parseInt(entrou);
      let valorApagar = (tEstacionado -1) * 2 + 5;

      alert(`Total á pagar R$ ${valorApagar} reais.`);
      dados[i].Saida = Saida;
      document.querySelector("#corpoTabela").innerHTML = `    
            <tr>
                <td>${dados[i].Modelo}</td>
                <td>${dados[i].Placa}</td>
                <td id='${dados[i].Cor}'></td>
                <td>${dados[i].Entrada}</td>
                <td>${dados[i].Saida}</td>
            </tr>`;
      let corpoTabela = document.querySelector("#corpoTabela");
      let tr = document.createElement("tr");
      corpoTabela.appendChild(tr);
      document.querySelector("#Modelo").value = "";
      document.querySelector("#Placa").value = "";
      document.querySelector("#Entrada").value = "";
      document.querySelector("#Saida").value = "";
    }
  }
}


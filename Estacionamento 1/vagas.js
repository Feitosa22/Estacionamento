(function () {
  const $ = (q) => document.querySelector(q);
  const getGarage = () =>
    localStorage.dados ? JSON.parse(localStorage.dados) : [];

  $("#horaAtual").addEventListener("click", () => {
    let hora = new Date().toLocaleString("pt-BR", {
      hour: "numeric",
      minute: "numeric",
    });
    $("#Entrada").value = hora;
  });

  $("#horaAtual2").addEventListener("click", () => {
    let hora = new Date().toLocaleString("pt-BR", {
      hour: "numeric",
      minute: "numeric",
    });
    $("#Saida").value = hora;
  });

  $("#checkIn").addEventListener("click", (client, index) => {
    const Modelo = $("#Modelo").value;
    const Placa = $("#Placa").value;
    const Cor = $("#Cor").value;
    const Entrada = $("#Entrada").value;
    const Saida = $("#Saida").value;
    if (!Modelo || !Placa || !Entrada) {
      alert("Digite o horário de entrada, a placa e a marca/modelo do carro.");
      return;
    }
    let objeto = {
      Modelo: `${Modelo}`,
      Placa: `${Placa}`,
      Cor: `${Cor}`,
      Entrada: `${Entrada}`,
      Saida: `${Saida}`,
      Register: new Date().toLocaleString(),
    };
    $("#corpoTabela").innerText = "";
    $("#corpoTabela").innerHTML = `    
        <tr>
        <td>${Modelo}</td>
        <td>${Placa}</td>
        <td class='color' id='${Cor}'></td>
        <td data-time='${new Date().toLocaleDateString()}'>${Entrada}</td>
        <td>${Saida}</td>
        <td>
          <button type="button" id="checkout-${index}" data-action='checkout' data-indice="${index}"  class="button red">Baixar</button>
        </td>
        `;
    const dados = getGarage();
    dados.push(objeto);
    localStorage.dados = JSON.stringify(dados);
    let corpoTabela = $("#corpoTabela");
    let tr = document.createElement("tr");
    corpoTabela.appendChild(tr);
    const cleanField = document
      .querySelectorAll(".cleanField")
      .forEach((eachField) => (eachField.value = ""));
  });

  $("#parking").addEventListener("click", () => {
    $("#corpoTabela").innerText = "";
    let dados = getGarage();
    dados.forEach(function (elem, index) {
      let corpoTabela = document.querySelector("#corpoTabela");
      let tr = document.createElement("tr");
      tr.innerHTML = `    
          <tr>
          <td>${dados[index].Modelo}</td>
          <td>${dados[index].Placa}</td>
          <td class='color' id='${dados[index].Cor}'></td>
          <td>${dados[index].Entrada}</td>
          <td>${dados[index].Saida}</td>
          <td>
          <button type="button" id="checkout-${index}" data-action='checkout' data-indice="${index}"  class="button red">Baixar</button>
          </td>
          </tr>
          `;
      corpoTabela.appendChild(tr);
    });
  });

  $("#checkOut").addEventListener("click", () => {
    let Placa = $("#Placa").value;
    let Saida = $("#Saida").value;
    if (!Placa || !Saida) {
      alert("Digite a placa e o horário de saida.");
      return;
    }
    const dados = getGarage();
    $("#corpoTabela").innerText = "";
    let consulta = false;
    for (let index = 0; index < dados.length; index++) {
      if (Placa == dados[index].Placa) {
        consulta = true;
        dados[index].Saida = Saida;
        $("#corpoTabela").innerHTML = `    
        <tr>
        <td>${dados[index].Modelo}</td>
        <td>${dados[index].Placa}</td>
        <td class='color' id='${dados[index].Cor}'></td>
        <td>${dados[index].Entrada}</td>
        <td>${dados[index].Saida}</td>
        <td>
        <button type="button" id="checkout-${index}" data-action='checkout' data-indice="${index}"  class="button red">Baixar</button>
        </td>
        </tr>`;
        let corpoTabela = $("#corpoTabela");
        let tr = document.createElement("tr");
        corpoTabela.appendChild(tr);

        let tempo =
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            Number(dados[index].Saida[0] + Saida[1]),
            Number(dados[index].Saida[3] + Saida[4]),
            0
          ) -
          new Date(
            Number(
              dados[index].Register[6] +
                dados[index].Register[7] +
                dados[index].Register[8] +
                dados[index].Register[9]
            ),
            Number(dados[index].Register[3] + dados[index].Register[4]) - 1,
            Number(dados[index].Register[0] + dados[index].Register[1]),
            Number(dados[index].Entrada[0] + dados[index].Entrada[1]),
            Number(dados[index].Entrada[3] + dados[index].Entrada[4])
          );
        let horas = Math.floor(tempo / 3600000);
        let min = Math.floor((tempo % 3600000) / 60000);
        let portugol = "hora";
        if (horas > 1) {
          portugol = "horas";
        }
        let portugol1 = "minuto";
        if (min > 1) {
          portugol1 = "minutos";
        }
        if (horas == 0 && min <= 15) {
          alert(
            `O carro permaneceu por ${horas} ${portugol} e ${min} ${portugol1} no estacionamento.\n Tolerância de 15 minutos. \n Total á pagar R$ 0,00 reais.`
          );
        } else {
          let valor = horas * 2 + 5;
          alert(
            `O carro permaneceu por ${horas} ${portugol} e ${min} ${portugol1} no estacionamento.\n Total á pagar R$ ${valor},00 reais.`
          );
        }
        // alert(`O cliente ficou ${horas} horas e ${min} minutos. \n\n Total á pagar R$ ${valor.toFixed(2)} reais.`) <- Caso de centavos;
      }
    }
    if (consulta == false) {
      alert("Placa não encontrada.");
    }
    const cleanField = document
      .querySelectorAll(".cleanField")
      .forEach((eachField) => (eachField.value = ""));
    localStorage.dados = JSON.stringify(dados);
  });
//   const editDelete=(event)=>{
//     if(event.target.type == 'button'){
//             const [action, index] = event.target.id.split('-')
//         console.log(event.target.id,event.target.dataset.action, event.target.dataset.indice )
//         console.log(event.target.id.split('-'))
//         if(action == 'edit'){
//             editClient(index)
//         }else{
//             const client = readClient()[index]
//             const response = confirm(`Deseja realmente excluir o cliente ${client.nome} ?`)
//             if(response){
//                 deleteClient(index)
//                 updateTable()
//             }
//         }
//     }
// }
$("#corpoTabela").addEventListener('click', (event)=>{
  let dados = getGarage();
  let index = event.target.dataset.indice;
  console.log(typeof dados[index].Saida)
    if(event.target.type == 'button'){
      if(dados[index].Saida === ""){
        let tempo =
        new Date() -
        new Date(
          Number(
            dados[index].Register[6] +
              dados[index].Register[7] +
              dados[index].Register[8] +
              dados[index].Register[9]
          ),
          Number(dados[index].Register[3] + dados[index].Register[4]) - 1,
          Number(dados[index].Register[0] + dados[index].Register[1]),
          Number(dados[index].Entrada[0] + dados[index].Entrada[1]),
          Number(dados[index].Entrada[3] + dados[index].Entrada[4])
        );
        let horas = Math.floor(tempo / 3600000);
        let min = Math.floor((tempo % 3600000) / 60000);
        let portugol = "hora";
        if (horas > 1) {
          portugol = "horas";
        }
        let portugol1 = "minuto";
        if (min > 1) {
          portugol1 = "minutos";
        }
        if (horas == 0 && min <= 15) {
          let response = confirm(
            `O carro permaneceu por ${horas} ${portugol} e ${min} ${portugol1} no estacionamento.\n Tolerância de 15 minutos. \n Total á pagar R$ 0,00 reais.\n\nDar baixa no veículo ?`
            )
            if(response){
              $("#corpoTabela").innerText = "";
              $("#corpoTabela").innerHTML = `    
              <tr>
              <td>${dados[index].Modelo}</td>
              <td>${dados[index].Placa}</td>
              <td class='color' id='${dados[index].Cor}'></td>
              <td>${dados[index].Entrada}</td>
              <td>${new Date().toLocaleString("pt-BR", {
                hour: "numeric",
                minute: "numeric",
              })}</td>
              <td>
              <button type="button" id="checkout-${index}" data-action='checkout' data-indice="${index}"  class="button red">Baixar</button>
              </td>
              </tr>`;
              let corpoTabela = $("#corpoTabela");
              let tr = document.createElement("tr");
              corpoTabela.appendChild(tr);
              dados[index].Saida = new Date().toLocaleString("pt-BR", {
                hour: "numeric",
                minute: "numeric",
              });
              localStorage.dados = JSON.stringify(dados);
            }else{

            }
        } else {
          let valor = horas * 2 + 5;
          alert(
            `O carro permaneceu por ${horas} ${portugol} e ${min} ${portugol1} no estacionamento.\n Total á pagar R$ ${valor},00 reais.`
          );
        }
      }else{
        confirm
      }

    }
})
})();

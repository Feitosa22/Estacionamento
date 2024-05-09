const campoInput = document.getElementById("Placa");

campoInput.addEventListener("input", function (event) {
  let valorAtual = event.target.value.toUpperCase();
  let valorFormatado = "";

  valorAtual = valorAtual.replace(/[^A-Z0-9]/g, "");

  for (let i = 0; i < valorAtual.length; i++) {
    if (i < 3) {
      valorFormatado += valorAtual.charAt(i).replace(/[^A-Z]/g, "");
    } else if (i === 3) {
      valorFormatado += "-" + valorAtual.charAt(i).replace(/[^0-9]/g, "");
    } else if (i === 4) {
      valorFormatado += valorAtual.charAt(i).replace(/[^A-Z0-9]/g, "");
    } else if (i === 5) {
      valorFormatado += valorAtual.charAt(i).replace(/[^0-9]/g, "");
    } else if (i === 6 || i === 7) {
      valorFormatado += valorAtual.charAt(i).replace(/[^0-9]/g, "");
    }
  }

  event.target.value = valorFormatado.slice(0, 8);
});

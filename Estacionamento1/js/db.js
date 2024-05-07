// const fs = require("fs");

// // let dadosDoLocalStorage;
// // const pegarDadosDoLocalStorage = () => {
// //   dadosDoLocalStorage = localStorage.dados
// //     ? JSON.parse(localStorage.dados)
// //     : [];
// //   return dadosDoLocalStorage;
// // };
// // pegarDadosDoLocalStorage();

// let posts = [];

// function read() {
//   try {
//     posts = JSON.parse(fs.readFileSync("./json/dadosAmostra.json", { encoding: "utf-8" }));
//   } catch (error) {
//     console.error("Erro ao ler o arquivo JSON:", error);
//   }
//   return posts;
// }

// function write(data) {
//   try {
//     fs.writeFileSync("./json/dadosAmostra.json", JSON.stringify(data), { encoding: "utf-8" });
//     console.log("Arquivo JSON atualizado com sucesso!");
//   } catch (error) {
//     console.error("Erro ao escrever no arquivo JSON:", error);
//   }
// }

// // module.exports = { read, write };


// // const crud = {
// //   posts: [],
// //   read() {
// //     crud.posts = JSON.parse(
// //       fs.readFileSync("../json/dados.json", { encoding: "utf-8" })
// //     );
// //     console.log(crud.posts);
// //     return crud.posts;
// //   },
// //   create(objeto) {
// //     crud.read();
// //     crud.posts.push(objeto);
// //     fs.writeFileSync("../json/dados.json", JSON.stringify(crud.posts), {
// //       encoding: "utf-8",
// //     });
// //   },
// // };


click('btnBusca', () => {
	showId('busca', 'flex')
	hideIds(['controle', 'cadastro', 'transporte', 'selecionarTP'])
})

// contador incrementado a cada resultado de busca encontrado
var resultadoBusca = 0
var conteudoBusca = []

// funcao executada ao final da busca informando o número de resultados encontrados
function resultadoZero(x) {
    db.ref('buscas').push().set(conteudoBusca)
    if (x == 0) {
        alert("nenhum resultado")
    } else {
        if (x == 1) {
            alert("Foi encontrado 1 resultado. Clique em OK para visualizar.")
            imprimir('tabela')
            setTimeout(() => {
                reload()
            }, 1000)
        } else {
            alert("Foram encontrados " + x + " resultados. Clique em OK para visualizar.")
            imprimir('tabela')
            setTimeout(() => {
                reload()
            }, 1000)
        }
    }
    resultadoBusca = 0
}


// IMPRIMIR
// criar um <div id="imprimir"> com as informaçoes da variavel conteudoBusca
// em formato de tabela simples
// passar a id dessa div como parametro ao chamar a função imprimir() 

function imprimir(tabela) {
    var mywindow = window.open('', Math.random(), '');
  
      mywindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css"><title>' + tituloImpressao  + '</title>');
      mywindow.document.write('</head><body >');
      mywindow.document.write('<h1>' + document.title  + '</h1>');
      mywindow.document.write(document.getElementById(tabela).innerHTML);
      mywindow.document.write('</body></html>');
  
      return true;
  }
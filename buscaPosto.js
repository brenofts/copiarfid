// BUSCA POR POSTO

click('btnBuscaPosto', () => {
	showId('buscaPosto', 'flex')
	hideIds(['buscaData', 'buscaMatr', 'buscaTP'])
})

function buscarPosto(posto) {
      db.ref("historico")
      .once("value")
      .then((snapshot) => {
          var data = Object.values(snapshot.val())
          function gerarTabela(valores) {
            var titulo = 'Busca de Registros do Posto ' + posto + ' | Realizada em ' + new Date(new Date().getTime() + diferencaHora).toLocaleString() + ' | ' + window.posto
            tituloTabela.innerHTML, tituloImpressao = titulo
            conteudoBusca[0] = tituloTabela.innerHTML
            for (var i = 0; i < valores.length; i++) {
                if (posto == valores[i].posto) {
                    var item = `<tr>
                        <td><strong>${valores[i].tp}</strong></td>
                        <td>${valores[i].status}</td>
                        <td>${new Date(valores[i].data).toLocaleDateString()}</td>
                        <td>${new Date(valores[i].data).toLocaleTimeString()}</td>
                        <td>${valores[i].id}</td>
                        <td>${valores[i].gerente}</td>
                        <td>${valores[i].posto}</td>
                  </tr>`
                    bodyTabela.innerHTML += item
                    resultadoBusca++
                    conteudoBusca[i + 1] = valores[i]
                }
            }
            return resultadoZero(resultadoBusca)
        }
        gerarTabela(data.reverse())
    }).catch(e => console.log(e.message))
}

var btnBuscouPosto = document.getElementById('btnBuscarPosto')
var selBuscouPosto = document.getElementById('selBuscaPosto')
btnBuscouPosto.addEventListener('click', e => {
	e.preventDefault()
    buscarPosto(selBuscaPosto.value)
})
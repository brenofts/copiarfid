// BUSCA POR TP

function buscarTP(numeroTP) {
	db.ref('historico')
		.once('value')
		.then(snapshot => {
			var buscouTp = Object.values(snapshot.val())
            var titulo = 'Busca de Registros do TP ' + numeroTP + ' | Realizada em ' + new Date(new Date().getTime() + diferencaHora).toLocaleString() + ' | ' + window.posto
            tituloTabela.innerHTML, tituloImpressao = titulo
            conteudoBusca[0] = tituloTabela.innerHTML
			buscouTp.reverse().map(registro => {
                if(registro.tp == numeroTP) {
                    var item = `<tr>
                        <td><strong>${registro.tp}</strong></td>
                        <td>${registro.status}</td>
                        <td>${new Date(registro.data).toLocaleDateString()}</td>
                        <td>${new Date(registro.data).toLocaleTimeString()}</td>
                        <td>${registro.id}</td>
                        <td>${registro.gerente}</td>
                        <td>${registro.posto}</td>
                  </tr>`
                  bodyTabela.innerHTML += item
                  resultadoBusca++
                  conteudoBusca[conteudoBusca.length + 1] = registro
                }
            })
            return resultadoZero(resultadoBusca)
		})
}

click('btnBuscaTP', () => {
	document.getElementById('tabelaBuscaTPs').innerHTML = ''
	showId('buscaTP', 'block')
	hideIds(['buscaPosto', 'buscaData', 'buscaMatr'])
	db.ref('tps')
		.once('value')
		.then(snap => {
			var resultado = Object.values(snap.val())
			resultado.map(tp => {
				var gridItem = `<div onclick="buscarTP(${tp.tp})" class="grid-item-">${tp.tp}</div>`
				document.getElementById('tabelaBuscaTPs').innerHTML += gridItem
			})
		})
})
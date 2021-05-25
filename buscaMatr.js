// BUSCA POR MATRÍCULA

click('btnBuscaMatr', () => {
	showId('buscaMatr', 'flex')
	hideIds(['buscaData', 'buscaPosto', 'buscaTP'])
	inputMatrBuscar.focus()
})

function buscarMatr(matricula) {
	db.ref('historico')
		.once('value')
		.then(snapshot => {
			var resultado = Object.values(snapshot.val())
			function gerarTabela(valores) {
				var titulo = 'Busca pela matrícula ' + matricula + ' | Realizada em ' + new Date(new Date().getTime() + diferencaHora).toLocaleString() + ' | ' + posto
				tituloTabela.innerHTML, tituloImpressao = titulo
				conteudoBusca[0] = tituloTabela.innerHTML
                for (var i = 0; i < valores.length; i++) {
					if (matricula == valores[i].matricula) {
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
			gerarTabela(resultado.reverse())
		}).catch(e => console.log(e.message))
}


formBuscaMatr.addEventListener('submit', e => {
	e.preventDefault()
	if (inputMatrBuscar.value.length >= 4 && inputMatrBuscar.value.length < 6) {
		ajustarHora()
		.then(() => buscarMatr(inputMatrBuscar.value))
		.catch(e => {
			alert(e)
			reload()
		})
	} else {
		alert('Preencha corretamente')
		inputMatrBuscar.focus()
	}
})


// var item = `<tr style="background-color: red; color: white">
// 							<td><strong>${valores[i].tp}</strong></td>
//                             <td>${valores[i].status.status}</td>
//                             <td>${dias}</td>
//                             <td>${new Date(
//                               valores[i].status.data
//                             ).toLocaleDateString()}</td>
//                             <td>${new Date(
//                               valores[i].status.data
//                             ).toLocaleTimeString()}</td>
//                             <td>${valores[i].status.id}</td>
//                             <td>${valores[i].status.gerente}</td>
//                             <td>${valores[i].status.posto}</td>
// 					  </tr>`

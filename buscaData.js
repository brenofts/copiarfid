// BUSCA POR DATA
click('btnBuscaData', () => {
	setMax()
	hideIds(['buscaMatr', 'buscaPosto', 'buscaTP'])
	showId('buscaData', 'flex')
	inputDataInicial.focus()
})

function buscarData(dia) {
	db.ref('historico')
		.once('value')
		.then(snapshot => {
			var resultado = Object.values(snapshot.val())
			function gerarTabela(valores) {
				//var ajusteHorario = 10800000
				//var data = new Date(dia + ajusteHorario).toLocaleDateString()
				var data = new Date(dia).toLocaleDateString()
				var titulo = 'Busca pela data ' +
				data +
				' | Realizada em ' +
				new Date(new Date().getTime() + diferencaHora).toLocaleString() +
				' | ' +
				posto 
				tituloTabela.innerHTML, tituloImpressao = titulo
 					
				conteudoBusca[0] = tituloTabela.innerHTML
				for (var i = 0; i < valores.length; i++) {
					// a data deve ser ajustada considerando a diferença de 3h do fuso horário de brasília
					// Daí a necessidade de adicionar 3 horas em milissegundos (10800000) à data selecionada
					// verificar condições em horário de verão
					var dataRegistro = new Date(valores[i].data).toLocaleDateString()
					if (data == dataRegistro) {
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
						conteudoBusca[conteudoBusca.length + 1] = valores[i]
					}
				}
				return resultadoZero(resultadoBusca)
			}
			gerarTabela(resultado.reverse())
		})
}
const setMin = () =>{
	var day = new Date(dataInicial)
			var dd = day.getDate()
			var mm = day.getMonth() + 1 //January is 0!
			var yyyy = day.getFullYear()
			if (dd < 10) {
				dd = '0' + dd
			}
			if (mm < 10) {
				mm = '0' + mm
			}

			day = yyyy + '-' + mm + '-' + dd
			document.getElementById('inputDataFinal').setAttribute('min', day)
}
const setMax = () => {
	var today = new Date()
	var dd = today.getDate()
	var mm = today.getMonth() + 1 //January is 0!
	var yyyy = today.getFullYear()
	if (dd < 10) {
		dd = '0' + dd
	}
	if (mm < 10) {
		mm = '0' + mm
	}

	today = yyyy + '-' + mm + '-' + dd
	document.getElementById('inputDataInicial').setAttribute('max', today)
	document.getElementById('inputDataFinal').setAttribute('max', today)
}


inputDataInicial.addEventListener('input', () => {
	dataInicial = Date.parse(inputDataInicial.value) + 10800000
	var dia = new Date().getDate()
	var mes = new Date().getMonth()
	var ano = new Date().getFullYear()
	hoje = new Date(ano, mes, dia).getTime()
	inputDataInicial.blur()
	document.getElementById('btnBuscarData').classList.remove('hidden')
	if (dataInicial == hoje) {
		qualData = 'hoje'
	} else {
		if (dataInicial < hoje) {
			setMin()
			qualData = 'data'
			inputDataFinal.removeAttribute('class')
			lblDataFinal.removeAttribute('class')
		}
	}
})

inputDataFinal.addEventListener('input', () => {

	dataFinal = Date.parse(inputDataFinal.value) + 10800000 + (1000 * 60 * 60 * 24) - 1 //ajustando +24horas - 1 milisegundo
	if (dataFinal == dataInicial) {
		qualData = 'data'
	} else {
		qualData = 'periodo'
	}
})

var qualData

formBuscaData.addEventListener('submit', e => {
	switch (qualData) {
		case 'hoje':
			ajustarHora()
				.then(() => buscarData(hoje))
				.catch(e => {
					alert(e)
					reload()
				})
			break
		case 'periodo':
			ajustarHora().then(() => buscarPeriodo(dataInicial,dataFinal))
			
			break
		case 'data':
			ajustarHora().then(() => {
				buscarData(dataInicial)
			})
			break
		default:
			break
	}
	// ajustarHora()
	// 	.then(() => buscarData(inputDataBuscar.valueAsNumber))
	// 	.catch(e => {
		// 		alert(e)
		// 		reload()
		// 	})
	})
	
const buscarPeriodo = (inicio,fim) => {
		db.ref('historico')
		.once("value")
		.then(snapshot => {
			var registros = Object.values(snapshot.val())
			tituloTabela.innerHTML =
					'Busca pelo período: de ' +
					new Date(inicio).toLocaleDateString() + ' a ' + 
					new Date(fim).toLocaleDateString() +
					' | Realizada em ' +
					new Date(new Date().getTime() + diferencaHora).toLocaleString() +
					' | ' +
					posto
				conteudoBusca[0] = tituloTabela.innerHTML
			registros.map(i => {
				if (inicio <= i.data && fim >= i.data){
					var item = `<tr>
							<td><strong>${i.tp}</strong></td>
                            <td>${i.status}</td>
                            <td>${new Date(i.data).toLocaleDateString()}</td>
                            <td>${new Date(i.data).toLocaleTimeString()}</td>
                            <td>${i.id}</td>
                            <td>${i.gerente}</td>
                            <td>${i.posto}</td>
					  </tr>`
						bodyTabela.innerHTML += item
						resultadoBusca++
						conteudoBusca[conteudoBusca.length + 1] = i
				}
			})
			return resultadoZero(resultadoBusca)
		})
	}
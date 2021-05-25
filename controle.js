click('maisOpc', () => {
	clearInterval(stopFocusTP)
	hideId('inicio')
	showId('opcoes', 'inline')
	showId('controle', 'flex')
	ajustarHora()
		.then(() => controle())
		.catch(e => {
			alert(e)
			reload()
		})
})

click('btnControle', () => {
	showId('controle', 'flex')
	hideIds(['busca', 'cadastro', 'transporte', 'selecionarTP'])
	controle()
})

const controle = () => {
	// ler o banco de dados na pasta 'tps'
	db.ref('tps').on('value', snapshot => {
		// data é um Object. registros cria uma array com os valores(registros) desse Object
		var registros = Object.values(snapshot.val())
		// cria função gerarTabela que lê os valores e retorna para cada valor uma linha na tabela
		// de acordo com as condições
		function gerarTabela(valores) {
			updateTime.innerHTML = 'Atualizado em ' + new Date(new Date().getTime() + diferencaHora).toLocaleString()
			// "zera" os dados na tabela antes de inserir novos
			bodyControle.innerHTML = ''
			// método de array for
			for (var i = 0; i < valores.length; i++) {
				var hoje = new Date().getTime()
				// i é o index da array
				// valores[i] é o item na array correspodente ao index i em cada leitura do "for"
				// dentro do item tem um subitem "status" (valores[i].status)
				// dentro de status tem um subitem "data" (valores[i].status.data)
				var evento = new Date(valores[i].status.data).getTime()
				// x = diferença entre hoje e o dia do registro em milisegundos
				var x = hoje - evento
				// z = número de milisegundos em um dia
				var z = 1000 * 3600 * 24
				// diferença em milisegundos dividido pela quantidade de ms em um dia = número de dias
				// Math.floor arredonda para baixo o resultado
				var dias = Math.floor(x / z)
				if (valores[i].status.status == 'Em uso' && dias > 2) {
					var item = `<tr style="background-color: red; color: white">
                              <td><strong>${valores[i].tp}</strong></td>
                              <td>${valores[i].status.status}</td>
                              <td>${dias}</td>
                              <td>${new Date(valores[i].status.data).toLocaleDateString()}</td>
                              <td>${new Date(valores[i].status.data).toLocaleTimeString()}</td>
                              <td>${valores[i].status.id}</td>
                              <td>${valores[i].status.gerente}</td>
                              <td>${valores[i].status.posto}</td>
                        </tr>`
					bodyControle.innerHTML += item
				} else {
					if (valores[i].status.status == 'Em uso') {
						var item = `<tr  style="background-color: green; color: white">
                              <td><strong>${valores[i].tp}</strong></td>
                <td>${valores[i].status.status}</td>
                <td>${dias}</td>
                <td>${new Date(valores[i].status.data).toLocaleDateString()}</td>
                <td>${new Date(valores[i].status.data).toLocaleTimeString()}</td>
                <td>${valores[i].status.id}</td>
                <td>${valores[i].status.gerente}</td>
                <td>${valores[i].status.posto}</td>
              </tr>`
						bodyControle.innerHTML += item
					} else {
						if (valores[i].status.status == 'Transporte' || valores[i].status.status == 'Bloqueado') {
							var item = `<tr  style="background-color: darkgrey; color: white">
                <td><strong>${valores[i].tp}</strong></td>
                <td>${valores[i].status.status}</td>
                <td>${dias}</td>
                <td>${new Date(valores[i].status.data).toLocaleDateString()}</td>
                <td>${new Date(valores[i].status.data).toLocaleTimeString()}</td>
                <td>${valores[i].status.id}</td>
                <td>${valores[i].status.gerente}</td>
                <td>${valores[i].status.posto}</td>
                          </tr>`
							bodyControle.innerHTML += item
						} else {
							var item = `<tr style="background-color: ghostwhite;">
                  <td><strong>${valores[i].tp}</strong></td>
                  <td>${valores[i].status.status}</td>
                  <td>-</td>
                  <td>${new Date(valores[i].status.data).toLocaleDateString()}</td>
                  <td>${new Date(valores[i].status.data).toLocaleTimeString()}</td>
                  <td>${valores[i].status.id}</td>
                  <td>${valores[i].status.gerente}</td>
                  <td>${valores[i].status.posto}</td>
                          </tr>`
							bodyControle.innerHTML += item
						}
					}
				}
			}
		}
		// chama a função gerarTabela com os valores em registros("tps")
		gerarTabela(registros)
		// depois de 2 segundos, executar a funcao abaixo
		setTimeout(() => {
			// se chamasse a funcao show() o display seria flex e ficaria desconfigurado visualmente
			document.getElementById('tabelaControle').style.display = 'block'
		}, 1000 * 2)
	})
}

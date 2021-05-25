click('btnTransporte', () => verificarGerente('transporte'))

var tpsIncluidos = []

inputTagTPTransp.addEventListener('input', e => {
  var inputValue = inputTagTPTransp.value
  if (inputValue.length == 10) {
    db.ref('tps').once('value').then(snap => {
      var resultado = Object.values(snap.val())
      const encontrarTP = item => item.tag == inputValue
      window.tpEncontrado = resultado.find(encontrarTP)
      if (tpEncontrado == undefined) {
        setTimeout(() => {
					alert('TAG não cadastrada')
				}, 100)
        inputTagTPTransp.value = ""
      } else {
        if (tpEncontrado.status.status == 'Em uso') {
          setTimeout(() => {
            alert('É necessário registrar a devolução do TP ' + tpEncontrado.tp)
          }, 100)
          inputTagTPTransp.value = ""
        } else {
          if (tpEncontrado.status.status == 'Devolvido') {
            var verificarTP = (item) => tpEncontrado.tp == item.tp
            var verifique = tpsIncluidos.find(verificarTP)
            console.log(verifique)
            verifique === undefined ?
            incluirTP() :
            setTimeout(() => {
              alert('TP ' + tpEncontrado.tp + ' já adicionado')
            }, 100);
            inputTagTPTransp.value = ""
          }
        }
      }
    })
  }
})

const incluirTP = () => {
  var tpIncluido = tpEncontrado.tp
  tpsIncluidos.push(tpEncontrado.status)
  console.log(tpsIncluidos)
  var item = `<div class="grid-transporte-item">${tpIncluido}</div>`
  inputTagTPTransp.value = ""
  showId('divTPsIncluidos', 'flex')
  document.getElementById('gridTPsIncluidos').innerHTML += item
  document.querySelector('#countIncluidos').textContent = ' (' + tpsIncluidos.length + ')'
}

const checkOut = () => {
  ajustarHora().then(() => {
    dataTransporte = new Date().getTime() + diferencaHora
    tpsIncluidos.map(tpIncluido => {
      tpIncluido.id = gerente
      tpIncluido.matricula = matricula
      tpIncluido.gerente = '-'
      tpIncluido.status = 'Transporte'
      tpIncluido.posto = localStorage.getItem('posto')
      tpIncluido.data = dataTransporte
    })
    transportar()
  }).catch(e => {
							alert(e)
							reload()
						})
}

const transportar = () => {
  var tpsEmTransporte = []
  var updates = {}
  tpsIncluidos.map(item => {
    updates['/tps/' + item.tp + '/status'] = item
    tpsEmTransporte.push(item.tp)
  })
  var registro = {
    status: 'Transporte',
		id: gerente,
		matricula: matricula,
		tp: tpsEmTransporte.toString(),
		posto: posto,
		data: tpsIncluidos[0].data
	}

  chave = db.ref().child('historico').push().key
  
  updates['/usuarios/' + gerente.replace('.', '_') + '/transporte'] = tpsEmTransporte.toString()
  updates['/historico/' + chave] = registro

  mensagem = 'Transporte registrado pelo empregado ' + gerente + ' em ' + posto + '. TPs: ' + tpsEmTransporte.toString() + '<br>' + new Date(registro.data).toLocaleString()
	email = gerente + '@metro.df.gov.br'
	fetchUrl = url + '?mensagem=' + mensagem + '&email=' + email + '&chave=' + chave
  msgAlert = `<p>Transporte registrado pelo empregado ${gerente} em ${posto}. TPs: ${tpsEmTransporte.toString()}</p><p> ${new Date(registro.data).toLocaleString()} </p><p>Registro ${chave}</p>`
  console.log(updates, mensagem)
}
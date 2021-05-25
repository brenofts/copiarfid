click('falhaLeitor', () => {
  showId('selecionarTP', 'block')
  hideIds(['controle', 'cadastro', 'transporte', 'busca'])
  db.ref('tps').on('value', snap => {
    document.getElementById('tabelaTPs').innerHTML = ''
    var resultado = Object.values(snap.val())
    resultado.map(tp => {
      var cssClass
      switch (tp.status.status) {
        case 'Devolvido':
          cssClass = 'grid-item-devolvido'
          break
        case 'Em uso':
          cssClass = 'grid-item-emuso'          
          break
        case 'Transporte':
        case 'Bloqueado':
          cssClass = 'grid-item-bloqueado'
          break;
      }
      var gridItem = `<div class="${cssClass}" id="${tp.tp}">${tp.tp}</div>`
      document.getElementById('tabelaTPs').innerHTML += gridItem
    })
    resultado.map(tp => document.getElementById(tp.tp).addEventListener('click', () => {
      status = tp.status.status
      matricula = tp.status.matricula
      switch (status) {
        case 'Devolvido':
          retirarComSenha(tp.tp)
          break
        case 'Em uso':
          devolverComSenha(tp.tp, tp.status.id)
          break
        case 'Transporte':
          alert('Transporte')
          break;
        case 'Bloqueado':
          alert('Bloqueado')
          break;
      }
    }))
  })
})

const retirarComSenha = (pepe) => {
  tp = pepe
  hideIds(['controle', 'cadastro', 'transporte', 'busca', 'selecionarTP', 'opcoes'])
  showId('retirar', 'flex')
  hideId('divFormIDRetirar')
  showId('divFormSenhaRetirar', 'flex')
  showId('btnRetirarOutro', 'block')
  hideId('utilizarTagRet')
  numTPRetirar.innerText = tp
}

const devolverComSenha = (pepe, anthony) => {
  tp = pepe
  id = anthony
  hideIds(['controle', 'cadastro', 'transporte', 'busca', 'selecionarTP', 'opcoes'])
  showId('devolver', 'flex')
  hideId('divFormRFIDDevolver')
  showId('divFormSenhaDevolver', 'flex')
  showId('btnDevolverOutro', 'block')
  hideId('utilizarTagDev')
  idTPDevolver.innerText = id
	numTPDevolver.innerText = tp
}

click('btnRetirarOutro', () => {
  hideId('retirar')
  showId('selecionarTP', 'flex')
  showId('opcoes', 'inline')
})

click('btnDevolverOutro', () => {
  hideId('devolver')
  showId('selecionarTP', 'flex')
  showId('opcoes', 'inline')
})


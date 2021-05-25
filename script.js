firebase.auth().signInAnonymously().then(user => console.log(user)).catch(error => alert(error.message))

const reload = () => document.location.reload()

//funções que alteram a exibição (css-display) dos elementos através da id 

const showId = (id, displayType) => (document.getElementById(id).style.display = displayType)
const hideId = id => document.getElementById(id).style.display = 'none'
const hideIds = ids => ids.map(id => document.getElementById(id).style.display = 'none')

//função que manipula o evento 'click' através da id

const click = (id, action) => document.getElementById(id).addEventListener('click', action)

// função que cria as variáveis iguais aos nomes das ids html. inserir a id na array ids.
const ids = [
	'selectPosto',
	'numTPRetirar',
	'numTPDevolver',
	'idTPDevolver',
	'formBuscaMatr',
	'formBuscaData',
	'tituloTabela',
	'bodyTabela',
	'bodyControle',
	'updateTime',
	'inputTagGerente',
	'inputTagTP',
	'inputTagUsuario',
	'inputMatrBuscar',
	'inputDataBuscar',
  'formRFIDTP',
  'formRFIDRetirar',
	'formSenhaRetirar',
  'formRFIDDevolver',
  "formNovoEmpregado",
	'checarGerente',
	'inputMatrRetirar',
	'inputSenhaRetirar',
	'inputMatrDevolver',
	'inputSenhaDevolver',
	'entraRetirar',
	'idTransporte',
	'inputTagTPTransp',
	'inputDataInicial',
	'inputDataFinal',
	'lblDataFinal',
	'nomeDoGerente',
	'inputMatrAtualiza',
	'lerMatr',
	'idEncontrado',
	'inputTagAtualiza'
]

const createVariables = () => {
	ids.map(id => {
		var createVar = 'window.' + id + '= document.getElementById("' + id + '")'
		eval(createVar)
	})
	// for (let i = 0; i < ids.length; i++) {
	// 	const element = id[i]
	// 	var id = element.getAttribute('id')
	// 	var createVar = 'window.' + id + '= document.getElementById("' + id + '")'
	// 	eval(createVar)
	// }
}

createVariables()

// variáveis que serão úteis para os registros
var dataTransporte, tituloImpressao
var retirarMatricula, retirarSenha, devolverMatricula, devolverSenha
var tp, id, matricula, status, gerente, posto, email, pin
var tagTP, tagUsuario, tagGerente
var livre, tpEmUso
var diferencaHora, hoje, dataInicial, dataFinal
var chave, mensagem, msgAlert
var url =	'https://script.google.com/macros/s/AKfycbzUQLSyejfxRXZLwSIk929bwhpFlk7zjApdfGO76ENLhIi4tWijyNmhSGoOmU6PfwminA/exec'
var fetchUrl = url + '?mensagem=' + mensagem + '&email=' + email + '&chave=' + chave
var header = {
	method: 'POST',
	mode: 'no-cors',
}

//anulando o submit
window.addEventListener('submit', e => {
	e.preventDefault()
	e.stopPropagation()
})


// verificando fuso horário e corrigindo diferenças de horário em relação ao servidor do Firebase

const ajustarHora = () => {
	return new Promise((resolve, reject) => {
		if (new Date().getTimezoneOffset() == 180) {
			db.ref('.info/serverTimeOffset').once('value', snap => {
				diferencaHora = snap.val()
			})
			resolve(diferencaHora)
		} else {
			reject('Verifique as configurações de fuso horário deste computador.')
		}
	})
}

const notAllowed = () => {
	alert('Ação não autorizada')
	document.getElementById('inputTagTP').value = ''
	inputTagTP.focus()
}

const focusTP = () => {
	window.stopFocusTP = setInterval(() => {
	if (inputTagTP != document.activeElement) {
			inputTagTP.focus()
			console.log('focusTP')
		}
	}, 100)
}

focusTP()

const focusUsuario = () => {
	window.stopFocusUsuario = setInterval(() => {
	if (inputTagUsuario != document.activeElement) {
			inputTagUsuario.focus()
			console.log('focusUsuario')
		}
	}, 100)
}

const focusGerente = () => {
	window.stopFocusGerente = setInterval(() => {
	if (inputTagGerente != document.activeElement) {
			inputTagGerente.focus()
			console.log('focusGerente')
		}
	}, 100)
}

const focusVerificarGerente = () => {
	window.stopFocusVerificarGerente = setInterval(() => {
	if (verificarTAGGerente != document.activeElement) {
			verificarTAGGerente.focus()
		}
	}, 100)
}

const focusTagTpTransp = () => {
	window.stopFocusTagTpTransp = setInterval(() => {
	if (inputTagTPTransp != document.activeElement) {
			inputTagTPTransp.focus()
		}
	}, 100)
}

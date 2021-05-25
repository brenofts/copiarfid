click('btnCadastro', () => verificarGerente('cadastro'))

click('btnCadastroTp', () => {
	showId('opcoesTP', 'inline')
	hideIds(['opcoesUsuario', 'divNovaSenha'])
})

click('btnCadastroUsuario', () => {
	showId('opcoesUsuario', 'inline')
	hideIds(['opcoesTP', 'divNovaSenha'])
})

click('btnNovaSenha', () => {
	console.log('nova senha')
	hideIds(['divNovoUsuario', 'divAtualizarUsuario'])
	showId('divNovaSenha', 'flex')
})

click('btnNovoUsuario', () => {
	showId('divNovoUsuario', 'flex')
	hideIds(['divNovaSenha', 'divAtualizarUsuario'])
})

click('btnNovoTP', () => {
	console.log('novo tp')
})

click('btnAtualizarTP', () => {
	console.log('atualizar tp')
})

// Atualizar cadastro (TAG e função)
// Atualizar TAG

click('btnAtualizarUsuario', () => {
	console.log('atualizar usuário')
	hideIds(['divNovaSenha', 'divNovoUsuario'])
	showId('divAtualizarUsuario', 'flex')
	inputMatrAtualiza.focus()
	click('lerMatr', () => {
		var leuMatr = document.getElementById('inputMatrAtualiza').value
		if (leuMatr.length > 2) {
			db.ref('usuarios')
				.once('value')
				.then(snap => {
					var leuUsuario = Object.values(snap.val())
					function matr(usu) {
						return usu.matricula == leuMatr
					}
					var usuarioEncontrado = leuUsuario.find(matr)
					if (usuarioEncontrado != undefined) {
						idEncontrado.innerText = usuarioEncontrado.id
						showId('botoesTagGer', 'inline')
						hideId('lerMatr')
						click('trocaGerente', () => {
							if (usuarioEncontrado.gerente == true) {
								if (window.confirm('Deseja retirar a credencial de gerente do usuário ' + usuarioEncontrado.id + '?')) {
									ajustarHora()
										.then(() => {
											chave = db.ref().child('/usuarios').push().key
											var momentoRegistro = new Date().getTime() + diferencaHora
											var updates = {}
											updates['/usuarios/' + usuarioEncontrado.id.replace('.', '_') + '/gerente'] = false
											updates[
												'/usuarios/' +
													usuarioEncontrado.id.replace('.', '_') +
													'/atualizacoes/gerente/' +
													chave
											] = {
												atualizacao: 'Retirada da credencial de gerente',
												data: momentoRegistro,
												gerente: gerente,
												posto: posto,
											}
											mensagem = 'Registro: Retirada da credencial de Gerente do empregado ' + usuarioEncontrado.id + ', no posto '+ posto + ' em ' + new Date(momentoRegistro).toLocaleString()
											email = usuarioEncontrado.id + '@metro.df.gov.br'
											fetchUrl = url + '?mensagem=' + mensagem + '&email=' + email + '&chave=' + chave
											return db
												.ref()
												.update(updates)
												.then(
													fetch(encodeURI(fetchUrl), header)
													.then(response => {
													console.log(response)
												})
													.catch(e => alert('Erro ao enviar e-mail: ' + e))
													)
													.then(() => {alert("Cadastro de "+ usuarioEncontrado.id + " atualizado com Sucesso.")
												reload()})
													.catch(e => alert(e.message))
										})
										.catch(e => alert(e))
								} else {
									console.log('negativo')
								}
							} else {
								if(usuarioEncontrado.gerente == false){
									if(window.confirm("Deseja conceder credencial de gerente ao empregado " + usuarioEncontrado.id + "?")) {
										ajustarHora()
										.then(() => {
											chave = db.ref().child('/usuarios').push().key
											var momentoRegistro = new Date().getTime() + diferencaHora
											var updates = {}
											updates['/usuarios/' + usuarioEncontrado.id.replace('.', '_') + '/gerente'] = true
											updates[
												'/usuarios/' +
													usuarioEncontrado.id.replace('.', '_') +
													'/atualizacoes/gerente/' +
													chave
											] = {
												atualizacao: 'Conceissão da credencial de gerente',
												data: momentoRegistro,
												gerente: gerente,
												posto: posto,
											}
											mensagem = 'Registro: Concedida credencial de Gerente ao empregado ' + usuarioEncontrado.id + ', no posto '+ posto + ' em ' + new Date(momentoRegistro).toLocaleString()
											email = usuarioEncontrado.id + '@metro.df.gov.br'
											fetchUrl = url + '?mensagem=' + mensagem + '&email=' + email + '&chave=' + chave
											return db
												.ref()
												.update(updates)
												.then(
													fetch(encodeURI(fetchUrl), header)
													.then(response => {
													console.log(response)
												})
													.catch(e => alert('Erro ao enviar e-mail: ' + e))
													)
													.then(() => {alert("Cadastro de "+ usuarioEncontrado.id + " atualizado com Sucesso.")
												reload()})
													.catch(e => alert(e.message))
										})
										.catch(e => alert(e))
									} else {alert('não')}
								}
							}
						})
						click('trocaTag', () => {
							hideId('botoesTagGer')
							showId('inputTagAtualiza', 'flex')
							inputTagAtualiza.addEventListener('input', () => {
								if (inputTagAtualiza.value.length == 10) {
									var novaTag = inputTagAtualiza.value
									db.ref('tps')
										.once('value')
										.then(snap => {
											var listaTp = Object.values(snap.val())
											function tagTp(t) {
												return t.tag == novaTag
											}
											var tagEncontradaTp = listaTp.find(tagTp)
											function tagUsu(item) {
												return item.tag == novaTag
											}
											var tagEncontradaUsu = leuUsuario.find(tagUsu)
											console.log(tagEncontradaTp, tagEncontradaUsu)
											if (tagEncontradaTp == undefined && tagEncontradaUsu == undefined) {
												console.log('TAG disponível')
												db.ref('/usuarios/' + usuarioEncontrado.id.replace('.', '_') + '/tag')
													.set(novaTag)
													.then(() => {
														alert('A Tag do Usuário: ' + usuarioEncontrado.id + ' foi atualizada com sucesso.')
														reload()
													})
													.catch(e => alert(e.message))
											} else {
												if (tagEncontradaTp != undefined) {
													inputTagAtualiza.value = ''
													setTimeout(() => {
														alert('TAG já utilizada para o TP ' + tagEncontradaTp.tp + '. Apresente uma nova TAG')
													}, 100)
													escondeBotoes()
												} else {
													if (tagEncontradaUsu != undefined) {
														inputTagAtualiza.value = ''
														setTimeout(() => {
															alert(
																'TAG já utilizada para o usuário ' + tagEncontradaUsu.id + '. Apresente uma nova TAG'
															)
														}, 100)
														escondeBotoes()
													}
												}
											}

										})
										.catch(e => alert(e.message))
								}
							})
						})
					} else {
						alert('Matrícula não encontrada')
					}
				})
		} else {
			alert('Digite Corretamente a Matrícula!')
		}
	})
})

function escondeBotoes() {
	setTimeout(() => {
		hideId('botoesTagGer')
	}, 300)
}

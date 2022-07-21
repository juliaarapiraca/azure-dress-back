const express = require('express');
const funcionarios = require('./controladores/login e cadastro');
const horarios = require('./controladores/horarios');
const autenticacao = require('./intermediarios/autenticacao');

const rotas = express();

rotas.post('/funcionario', funcionarios.cadastrarFuncionario);
rotas.post('/login', funcionarios.login);

rotas.use(autenticacao.verificarToken);

rotas.post('/marcarhorario', horarios.marcarHorario);
rotas.put('/horario/:id', horarios.atualizarHorario);
rotas.delete('/horario/:id', horarios.excluirHorario);
rotas.get('/horarios', horarios.listarHorarios);

module.exports = rotas;
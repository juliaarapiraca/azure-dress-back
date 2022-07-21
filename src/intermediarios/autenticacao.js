const knex = require('../bancodedados/conexao');
const jwt = require('jsonwebtoken');

const verificarToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json('Não autorizado');
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();

        const { id } = jwt.verify(token, process.env.SENHA_JWT);

        const funcionarioExiste = await knex('funcionarios').where({ id }).first();

        if (!funcionarioExiste) {
            return res.status(404).json('Funcionário não encontrado');
        }

        const { senha, ...funcionario } = funcionarioExiste;

        req.funcionario = funcionario;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { verificarToken };
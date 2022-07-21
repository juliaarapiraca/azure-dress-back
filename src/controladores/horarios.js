const knex = require('../bancodedados/conexao');
const schemaHorarios = require('../validacoes/schemaHorarios');
const jwt = require('jsonwebtoken');
const jwt_secret = require('../jwt_secret');

const marcarHorario = async (req, res) => {
    const { nome, email, whatsapp, data } = req.body;

    try {
        await schemaHorarios.schemaMarcarHorario.validate(req.body);

        const novoHorario = await knex('horarios').insert({ nome, email, whatsapp, data });

        if (!novoHorario) {
            return res.status(400).json('Não foi possível marcar o horário.');
        }

        return res.status(200).json('Horário marcado com sucesso!');

    } catch (error) {
        return res.status(400).json(error.message);
    }

};

const listarHorarios = async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization.replace('Bearer', '').trim();
    const { id } = jwt.verify(token, jwt_secret);

    try {
        const horarios = await knex('horarios').where({ funcionario_id: id }).offset(0).limit(10);

        if (!horarios) {
            return res.status(404).json('Não há horários cadastrados');
        };
        return res.status(200).json(horarios);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const atualizarHorario = async (req, res) => {
    const { nome, email, whatsapp, data } = req.body;
    const { id } = req.params;
    const { funcionario } = req;
    const { authorization } = req.headers;
    const token = authorization.replace('Bearer', '').trim();
    const { funcionario_id } = jwt.verify(token, jwt_secret);

    if (!funcionario) {
        return res.status(401).json('Funcionário não autenticado!');
    }

    try {

        const buscarHorario = await knex('horarios').where({ id }).first();

        if (!buscarHorario) {
            return res.status(400).json('Não foi possível localizar o horário a ser atualizado');
        }

        await schemaHorarios.schemaAtualizarHorario.validate(req.body);

        const horarioAtualizado = await knex('horarios').update({ nome, email, whatsapp, data, funcionario_id }).where({ id });

        if (!horarioAtualizado) {
            return res.status(400).json('Não foi possível atualizar o horário!');
        }

        return res.status(200).json('Horário atualizado com sucesso!');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const excluirHorario = async (req, res) => {
    const { id } = req.params;

    try {
        const horario = await knex('horarios').where({ id }).first();

        if (!horario) {
            return res.status(404).json('Horário não encontrado.');
        }

        const horarioExcluido = await knex('horarios').where({ id }).del();

        if (!horarioExcluido) {
            return res.status(404).json('Não foi possível excluir horário.');
        };

        return res.status(202).json('Horário excluído com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    };
};

module.exports = {
    marcarHorario,
    listarHorarios,
    atualizarHorario,
    excluirHorario,
}
const knex = require('../bancodedados/conexao');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const jwt_secret = require('../jwt_secret');
const schemaFuncionarios = require('../validacoes/schemaFuncionario');

const pwd = securePassword();

const cadastrarFuncionario = async (req, res) => {
    const { nome, senha, email } = req.body;

    try {
        await schemaFuncionarios.schemaCadastroFuncionario.validate(req.body);

        const buscarEmail = await knex('funcionarios').where('email', email).first();

        if (buscarEmail) {
            return res.status(404).json('O email já está em uso.');
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');

        const novoFuncionario = await knex('funcionarios').insert({ nome, senha: hash, email });

        if (!novoFuncionario) {
            return res.status(400).json('Não foi possível cadastrar o novo funcionário.');
        }

        return res.status(200).json('Funcionário cadastrado com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        await schemaFuncionarios.schemaLoginFuncionario.validate(req.body);

        const funcionario = await knex('funcionarios').where({ email }).first();

        if (!funcionario) {
            return res.status(404).json('O funcionário não foi encontrado');
        }

        const validarSenha = await pwd.verify(Buffer.from(senha), Buffer.from(funcionario.senha, 'hex'));

        switch (validarSenha) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json('Email e/ou senha incorretos');
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString('hex');
                    await knex('funcionarios').update({ senha: hash, email: email }).where('id', id);
                } catch {
                }
                break;
        }

        const token = jwt.sign({
            id: funcionario.id,
            nome: funcionario.nome
        }, jwt_secret, { expiresIn: '5h' }
        );

        return res.status(200).json({
            funcionario: {
                nome: funcionario.nome,
                email: funcionario.email,
            },
            token
        });

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    cadastrarFuncionario,
    login
};
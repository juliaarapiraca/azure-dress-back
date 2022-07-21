const yup = require('./yup');

const schemaCadastroFuncionario = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().required().email(),
    senha: yup.string().required().trim().min(6)
});

const schemaLoginFuncionario = yup.object().shape({
    email: yup.string().required().email(),
    senha: yup.string().required().trim().min(6)
})

module.exports = {
    schemaCadastroFuncionario,
    schemaLoginFuncionario
}
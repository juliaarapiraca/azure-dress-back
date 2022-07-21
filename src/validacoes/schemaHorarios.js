const yup = require('yup');

const schemaMarcarHorario = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().required(),
    whatsapp: yup.number().required(),
    data: yup.date().required()
});

const schemaAtualizarHorario = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().required(),
    whatsapp: yup.number().required(),
    data: yup.date().required()
});

module.exports = {
    schemaMarcarHorario,
    schemaAtualizarHorario
};
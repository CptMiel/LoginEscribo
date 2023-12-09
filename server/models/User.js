const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    nome:{type: String,require: true},
    email:{type: String,require: true},
    senha:{type: String,require: true},
    telefone: [{
        ddd: { type: Number},
        numero: { type: Number}
    }],
    data_criacao: { type: Date, default: Date.now },
    data_atualizacao: { type: Date, default: Date.now },
    ultimo_login: { type: Date, default: Date.now },
    token:{ type: String }
});
module.exports = mongoose.model('User', UserSchema);
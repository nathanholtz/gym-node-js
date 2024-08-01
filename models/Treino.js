// chama a classe datatypes do modulo sequelize e o modulo de conexao conn

const {DataTypes} = require('sequelize')
const db = require('../db/conn')
const User = require('./User')

// cria uma tabela conectada ao banco de dados no mysql chamada Treino 

const Treino = db.define('Treino',{

    //criando colunas com dados string e inteiros que nao podem ser null

    name:{
        type: DataTypes.STRING,
        required:true,
    },
    sets:{
        type: DataTypes.INTEGER,
        required:true,
    },
    reps:{
        type: DataTypes.INTEGER,
        required:true,
    },
    rests:{
        type: DataTypes.INTEGER,
        required:true,
    },
    
})

Treino.belongsTo(User)
User.hasMany(Treino)

module.exports = Treino
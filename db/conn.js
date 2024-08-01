//chama a classe Sequelize do modulo

const {Sequelize} = require('sequelize')

//cria um novo objeto passando nome da tabela, usuario e senha

const sequelize = new Sequelize('nodegym','root','senha do banco',{

    //MUDAR ESSA SENHAAAA

   // configuraçao do objeto

    host:'localhost',
    dialect:'mysql'
})

// tentando autenticar a conexao com o banco de dados

try {

    sequelize.authenticate()

    console.log('conectado')

} catch (error) {

    console.log(error)

}

module.exports = sequelize
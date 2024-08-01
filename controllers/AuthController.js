const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {

    static login(req, res) {
        res.render('auth/login')
    }

    static async postLogin(req, res) {
        const { email, password } = req.body

        //checar se usuario existe 

        const user = await User.findOne({ where: { email: email } })

        if (!user) {
            req.flash('message', 'Usuário não encontrado!')
            res.render('auth/login')

            return
        }

        //checar se senha corresponde 

        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch){
            req.flash('message','Senha incorreta!')
            res.render('auth/login')

            return
        }

        //inicialiando sessao

        req.session.userid = user.id

        req.flash('message', 'Bem vindo de volta!')

        req.session.save(()=>{

            res.redirect('/treino')

        })
    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async saveRegister(req, res) {
        const { name, email, password, confirmpassword } = req.body

        //validaçao de senhas iguais
        if (password != confirmpassword) {
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')
            return
        }

        //checar se usuario existe
        const checkifuserexist = await User.findOne({ where: { email: email } })

        if (checkifuserexist) {
            req.flash('message', 'Este email já está em uso!')
            res.render('auth/register')
            return
        }

        //criptografia
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword,
        }

        //armazenando os dados
        try {
            const createdUser = await User.create(user)

            //inicializando session
            req.session.userid = createdUser.id

            req.flash('message', 'Cadastro realizado com sucesso!')

            req.session.save(() => {

                res.redirect('/treino')

            })

        } catch (error) {
            console.log(err)
        }


    }

    static logout(req, res) {

        req.session.destroy()
        res.redirect('/login')
    }


}
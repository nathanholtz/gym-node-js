// chamando modulo Treino da pasta models
const Treino = require('../models/Treino')
const User = require('../models/User')
const { Op } = require('sequelize')

// criando e exportando funçoes 
module.exports = class TreinoController {

    // funçao que renderiza o arquivo create na pasta treino
    static createTreino(req, res) {
        res.render('treino/create')
    }

    // funçao que recebe dados do body json, salva na tabela Treino e redireciona para pagina inicial
    static async createTreinoSave(req, res) {
        const treino = {
            name: req.body.name,
            sets: req.body.sets,
            reps: req.body.reps,
            rests: req.body.rests,
            UserId: req.session.userid
        }

        await Treino.create(treino)
        res.redirect('/treino')
    }

    // funçao que pega os dados na tabela de acordo com o id da rota correspondente e abre a pagina de ediçao
    static async updateTreino(req, res) {
        const id = req.params.id

        // recebe id da url
        const treino = await Treino.findOne({ where: { id: id }, raw: true })

        // encontre um treino quando o id da tabela for igual ao da rota
        res.render('treino/edit', { treino })
    }

    // funçao que recebe os dados da view edit e atualiza no banco de dados de acordo com o id no json
    static async updateTreinoSave(req, res) {
        const id = req.body.id

        const data = {
            name: req.body.name,
            sets: req.body.sets,
            reps: req.body.reps,
            rests: req.body.rests,
        }

        // guardando dados em um objeto
        await Treino.update(data, { where: { id: id } })

        req.flash('message', 'Atualizado com sucesso!')

        // atualizando treino passando objeto, quando o id da tabela for igual ao do body
        req.session.save(() => {
            res.redirect('/treino')
        })
    }

    // funçao que deleta o treino da tabela de acordo com o id correspondente da lista na view all
    static async deleteTreino(req, res) {
        const id = req.body.id

        await Treino.destroy({ where: { id: id } })
        res.redirect('/treino')
    }

    // funçao que resgata todos os dados da tabela e renderiza o arquivo all na pasta treino passando os dados
    static async showTreino(req, res) {
        const userId = req.session.userid

        let search = '' 
        if (req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'
        if (req.query.order === 'old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: {
                model: Treino,
                where: {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                }, 
                required: false
            },
            plain: true,
        })  

        if (!user) {
            res.redirect('/login')
            return
        }

        const treino = user.Treinos.map((result) => result.dataValues)

        treino.sort((a, b) => {
            if (order === 'ASC') {
                return new Date(a.createdAt) - new Date(b.createdAt)
            } else {
                return new Date(b.createdAt) - new Date(a.createdAt)
            }
        })
  
        let emptyTreino = false 
        if (treino.length === 0) {
            emptyTreino = true
        } 

        res.render('treino/all', { treino, emptyTreino, search })
    }

    // função que exibe detalhes de um treino específico
    static async treinoDetails(req, res) {
        const id = req.params.id

        const treino = await Treino.findOne({ where: { id: id }, raw: true })

        res.render('treino/details', { treino })
    } 
}

//importa os modulos necessarios e cria instancia

const express = require('express')
const handle = require('express-handlebars')
const app = express()
const conn = require('./db/conn')

const session = require('express-session')
const fileStore = require('session-file-store')(session)
const flash = require('express-flash')
const { tmpdir } = require('os')

//models

const Treino = require('./models/Treino')
const User = require('./models/User')

//routes

const TreinoRoutes = require('./routes/TreinoRoutes')

const AuthRoutes = require('./routes/AuthRoutes')

//define a engine e vizualizaçao como handlebars

app.engine('handlebars', handle.engine())
app.set('view engine', 'handlebars')

//middleware para analisar dados e transformar em .json

app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

//define onde o express salva as sessoes

app.use(session({

    name: 'session',
    secret: 'palavra_chave',
    resave: false,  //mantem os dados
    saveUninitialized: false,
    store: new fileStore({
        logFn: function () { },
        path: require('path').join(require('os').tmpdir(), 'sessions')
    }),  // define o caminho para onde ira salvar
    cookie: {
        secure: false,
        maxAge: 360000,
        expires: new Date(Date.now() + 360000),
        httpOnly: true
    }
}))

//flash middleware

app.use(flash())

//segue com dados do usuario caso exista

app.use((req, res, next) => {

    if (req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

//estatico para css

app.use(express.static('public'))

//define que todas as rotas /treino serao tratadas pelo TreinoRoutes

app.use('/treino', TreinoRoutes)
app.use('/', AuthRoutes)

//sincroniza conexao com o banco de dados e cria as tabelas caso consiga servidor ouve porta 3000

conn
    .sync()
    //.sync({force:true})
    .then(() => {

        app.listen(3000)

    }).catch((error) => console.log(error))


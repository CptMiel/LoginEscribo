require("dotenv").config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const connectDB = require('./server/config/db');


const app = express();
const port = 5000 || process.env.PORT;
//Conectar na DB
connectDB();

app.use(express.urlencoded({ extended:true }));
app.use(express.json());
app.use(methodOverride('_method'));
//Arquivos Static
app.use(express.static('public'));
//Template Enggine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//Rotas
app.use('/', require('./server/routes/user'));

//Pagina 404
app.get('*', (req,res) => {
    res.status(404).json({ mensagem: 'Pagina não Encontrada'})
});
app.listen(port, ()=> {
    console.log(`Servidor ouvindo na porta ${port}`)
});

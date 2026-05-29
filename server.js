const express = require("express");
const session = require("express-session");
const app = express();
const path = require('path')

app.use(express.json());

app.use(express.static("public"));
app.use("/v2/assets", express.static(path.join(__dirname, "frontend/dist/assets")));

require('./database/init')

app.use(session({
    secret: "flooty-pet-secret",
    resave: false,
    saveUninitialized: false
}))

app.use(require('./routes/login'))
app.use(require('./routes/me'))
app.use(require('./routes/pages'))
app.use(require('./routes/clientes'))
app.use(require('./routes/racas'))
app.use(require('./routes/config'))
app.use(require('./routes/agendamentos'))
app.use(require('./routes/atualizacoes'))
app.use(require('./routes/agenda'))

app.listen(3000, () => {
    console.log("Estou rodando.");
});

const express = require("express");
const app = express();

app.use(express.json());

app.use(express.static("public"));

require('./database/init')

app.use(require('./routes/pages'))
app.use(require('./routes/clientes'))
app.use(require('./routes/agendamentos'))
app.use(require('./routes/atualizacoes'))
app.use(require('./routes/agenda'))

app.listen(3000, () => {
    console.log("Estou rodando.");
});

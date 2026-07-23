const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");

app.use(express.json());

app.use((req, res, next) => {
    console.log("REQ:", req.method, req.url);
    next();
});

require("./database/init");

app.use(
    session({
        secret: "flooty-pet-secret",
        resave: false,
        saveUninitialized: false,
    }),
);

app.use(require("./routes/login"));
app.use(require("./routes/me"));
app.use(require("./routes/clientes"));
app.use(require("./routes/racas"));
app.use(require("./routes/config"));
app.use(require("./routes/agendamentos"));
app.use(require("./routes/atualizacoes"));
app.use(require("./routes/notificações"));
app.use(require("./routes/agenda"));

app.use(express.static("public"));
app.use(
    "/assets",
    express.static(path.join(__dirname, "frontend/dist/assets")),
);
app.use(require("./routes/pages"));

app.listen(3000, () => {
    console.log("Estou rodando.");
});

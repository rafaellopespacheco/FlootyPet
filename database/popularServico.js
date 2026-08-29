const db = require('./db')

db.serialize(() => {
   db.run(`CREATE TABLE IF NOT EXISTS servicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,

    preco_padrao REAL NOT NULL,
    duracao INTEGER NOT NULL,

    ativo INTEGER DEFAULT 1,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`)

db.run(`INSERT INTO servicos (nome, categoria, preco_padrao, duracao, ativo) values (?, ?, ?, ?, ?)`, ['Banho', 'banho', 65.00, 75, 1]);
})


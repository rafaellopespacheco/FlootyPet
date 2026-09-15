const db = require('./db');

// db.run(`DROP TABLE servicos`)
// db.all(`SELECT * FROM agendamentos`, [], (err, rows) => console.log(rows))
db.all(`SELECT * FROM servicos`, [], (err, rows) => console.log(rows))
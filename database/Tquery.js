const db = require('./db');

db.all(`SELECT * FROM agendamentos`, [], (err, rows) => console.log(rows))
const db = require('./db')

db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        email TEXT,
        password_hash TEXT,
        role INTEGER
)`)

db.run(`CREATE TABLE IF NOT EXISTS changelogs(
        id INTEGER PRIMARY KEY,
        versao TEXT,
        titulo TEXT,
        resumo TEXT,
        descricao TEXT,
        data DATE
)`);

db.run(`CREATE TABLE IF NOT EXISTS config(
        id INTEGER PRIMARY KEY,
        nome_empresa TEXT        
)`);

db.run(`CREATE TABLE IF NOT EXISTS clientes(
    id INTEGER PRIMARY KEY,
    nome TEXT,
    cpf TEXT,
    datanasc DATE,
    numero TEXT,
    obs TEXT,
    cep TEXT,
    logradouro TEXT,
    bairro TEXT,
    cidade TEXT,
    uf TEXT,
    notificacao INTEGER
)`);

db.run(`CREATE TABLE IF NOT EXISTS pets(
    id INTEGER PRIMARY KEY,
    cliente_id INTEGER,
    nome TEXT,
    datanasc DATE,
    status TEXT,
    especie TEXT,
    raca TEXT,
    porte TEXT,
    tamanhopelo TEXT,
    peso REAL,
    sexo TEXT,
    castrado INTEGER,
    obs TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS agendamentos(
    id INTEGER PRIMARY KEY,
    cliente_id INTEGER,
    pet_id INTEGER,
    data DATE,
    servicos TEXT,
    valor REAL,
    pago REAL,
    status TEXT,
    taxi REAL
)`);

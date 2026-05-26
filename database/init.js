const db = require('./db')

db.serialize(() => {
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

    db.run(`CREATE TABLE IF NOT EXISTS racas(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        especie_id INTEGER NOT NULL,
        tamanho TEXT,
        tamanhopelo TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS pets(
        id INTEGER PRIMARY KEY,
        cliente_id INTEGER,
        nome TEXT,
        datanasc DATE,
        status TEXT,
        especie TEXT,
        raca_id INTEGER,
        porte TEXT,
        tamanhopelo TEXT,
        peso REAL,
        sexo TEXT,
        castrado INTEGER,
        obs TEXT,
        FOREIGN KEY(raca_id) REFERENCES racas(id)
    )`);

    // Tentar adicionar raca_id à tabela pets caso ela já existisse sem a coluna
    db.run(`ALTER TABLE pets ADD COLUMN raca_id INTEGER`, (err) => {
        // Ignora erro se a coluna já existir
    });

    // Popular a tabela de raças se estiver vazia
    db.get("SELECT COUNT(*) AS count FROM racas", [], (err, row) => {
        if (!err && row && row.count === 0) {
            const stmt = db.prepare("INSERT INTO racas (nome, especie_id, tamanho, tamanhopelo) VALUES (?, ?, ?, ?)");
            stmt.run("Poodle", 1, "pequeno", "médio");
            stmt.run("Labrador", 1, "grande", "curto");
            stmt.run("Golden Retriever", 1, "grande", "longo");
            stmt.run("Shih Tzu", 1, "pequeno", "longo");
            stmt.run("SRD (Cachorro)", 1, "", "");
            stmt.run("Persa", 2, "médio", "longo");
            stmt.run("Siamês", 2, "médio", "curto");
            stmt.run("Angorá", 2, "médio", "longo");
            stmt.run("SRD (Gato)", 2, "", "");
            stmt.finalize();
        }
    });

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
});


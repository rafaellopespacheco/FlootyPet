const db = require('./db')

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
            name TEXT,
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
            data DATETIME 
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
        telefone TEXT,
        obs TEXT,
        cep TEXT,
        logradouro TEXT,
        numero TEXT,
        complemento TEXT,
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

    db.run(`CREATE TABLE IF NOT EXISTS config_checklist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        checklist_tipo TEXT NOT NULL DEFAULT 'agendado',
        categoria TEXT NOT NULL,
        valor TEXT NOT NULL
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
        perfume TEXT,
        enfeites TEXT,
        shampoo TEXT,
        cuidados_especiais TEXT,
        cor TEXT,
        FOREIGN KEY(raca_id) REFERENCES racas(id)
    )`);

    // Tentar adicionar colunas à tabela pets caso ela já existisse sem elas
    db.run(`ALTER TABLE pets ADD COLUMN raca_id INTEGER`, (err) => {});
    db.run(`ALTER TABLE pets ADD COLUMN perfume TEXT`, (err) => {});
    db.run(`ALTER TABLE pets ADD COLUMN enfeites TEXT`, (err) => {});
    db.run(`ALTER TABLE pets ADD COLUMN shampoo TEXT`, (err) => {});
    db.run(`ALTER TABLE pets ADD COLUMN cuidados_especiais TEXT`, (err) => {});
    db.run(`ALTER TABLE pets ADD COLUMN cor TEXT`, (err) => {});

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

    // Popular a tabela de checklist se estiver vazia
    db.get("SELECT COUNT(*) AS count FROM config_checklist", [], (err, row) => {
        if (!err && row && row.count === 0) {
            const stmt = db.prepare("INSERT INTO config_checklist (checklist_tipo, categoria, valor) VALUES (?, ?, ?)");
            // Perfume
            stmt.run("agendado", "perfume", "Sim");
            stmt.run("agendado", "perfume", "Não");
            stmt.run("agendado", "perfume", "Alergia a Perfume");
            // Enfeites
            stmt.run("agendado", "enfeites", "Laço");
            stmt.run("agendado", "enfeites", "Brilho");
            stmt.run("agendado", "enfeites", "Bandana");
            stmt.run("agendado", "enfeites", "Gravata");
            stmt.run("agendado", "enfeites", "Sem Enfeites");
            // Shampoo
            stmt.run("agendado", "shampoo", "Normal");
            stmt.run("agendado", "shampoo", "Neutro");
            stmt.run("agendado", "shampoo", "Medicamento - Cliente traz e leva");
            stmt.run("agendado", "shampoo", "Extra Soft");
            stmt.run("agendado", "shampoo", "Tonalizador");
            // Cores
            stmt.run("agendado", "cores", "Preto");
            stmt.run("agendado", "cores", "Branco");
            stmt.run("agendado", "cores", "Caramelo");
            stmt.run("agendado", "cores", "Cinza");
            stmt.run("agendado", "cores", "Marrom");
            stmt.run("agendado", "cores", "Mesclado");
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


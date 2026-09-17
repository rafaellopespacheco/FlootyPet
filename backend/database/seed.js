const bcrypt = require("bcrypt");
const db = require("./db");

const DEMO_PASSWORD = "Demo@1234";

const run = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve(this);
        });
    });

const seed = async () => {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    await run("PRAGMA foreign_keys = ON");

    // Mantem o seed executavel mesmo em um banco novo.
    await run(`CREATE TABLE IF NOT EXISTS users (
        name TEXT,
        id INTEGER PRIMARY KEY,
        email TEXT,
        password_hash TEXT,
        role INTEGER
    )`);

    await run(`CREATE TABLE IF NOT EXISTS config (
        id INTEGER PRIMARY KEY,
        nome_empresa TEXT,
        cnpj TEXT,
        cep TEXT,
        logradouro TEXT,
        numero TEXT,
        complemento TEXT,
        bairro TEXT,
        cidade TEXT,
        uf TEXT
    )`);

    await run(`ALTER TABLE config ADD COLUMN cnpj TEXT`).catch(() => {});
    await run(`ALTER TABLE config ADD COLUMN cep TEXT`).catch(() => {});
    await run(`ALTER TABLE config ADD COLUMN logradouro TEXT`).catch(() => {});
    await run(`ALTER TABLE config ADD COLUMN numero TEXT`).catch(() => {});
    await run(`ALTER TABLE config ADD COLUMN complemento TEXT`).catch(() => {});
    await run(`ALTER TABLE config ADD COLUMN bairro TEXT`).catch(() => {});
    await run(`ALTER TABLE config ADD COLUMN cidade TEXT`).catch(() => {});
    await run(`ALTER TABLE config ADD COLUMN uf TEXT`).catch(() => {});

    await run(`CREATE TABLE IF NOT EXISTS clientes (
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

    await run(`CREATE TABLE IF NOT EXISTS racas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        especie_id INTEGER NOT NULL,
        tamanho TEXT,
        tamanhopelo TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await run(`CREATE TABLE IF NOT EXISTS config_checklist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        checklist_tipo TEXT NOT NULL DEFAULT 'agendado',
        categoria TEXT NOT NULL,
        valor TEXT NOT NULL
    )`);

    await run(`CREATE TABLE IF NOT EXISTS pets (
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
        FOREIGN KEY (raca_id) REFERENCES racas(id)
    )`);

    await run(`CREATE TABLE IF NOT EXISTS servicos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        categoria TEXT NOT NULL,
        preco_padrao REAL NOT NULL,
        duracao INTEGER NOT NULL,
        ativo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await run(`CREATE TABLE IF NOT EXISTS servico_racas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        servico_id INTEGER NOT NULL,
        raca_id INTEGER NOT NULL,
        preco REAL NOT NULL,
        duracao INTEGER NOT NULL,
        UNIQUE (servico_id, raca_id),
        FOREIGN KEY (servico_id) REFERENCES servicos(id) ON DELETE CASCADE,
        FOREIGN KEY (raca_id) REFERENCES racas(id) ON DELETE CASCADE
    )`);
    await run(
        `ALTER TABLE servico_racas ADD COLUMN grupo TEXT NOT NULL DEFAULT 'Regra por raça'`,
    ).catch(() => {});

    await run(
        `ALTER TABLE agendamentos ADD COLUMN desconto REAL DEFAULT 0`,
    ).catch(() => {});
    await run(
        `ALTER TABLE agendamentos ADD COLUMN taxi_dog INTEGER DEFAULT 0`,
    ).catch(() => {});
    await run(
        `ALTER TABLE agendamentos ADD COLUMN valor_taxi REAL DEFAULT 0`,
    ).catch(() => {});
    await run(
        `ALTER TABLE agendamentos ADD COLUMN valor_total REAL DEFAULT 0`,
    ).catch(() => {});

    await run(`CREATE TABLE IF NOT EXISTS notificacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo VARCHAR(150) NOT NULL,
        descricao TEXT NOT NULL,
        tipo VARCHAR(50) DEFAULT 'Aviso',
        author VARCHAR(100) DEFAULT 'Equipe Flooty Pet',
        lida TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT (datetime('now', '-3 hours'))
    )`);

    await run("BEGIN TRANSACTION");

    try {
        await run(
            `INSERT OR IGNORE INTO users (id, name, email, password_hash, role)
             VALUES (?, ?, ?, ?, ?)`,
            [9001, "Marina Demo", "demo@flootypet.local", passwordHash, 1],
        );

        await run(
            `INSERT OR IGNORE INTO config (id, nome_empresa) VALUES (?, ?)`,
            [1, "Flooty Pet - Ambiente de Demonstracao"],
        );

        const racas = [
            [101, "Poodle", 1, "pequeno", "medio"],
            [102, "Labrador", 1, "grande", "curto"],
            [103, "Golden Retriever", 1, "grande", "longo"],
            [104, "Shih Tzu", 1, "pequeno", "longo"],
            [105, "Bulldogue Frances", 1, "medio", "curto"],
            [106, "Border Collie", 1, "medio", "longo"],
            [107, "Dachshund", 1, "pequeno", "curto"],
            [108, "SRD (Cachorro)", 1, "variado", "variado"],
            [109, "Persa", 2, "medio", "longo"],
            [110, "Siames", 2, "medio", "curto"],
            [111, "Angora", 2, "medio", "longo"],
            [112, "Maine Coon", 2, "grande", "longo"],
            [113, "British Shorthair", 2, "medio", "curto"],
            [114, "SRD (Gato)", 2, "variado", "variado"],
        ];
        for (const raca of racas) {
            await run(
                `INSERT OR IGNORE INTO racas (id, nome, especie_id, tamanho, tamanhopelo)
                 VALUES (?, ?, ?, ?, ?)`,
                raca,
            );
        }

        const checklist = [
            ["perfume", "Sim"],
            ["perfume", "Nao"],
            ["perfume", "Alergia a Perfume"],
            ["enfeites", "Laco"],
            ["enfeites", "Brilho"],
            ["enfeites", "Bandana"],
            ["enfeites", "Gravata"],
            ["enfeites", "Sem Enfeites"],
            ["shampoo", "Normal"],
            ["shampoo", "Neutro"],
            ["shampoo", "Medicamento - Cliente traz e leva"],
            ["shampoo", "Extra Soft"],
            ["shampoo", "Tonalizador"],
            ["cores", "Preto"],
            ["cores", "Branco"],
            ["cores", "Caramelo"],
            ["cores", "Cinza"],
            ["cores", "Marrom"],
            ["cores", "Dourado"],
            ["cores", "Mesclado"],
            ["cores", "Tigrado"],
            ["cores", "Tricolor"],
        ];
        for (const [categoria, valor] of checklist) {
            await run(
                `INSERT INTO config_checklist (checklist_tipo, categoria, valor)
                 SELECT 'agendado', ?, ?
                 WHERE NOT EXISTS (
                     SELECT 1 FROM config_checklist
                     WHERE checklist_tipo = 'agendado' AND categoria = ? AND valor = ?
                 )`,
                [categoria, valor, categoria, valor],
            );
        }
        await run(`DELETE FROM config_checklist
                   WHERE id NOT IN (
                       SELECT MIN(id)
                       FROM config_checklist
                       GROUP BY checklist_tipo, categoria, valor
                   )`);

        const clientes = [
            [
                1001,
                "Ana Clara Martins",
                "000.000.001-01",
                "1990-03-12",
                "(22) 90000-1001",
                "Prefere contato por WhatsApp.",
                "28000-001",
                "Rua das Flores",
                "101",
                "Apto 201",
                "Centro",
                "Campos dos Goytacazes",
                "RJ",
                1,
            ],
            [
                1002,
                "Bruno Oliveira",
                "000.000.002-02",
                "1985-07-28",
                "(22) 90000-1002",
                "",
                "28000-002",
                "Avenida Central",
                "225",
                "",
                "Parque Aurora",
                "Campos dos Goytacazes",
                "RJ",
                1,
            ],
            [
                1003,
                "Carla Mendes",
                "000.000.003-03",
                "1993-11-06",
                "(22) 90000-1003",
                "Pet com sensibilidade na pele.",
                "28000-003",
                "Rua do Sol",
                "48",
                "Casa",
                "Pelinca",
                "Campos dos Goytacazes",
                "RJ",
                0,
            ],
            [
                1004,
                "Diego Santos",
                "000.000.004-04",
                "1988-01-19",
                "(22) 90000-1004",
                "",
                "28000-004",
                "Rua dos Ipês",
                "730",
                "",
                "Jardim Sao Benedito",
                "Campos dos Goytacazes",
                "RJ",
                1,
            ],
            [
                1005,
                "Elisa Ferreira",
                "000.000.005-05",
                "1996-05-23",
                "(22) 90000-1005",
                "Busca atendimento para dois pets.",
                "28000-005",
                "Rua das Acacias",
                "16",
                "Fundos",
                "Turf Club",
                "Campos dos Goytacazes",
                "RJ",
                1,
            ],
            [
                1006,
                "Felipe Rocha",
                "000.000.006-06",
                "1982-09-14",
                "(22) 90000-1006",
                "",
                "28000-006",
                "Avenida dos Lagos",
                "910",
                "",
                "Horto",
                "Campos dos Goytacazes",
                "RJ",
                1,
            ],
            [
                1007,
                "Gabriela Nunes",
                "000.000.007-07",
                "1991-12-02",
                "(22) 90000-1007",
                "Solicita aviso antes de qualquer produto.",
                "28000-007",
                "Rua da Praca",
                "302",
                "Apto 404",
                "Centro",
                "Campos dos Goytacazes",
                "RJ",
                1,
            ],
            [
                1008,
                "Henrique Alves",
                "000.000.008-08",
                "1979-06-30",
                "(22) 90000-1008",
                "",
                "28000-008",
                "Rua Beira Mar",
                "55",
                "Casa",
                "Farol",
                "Campos dos Goytacazes",
                "RJ",
                0,
            ],
        ];
        for (const cliente of clientes) {
            await run(
                `INSERT OR IGNORE INTO clientes
                 (id, nome, cpf, datanasc, telefone, obs, cep, logradouro, numero, complemento, bairro, cidade, uf, notificacao)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                cliente,
            );
        }

        const pets = [
            [
                2001,
                1001,
                "Luna",
                "2019-04-10",
                "Ativo",
                "Cachorro",
                101,
                "pequeno",
                "medio",
                7.4,
                "F",
                1,
                "Tranquila durante o banho.",
                "Sim",
                "Laco",
                "Extra Soft",
                "",
                "Branco",
            ],
            [
                2002,
                1001,
                "Thor",
                "2018-08-22",
                "Ativo",
                "Cachorro",
                102,
                "grande",
                "curto",
                29.8,
                "M",
                1,
                "",
                "Nao",
                "Bandana",
                "Normal",
                "",
                "Caramelo",
            ],
            [
                2003,
                1002,
                "Milo",
                "2021-02-15",
                "Ativo",
                "Gato",
                110,
                "medio",
                "curto",
                4.9,
                "M",
                1,
                "Nao gosta de secador muito quente.",
                "Alergia a Perfume",
                "Sem Enfeites",
                "Neutro",
                "Usar toalha macia.",
                "Cinza",
            ],
            [
                2004,
                1003,
                "Nina",
                "2020-10-03",
                "Ativo",
                "Cachorro",
                104,
                "pequeno",
                "longo",
                5.8,
                "F",
                1,
                "",
                "Sim",
                "Laco",
                "Extra Soft",
                "Pele sensivel",
                "Branco e Caramelo",
            ],
            [
                2005,
                1004,
                "Bento",
                "2017-12-11",
                "Ativo",
                "Cachorro",
                105,
                "medio",
                "curto",
                11.2,
                "M",
                1,
                "Respiracao sensivel; manter ambiente ventilado.",
                "Nao",
                "Sem Enfeites",
                "Neutro",
                "Evitar calor excessivo.",
                "Tigrado",
            ],
            [
                2006,
                1005,
                "Pipoca",
                "2022-01-27",
                "Ativo",
                "Cachorro",
                108,
                "medio",
                "medio",
                13.6,
                "F",
                0,
                "Muito brincalhona.",
                "Sim",
                "Bandana",
                "Normal",
                "",
                "Tricolor",
            ],
            [
                2007,
                1005,
                "Simba",
                "2019-06-18",
                "Ativo",
                "Gato",
                112,
                "grande",
                "longo",
                7.1,
                "M",
                1,
                "",
                "Nao",
                "Sem Enfeites",
                "Neutro",
                "Escovar antes do banho.",
                "Dourado",
            ],
            [
                2008,
                1006,
                "Mel",
                "2016-03-09",
                "Ativo",
                "Cachorro",
                103,
                "grande",
                "longo",
                27.5,
                "F",
                1,
                "",
                "Sim",
                "Laco",
                "Tonalizador",
                "",
                "Dourado",
            ],
            [
                2009,
                1007,
                "Zeca",
                "2020-07-21",
                "Ativo",
                "Cachorro",
                107,
                "pequeno",
                "curto",
                8.3,
                "M",
                1,
                "",
                "Nao",
                "Gravata",
                "Normal",
                "",
                "Marrom",
            ],
            [
                2010,
                1008,
                "Amora",
                "2021-11-30",
                "Ativo",
                "Gato",
                114,
                "medio",
                "medio",
                4.2,
                "F",
                1,
                "Assustada com ambientes movimentados.",
                "Alergia a Perfume",
                "Sem Enfeites",
                "Neutro",
                "Atender em horario tranquilo.",
                "Preto e Branco",
            ],
        ];
        for (const pet of pets) {
            await run(
                `INSERT OR IGNORE INTO pets
                 (id, cliente_id, nome, datanasc, status, especie, raca_id, porte, tamanhopelo, peso, sexo, castrado, obs, perfume, enfeites, shampoo, cuidados_especiais, cor)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                pet,
            );
        }

        const servicos = [
            [3001, "Banho", "banho", 65.0, 75, 1],
            [3002, "Banho e tosa higiênica", "banho", 85.0, 90, 1],
            [3003, "Tosa na tesoura", "tosa", 120.0, 120, 1],
            [3004, "Tosa na máquina", "tosa", 95.0, 90, 1],
            [3005, "Hidratação", "tratamento", 35.0, 30, 1],
            [3006, "Desembolo", "tratamento", 55.0, 45, 1],
            [3007, "Corte de unhas", "cuidados", 25.0, 20, 1],
            [3008, "Limpeza de ouvidos", "cuidados", 20.0, 15, 1],
        ];
        for (const servico of servicos) {
            await run(
                `INSERT OR IGNORE INTO servicos (id, nome, categoria, preco_padrao, duracao, ativo)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                servico,
            );
        }

        const regrasPorRaca = [
            [3001, 101, 72.0, 80],
            [3001, 102, 82.0, 90],
            [3001, 103, 88.0, 95],
            [3001, 104, 70.0, 80],
            [3001, 105, 78.0, 85],
            [3001, 109, 75.0, 85],
            [3001, 110, 68.0, 70],
            [3001, 112, 82.0, 95],
            [3002, 101, 92.0, 95],
            [3002, 102, 112.0, 110],
            [3002, 103, 120.0, 120],
            [3002, 104, 95.0, 100],
            [3002, 109, 105.0, 110],
            [3002, 110, 92.0, 90],
            [3003, 101, 135.0, 135],
            [3003, 103, 165.0, 160],
            [3003, 104, 140.0, 145],
            [3003, 106, 155.0, 150],
            [3003, 109, 150.0, 150],
            [3003, 112, 180.0, 180],
            [3004, 102, 110.0, 105],
            [3004, 105, 105.0, 100],
            [3004, 108, 100.0, 100],
            [3004, 110, 90.0, 85],
            [3004, 114, 95.0, 90],
            [3005, 101, 42.0, 35],
            [3005, 103, 58.0, 45],
            [3005, 104, 45.0, 40],
            [3005, 109, 50.0, 45],
            [3005, 112, 65.0, 55],
            [3006, 103, 75.0, 60],
            [3006, 104, 70.0, 60],
            [3006, 106, 80.0, 65],
            [3006, 109, 78.0, 60],
            [3006, 112, 95.0, 75],
            [3007, 101, 28.0, 20],
            [3007, 102, 35.0, 25],
            [3007, 109, 30.0, 25],
            [3007, 112, 40.0, 30],
            [3008, 101, 22.0, 15],
            [3008, 102, 28.0, 20],
            [3008, 109, 30.0, 20],
            [3008, 112, 38.0, 25],
        ];
        for (const regra of regrasPorRaca) {
            await run(
                `INSERT OR IGNORE INTO servico_racas (servico_id, raca_id, preco, duracao)
                 VALUES (?, ?, ?, ?)`,
                regra,
            );
        }

        const notificacoes = [
            [
                4001,
                "Bem-vindo ao ambiente de demonstracao",
                "Este ambiente usa somente dados ficticios para apresentacoes e treinamentos.",
                "Aviso",
                "Equipe Flooty Pet",
            ],
            [
                4002,
                "Novos servicos cadastrados",
                "Banho, tosa, hidratacao e cuidados especiais ja estao disponiveis para demonstracao.",
                "Atualizacao",
                "Equipe Flooty Pet",
            ],
            [
                4003,
                "Cadastro de clientes de exemplo",
                "Os clientes e pets exibidos nesta conta foram criados para uso em videos, sem dados reais.",
                "Informacao",
                "Marina Demo",
            ],
        ];
        for (const notificacao of notificacoes) {
            await run(
                `INSERT OR IGNORE INTO notificacoes (id, titulo, descricao, tipo, author, lida)
                 VALUES (?, ?, ?, ?, ?, 0)`,
                notificacao,
            );
        }

        await run("COMMIT");
    } catch (error) {
        await run("ROLLBACK");
        throw error;
    }

    const counts = await Promise.all(
        [
            ["users", "usuarios"],
            ["racas", "racas"],
            ["config_checklist", "opcoes de checklist"],
            ["clientes", "clientes"],
            ["pets", "pets"],
            ["servicos", "servicos"],
            ["notificacoes", "notificacoes"],
        ].map(
            ([table, label]) =>
                new Promise((resolve, reject) => {
                    db.get(
                        `SELECT COUNT(*) AS total FROM ${table}`,
                        (err, row) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve(`${label}: ${row.total}`);
                        },
                    );
                }),
        ),
    );

    console.log("Seed de demonstracao concluido.");
    console.log(`Login: demo@flootypet.local / ${DEMO_PASSWORD}`);
    console.log(counts.join(" | "));
};

seed()
    .catch((error) => {
        console.error("Falha ao executar o seed:", error.message);
        process.exitCode = 1;
    })
    .finally(() => {
        db.close();
    });

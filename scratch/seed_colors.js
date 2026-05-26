const db = require('../database/db');

const colors = ["Preto", "Branco", "Caramelo", "Cinza", "Marrom", "Mesclado"];

db.serialize(() => {
    colors.forEach(color => {
        db.get(
            "SELECT id FROM config_checklist WHERE checklist_tipo = 'agendado' AND categoria = 'cores' AND valor = ?",
            [color],
            (err, row) => {
                if (err) {
                    console.error("Erro ao verificar cor:", err);
                    return;
                }
                if (!row) {
                    db.run(
                        "INSERT INTO config_checklist (checklist_tipo, categoria, valor) VALUES ('agendado', 'cores', ?)",
                        [color],
                        function(err) {
                            if (err) {
                                console.error(`Erro ao inserir cor ${color}:`, err);
                            } else {
                                console.log(`Cor "${color}" inserida com ID ${this.lastID}`);
                            }
                        }
                    );
                } else {
                    console.log(`Cor "${color}" já existe.`);
                }
            }
        );
    });
});

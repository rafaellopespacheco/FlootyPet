const bcrypt = require("bcrypt");
const db = require("./database/db");

async function createAdmin() {
    const senha = await bcrypt.hash("suasenha", 10);

    db.run(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES (?, ?, ?, ?)`,
        [
            "seunome",
            "seu@email.com",
            senha,
            1
        ],
        function (err) {
            if (err) {
                console.error(err);
                return;
            }

            console.log("Administrador criado com sucesso!");
            process.exit();
        }
    );
}

createAdmin();
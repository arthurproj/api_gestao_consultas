const { Pool } = require("pg");
require("dotenv").config();

class Database {
    static instance;

    constructor() {
        if (Database.instance) {
            return Database.instance;
        }

        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false } // Necessário para o Neon DB
        });

        Database.instance = this;
    }

    // Método para executar queries
    async query(sql, params = []) {
        try {
            const { rows } = await this.pool.query(sql, params);
            return rows;
        } catch (error) {
            console.error("Erro na execução da query:", error);
            throw error;
        }
    }

    async connect() {
        try {
            this.client = await this.pool.connect();
            console.log("Conexão com o banco de dados estavelecida");
            return this.client;
        } catch (error){
            console.error("Erro ao conectar com o banco de dados:", error);
            throw error;
        }
    }

    async close() {
        try {
            await this.pool.end();
            console.log("Conexão com o banco de dados fechada");
        } catch (error) {
            console.error("Erro ao fechar a conexão:", error);
            throw error;
        }
    }
}

// Exportar uma única instância Singleton
module.exports = new Database();

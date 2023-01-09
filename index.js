const express = require('express');
const { Client } = require('pg');
const dotenv = require('dotenv')


dotenv.config()

const app = express();

app.use(express.json());

const databaseConfig = readDBConfigFromEnv()

const connectionString = `postgres://${databaseConfig.userName}:${databaseConfig.dbPass}@${databaseConfig.dbHost}:${databaseConfig.dbPort}/${databaseConfig.dbName}`;

const insertQuery = 'INSERT INTO IDEA (TITLE, DESCRIPTION) VALUES ($1, $2) RETURNING *';
const findAllQuery =  'SELECT * FROM IDEA';

const client = new Client({ connectionString });
client.connect();

client.query(`
CREATE TABLE IF NOT EXISTS IDEA (
    ID SERIAL PRIMARY KEY,
    TITLE VARCHAR(25) NOT NULL,
    DESCRIPTION VARCHAR(150) NOT NULL
);
`, [], (err) => {
    if (err) {
        console.error(err);
    }
})


app.post('/idea', (req, res) => {
    const { title, description } = req.body;

    const values = [title, description];

    client.query(insertQuery, values, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error writing idea to database' });
            return;
        }

        res.json(result.rows[0]);
    });
});

app.get('/ideas', (req, res) => {

    client.query(findAllQuery, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error reading ideas from database' });
            return;
        }

        res.json(result.rows);
    });
})
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

function readDBConfigFromEnv() {
    const userName = process.env.DB_USERNAME
    const dbName = process.env.DB_NAME
    const dbPass = process.env.DB_PASS
    const dbHost = process.env.DB_HOST || 'localhost'
    const dbPort = process.env.DB_PORT || 5432

    return {
        userName, dbName, dbPass, dbHost, dbPort
    }
}

const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();

// Connect to the database
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Check if db connection works
db.connect((err) => {
  if (err) return console.log("Error connecting to the MySQL database: ", err);

  console.log("Connected to MySQL successfully as id: ", db.threadId);
  
  // Retrieve all patients (Question 1)
  app.get('/patients', async (req, res) => {
    try {
      const [patients] = await db.promise().query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients');
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients: ", error);
      res.status(500).send('Server error');
    }
  });

  // Retrieve all providers (Question 2)
  app.get('/providers', async (req, res) => {
    try {
      const [providers] = await db.promise().query('SELECT first_name, last_name, provider_specialty FROM providers');
      res.json(providers);
    } catch (error) {
      console.error("Error fetching providers: ", error);
      res.status(500).send('Server error');
    }
  });

  // Filter patients by first name (Question 3)
  app.get('/patients/:first_name', async (req, res) => {
    const { first_name } = req.params;
    try {
      const [patients] = await db.promise().query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?', [first_name]);
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients by first name: ", error);
      res.status(500).send('Server error');
    }
  });

  // Retrieve providers by specialty (Question 4)
  app.get('/providers/specialty/:specialty', async (req, res) => {
    const { specialty } = req.params;
    try {
      const [providers] = await db.promise().query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [specialty]);
      res.json(providers);
    } catch (error) {
      console.error("Error fetching providers by specialty: ", error);
      res.status(500).send('Server error');
    }
  });

  // Listen to the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });
});

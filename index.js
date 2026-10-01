const express = require("express");
const mysql = require("mysql2/promise");

const app = express();

app.use(express.json());

// Connect to the same MySQL database used by the previous project
const pool = mysql.createPool({
    host: "student-databases.cvode4s4cwrc.us-west-2.rds.amazonaws.com",
    user: "DYLANLOROWE",
    password: "XQqXx1991T6S7Cs9jUEWjRCbXrU4cPwKbea",
    database: "DYLANLOROWE"
});

// Create the table if it doesn't already exist
async function setupDatabase() {
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS button_readings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            button_state INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log("button_readings table ready");
}

setupDatabase().catch(console.error);


// Receive button data from Arduino
app.post("/api/sensor", async (req, res) => {

    try {

        console.log(req.body);

        const buttonState = req.body.button;

        await pool.execute(
            "INSERT INTO button_readings (button_state) VALUES (?)",
            [buttonState]
        );

        console.log("Button reading stored in database");

        res.json({
            message: "Sensor data received and stored"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
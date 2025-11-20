const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🔐 SET YOUR ADMIN PASSWORD HERE
const ADMIN_PASSWORD = "admin123"; // <--- CHANGE THIS TO ANY PASSWORD YOU WANT

// Serve the public folder
app.use(express.static(path.join(__dirname, "public")));

// Save form submission
app.post("/submit", (req, res) => {
    const newEntry = req.body;

    fs.readFile("responses.json", "utf8", (err, data) => {
        let responses = [];

        if (!err && data) {
            responses = JSON.parse(data);
        }

        responses.push(newEntry);

        fs.writeFile("responses.json", JSON.stringify(responses, null, 2), err => {
            if (err) {
                return res.status(500).send("Error saving data");
            }
            res.send("Form submitted successfully!");
        });
    });
});


// 🔐 Admin login
app.post("/admin-login", (req, res) => {
    const { password } = req.body;

    if (password === ADMIN_PASSWORD) {
        return res.json({ success: true, redirect: "/admin-dashboard.html" });
    }

    res.json({ success: false, message: "Incorrect password" });
});

// 🧾 Admin dashboard data
app.get("/admin-data", (req, res) => {
    fs.readFile("responses.json", "utf8", (err, data) => {
        if (err) return res.json([]);

        res.json(JSON.parse(data));
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});

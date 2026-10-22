const express = require("express");
const path = require("node:path");
const { validateWorkData } = require("../shared/workValidation.js");

const app = express();

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

app.get("/", (req, res) => {
    res.redirect("/register");
});

app.get("/js/workValidation.js", (_req, res) => {
    res.sendFile(path.join(__dirname, "../shared/workValidation.js"));
});

app.get("/register", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../public/index.html")
    );
});

app.post("/register", (req, res) => {
    const result = validateWorkData(req.body);

    if(!result.isValid) {
        return res.status(400).json({ errors: result.errors });
    }

    return res.json({
        work: result.data,
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});

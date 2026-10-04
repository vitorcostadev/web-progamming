import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);

app.get("/register", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../public/index.html")
    );
});

app.get("/", (req, res) => {
    res.redirect("/register");
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});
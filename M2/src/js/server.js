import express from "express";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateWorkData } from "../shared/workValidation.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(session({
    secret: "webm2",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../shared")));
app.use(express.json());

app.get("/", (req, res) => {
    res.redirect("/register");
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

    req.session.work = result.data;
    req.session.cookie.maxAge = 24 * 60 * 60 * 1000;

    return res.json({
        work: result.data,
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});

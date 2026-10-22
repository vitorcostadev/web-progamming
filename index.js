const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { validateWorkData } = require("./M2/src/shared/workValidation.js");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "M2/src/public/index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "M2/src/public/style/style.css"), "utf8");
const sharedValidation = fs.readFileSync(
    path.join(root, "M2/src/shared/workValidation.js"),
    "utf8"
);
const registerValidator = fs.readFileSync(
    path.join(root, "M2/src/public/js/registerValidator.js"),
    "utf8"
);
const tableScript = fs.readFileSync(
    path.join(root, "M2/src/public/js/table.js"),
    "utf8"
);
const server = fs.readFileSync(path.join(root, "M2/src/js/server.js"), "utf8");

const validWork = {
    work_name: "Mona Lisa",
    actor: "Leonardo da Vinci",
    work_year: "1503",
    period_work: "d.C",
    work_type: "quadro",
    details: "Pintura a óleo.",
};

function getControl(id) {
    const control = html.match(
        new RegExp(`<(?:input|textarea|select)\\b(?=[^>]*\\bid=["']${id}["'])[^>]*>`, "i")
    );
    assert.ok(control, `Controle #${id} não encontrado no HTML`);
    return control[0];
}

function getAttribute(markup, name) {
    return markup.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2];
}

function hasAttribute(markup, name) {
    return new RegExp(`\\b${name}(?:\\s|=|/?>)`, "i").test(markup);
}

function getSelectValues(id) {
    const select = html.match(
        new RegExp(`<select\\b(?=[^>]*\\bid=["']${id}["'])[^>]*>([\\s\\S]*?)<\\/select>`, "i")
    );
    assert.ok(select, `Select #${id} não encontrado no HTML`);
    return [...select[1].matchAll(/<option\b[^>]*\bvalue=["']([^"']*)["'][^>]*>/gi)]
        .map((option) => option[1]);
}

function cssRule(selector) {
    const declarations = {};
    let found = false;

    for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const selectors = match[1].split(",").map((item) => item.trim());
        if (selectors.includes(selector)) {
            found = true;
            for (const declaration of match[2].split(";")) {
                const trimmed = declaration.trim();
                if (!trimmed) continue;
                const separator = trimmed.indexOf(":");
                declarations[trimmed.slice(0, separator).trim()] = trimmed
                    .slice(separator + 1)
                    .trim();
            }
        }
    }
    if (found) return declarations;
    assert.fail(`Regra CSS para ${selector} não encontrada`);
}

function errorFor(input, field) {
    return validateWorkData(input).errors.find((error) => error.field === field);
}

test("campos do formulário têm tipos, limites e obrigatoriedade requeridos", () => {
    for (const id of ["work_name", "actor"]) {
        const control = getControl(id);
        assert.equal(getAttribute(control, "type"), "text");
        assert.equal(getAttribute(control, "maxlength"), "100");
        assert.ok(hasAttribute(control, "required"));
    }

    const year = getControl("work_year");
    assert.equal(getAttribute(year, "type"), "text");
    assert.equal(getAttribute(year, "inputmode"), "numeric");
    assert.equal(getAttribute(year, "maxlength"), "4");
    assert.ok(hasAttribute(year, "required"));

    const details = getControl("details_text");
    assert.equal(getAttribute(details, "maxlength"), "2000");
    assert.equal(getAttribute(details, "rows"), "5");
    assert.equal(hasAttribute(details, "required"), false);
    assert.equal(getAttribute(details, "name"), "details");

    assert.ok(hasAttribute(getControl("period_work"), "required"));
    assert.ok(hasAttribute(getControl("work_type"), "required"));
});

test("selects oferecem opção vazia e todas as opções previstas", () => {
    assert.deepEqual(getSelectValues("period_work"), ["", "d.C", "a.C"]);
    assert.deepEqual(getSelectValues("work_type"), ["", "quadro", "escultura", "outro"]);
});

test("validação aceita dados válidos e detalhamento ausente", () => {
    assert.equal(validateWorkData(validWork).isValid, true);

    const { details, ...withoutDetails } = validWork;
    const result = validateWorkData(withoutDetails);
    assert.equal(result.isValid, true);
    assert.equal(result.data.details, "");
});

test("validação exige campos obrigatórios e reporta um erro por campo", () => {
    const result = validateWorkData({
        work_name: "",
        actor: "",
        work_year: "",
        period_work: "",
        work_type: "",
    });
    const fields = result.errors.map((error) => error.field);

    assert.equal(result.isValid, false);
    assert.deepEqual(new Set(fields), new Set([
        "work_name",
        "actor",
        "work_year",
        "period_work",
        "work_type",
    ]));
    assert.equal(fields.length, new Set(fields).size);
});

test("validação aplica tamanho mínimo e máximo ao nome e ao autor", () => {
    assert.equal(errorFor({ ...validWork, work_name: "Curta" }, "work_name")?.type, "min_length");
    assert.equal(errorFor({ ...validWork, actor: "Curto" }, "actor")?.type, "min_length");
    assert.equal(errorFor({ ...validWork, work_name: "N".repeat(101) }, "work_name")?.type, "max_length");
    assert.equal(errorFor({ ...validWork, actor: "A".repeat(101) }, "actor")?.type, "max_length");
    assert.equal(validateWorkData({ ...validWork, work_name: "N".repeat(100), actor: "A".repeat(100) }).isValid, true);
});

test("nome da obra e autor aceitam algarismos como texto livre", () => {
    assert.equal(validateWorkData({ ...validWork, work_name: "Obra 2" }).isValid, true);
    assert.equal(validateWorkData({ ...validWork, actor: "Artista 123" }).isValid, true);
});

test("validação aceita ano numérico de até quatro caracteres e rejeita os demais", () => {
    assert.equal(validateWorkData({ ...validWork, work_year: "2024" }).isValid, true);
    assert.equal(errorFor({ ...validWork, work_year: "abc" }, "work_year")?.type, "invalid_type");
    assert.equal(errorFor({ ...validWork, work_year: "12345" }, "work_year")?.type, "max_length");
});

test("validação restringe período e tipo às opções válidas", () => {
    for (const period_work of ["d.C", "a.C"]) {
        assert.equal(validateWorkData({ ...validWork, period_work }).isValid, true);
    }
    for (const work_type of ["quadro", "escultura", "outro"]) {
        assert.equal(validateWorkData({ ...validWork, work_type }).isValid, true);
    }
    assert.equal(errorFor({ ...validWork, period_work: "" }, "period_work")?.type, "invalid_option");
    assert.equal(errorFor({ ...validWork, work_type: "inválido" }, "work_type")?.type, "invalid_option");
});

test("detalhamento é opcional e respeita o limite de 2000 caracteres", () => {
    assert.equal(validateWorkData({ ...validWork, details: "" }).isValid, true);
    assert.equal(validateWorkData({ ...validWork, details: "D".repeat(2000) }).isValid, true);
    assert.equal(errorFor({ ...validWork, details: "D".repeat(2001) }, "details")?.type, "max_length");
});

test("validação no navegador mostra mensagens, marca campos e limpa erros anteriores", () => {
    assert.match(sharedValidation, /work_name:\s*\{\s*min:\s*6,\s*max:\s*100\s*\}/);
    assert.match(sharedValidation, /actor:\s*\{\s*min:\s*10,\s*max:\s*100\s*\}/);
    assert.match(sharedValidation, /work_year:\s*\{\s*min:\s*0,\s*max:\s*4\s*\}/);
    assert.match(sharedValidation, /details:\s*\{\s*min:\s*0,\s*max:\s*2000\s*\}/);
    assert.match(sharedValidation, /Number\.isInteger\(Number\(year\)\)/);
    assert.match(sharedValidation, /module\.exports = workValidation/);
    assert.match(sharedValidation, /window\.M2Validation = workValidation/);
    assert.match(registerValidator, /const \{ validateWorkData \} = window\.M2Validation/);
    assert.match(registerValidator, /validateWorkData\(Object\.fromEntries\(new FormData\(form\)\.entries\(\)\)\)/);
    assert.match(html, /<script src=["']\/js\/workValidation\.js["']><\/script>/);
    assert.match(tableScript, /document\.createElement\("ul"\)/);
    assert.match(tableScript, /document\.createElement\("li"\)/);
    assert.match(tableScript, /classList\.add\("invalid-field"\)/);
    assert.match(tableScript, /classList\.remove\("invalid-field"\)/);
    assert.match(tableScript, /validator\.replaceChildren\(\)/);
    assert.match(registerValidator, /clearValidationErrors\(\);[\s\S]*validateWorkData\(/);
    assert.match(cssRule(".invalid-field").border, /red/);
});

test("botão valida e registra linhas com os campos da obra, sem detalhamento", () => {
    const form = html.match(/<form\b[^>]*id=["']museu-form["'][^>]*>([\s\S]*?)<\/form>/i)?.[1];
    assert.ok(form);
    assert.match(form, /<button\b[^>]*type=["']submit["'][^>]*>\s*Cadastrar\s*<\/button>/i);
    assert.match(registerValidator, /if\s*\(!result\.isValid\)[\s\S]*showValidationErrors\(result\.errors\)/);
    assert.match(registerValidator, /addWorkRow\(result\.data\);\s*form\.reset\(\)/);

    const headers = [...html.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)]
        .map((match) => match[1].replace(/<[^>]*>/g, "").trim());
    for (const fieldLabel of ["Nome da obra", "Autor", "Ano", "Período", "Tipo"]) {
        assert.ok(headers.includes(fieldLabel), `Coluna ${fieldLabel} não encontrada`);
    }
    assert.ok(!headers.includes("Detalhamento"));
    assert.match(tableScript, /\["work_name",\s*"actor",\s*"work_year",\s*"period_work",\s*"work_type"\]/);
});

test("clicar em uma linha abre o detalhamento e excluir pede confirmação", () => {
    assert.match(tableScript, /row\.addEventListener\("click"/);
    assert.match(tableScript, /detailsContent\.textContent\s*=\s*data\.details\.trim\(\)/);
    assert.match(tableScript, /detailsDialog\.showModal\(\)/);
    assert.match(tableScript, /window\.confirm\(/);
    assert.match(tableScript, /if\s*\(window\.confirm\([\s\S]*?\)\)\s*row\.remove\(\)/);
});

test("tema CSS cumpre os requisitos de tabelas, campos e página", () => {
    const cells = cssRule("td");
    const headings = cssRule("th");
    const body = cssRule("body");
    const controls = cssRule(".itas-style");

    assert.equal(cells.padding, "20px");
    assert.equal(cells["font-size"], "0.75em");
    assert.equal(cells["vertical-align"], "top");
    assert.equal(cells["overflow-wrap"], "anywhere");
    assert.equal(cells["text-align"], "justify");
    assert.ok(headings["background-color"]);
    assert.match(headings["border-bottom"], /solid 3px/);
    assert.ok(cssRule("tbody tr:hover")["background-color"]);
    assert.match(cssRule("tbody tr:last-child td")["border-bottom"], /solid 1px/);

    assert.equal(controls["font-size"], "0.85em");
    assert.equal(controls.padding, "5px");
    assert.equal(cssRule(".itas-style:hover")["background-color"], cssRule(".itas-style:focus")["background-color"]);
    assert.equal(cssRule("label")["font-weight"], "bold");
    assert.equal(body["padding-left"], "15px");
    assert.equal(body["padding-right"], "15px");
    assert.equal(body["line-height"], "1.6");
});

test("servidor valida POST /register e retorna a obra sem usar sessão", () => {
    assert.match(server, /app\.get\("\/js\/workValidation\.js"/);
    assert.doesNotMatch(server, /express\.static\(path\.join\(__dirname,\s*"\.\.\/shared"\)\)/);
    assert.match(server, /app\.post\("\/register"/);
    assert.match(server, /validateWorkData\(req\.body\)/);
    assert.match(server, /if\s*\(!result\.isValid\)[\s\S]*status\(400\)\.json\(\{\s*errors:\s*result\.errors\s*\}\)/);
    assert.match(server, /return res\.json\(\{\s*work:\s*result\.data,?\s*\}\)/);
    assert.doesNotMatch(server, /express-session|req\.session|SESSION_MAX_AGE/);
});

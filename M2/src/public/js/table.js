const form = document.getElementById("museu-form");
const validator = document.getElementById("validator");
const worksBody = document.querySelector("#works-table tbody");
const detailsDialog = document.getElementById("work-details-dialog");
const detailsContent = document.getElementById("work-details-content");

const normalizedNames = {
    work_name: "Nome da obra",
    actor: "Autor",
    work_year: "Ano da obra",
    period_work: "Período da obra",
    work_type: "Tipo da obra",
    details: "Detalhes da obra"
};

const errorMessage = ({ type, limit }) => {
    switch (type) {
        case "min_length":
            return `Informe pelo menos ${limit} caracteres.`;
        case "max_length":
            return `Informe no máximo ${limit} caracteres.`;
        case "invalid_option":
            return "Selecione uma das opções disponíveis.";
        default:
            return "Informe um valor válido.";
    }
};

export function clearValidationErrors() {
    if (validator.open) validator.close();
    validator.replaceChildren();

    form.querySelectorAll(".invalid-field").forEach((field) => {
        field.classList.remove("invalid-field");
        field.removeAttribute("aria-invalid");
    });
}

export function showValidationErrors(errors) {
    const title = document.createElement("h2");
    title.id = "validator-title";
    title.textContent = "Campos inválidos";

    const list = document.createElement("ul");
    errors.forEach((error) => {
        const item = document.createElement("li");
        item.textContent = `${normalizedNames[error.field]}: ${errorMessage(error)}`;
        list.appendChild(item);

        const field = form.elements.namedItem(error.field);
        if (field) {
            field.classList.add("invalid-field");
            field.setAttribute("aria-invalid", "true");
        }
    });

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "itas-style";
    closeButton.textContent = "Fechar";
    closeButton.addEventListener("click", () => validator.close());

    validator.append(title, list, closeButton);
    validator.showModal();
}

export function addWorkRow(data) {
    const row = document.createElement("tr");

    ["work_name", "actor", "work_year", "period_work", "work_type"].forEach((field) => {
        const cell = document.createElement("td");
        cell.textContent = data[field];
        row.appendChild(cell);
    });

    const actionsCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "itas-style";
    deleteButton.textContent = "Excluir";
    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        if (window.confirm("Deseja excluir esta obra?")) row.remove();
    });
    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);

    row.addEventListener("click", () => {
        detailsContent.textContent = data.details.trim() || "Nenhum detalhamento informado.";
        detailsDialog.showModal();
    });

    worksBody.appendChild(row);
}

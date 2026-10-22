import {
    addWorkRow,
    clearValidationErrors,
    showValidationErrors
} from "./table.js";

const form = document.getElementById("museu-form");
const { validateWorkData } = window.M2Validation;

form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearValidationErrors();

    const result = validateWorkData(Object.fromEntries(new FormData(form).entries()));
    if (!result.isValid) {
        showValidationErrors(result.errors);
        return;
    }

    addWorkRow(result.data);
    form.reset();
});

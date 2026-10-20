import {
    minMaxValidator,
    selectValidator,
    stringValidator,
    ValidationResult,
    yearValidator
} from "./constants.js";
import {
    addWorkRow,
    clearValidationErrors,
    showValidationErrors
} from "./table.js";

const form = document.getElementById("museu-form");
const REQUIRED_STRING_FIELDS = ["work_name", "actor"];

const registerValidator = (formData) => {
    const data = Object.fromEntries(formData.entries());
    const result = new ValidationResult();

    stringValidator(data, REQUIRED_STRING_FIELDS, result);
    minMaxValidator(data, result);
    yearValidator(data.work_year, result);
    selectValidator(data, result);

    return { data, result };
};

form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearValidationErrors();

    const { data, result } = registerValidator(new FormData(form));
    if (!result.isValid) {
        showValidationErrors(result.errors);
        return;
    }

    addWorkRow(data);
    form.reset();
});

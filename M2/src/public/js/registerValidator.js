import { stringValidator } from "./constants.js";

const form = document.getElementById("museu-form");

const minMaxValidator = ({ work_name, actor, details }) => {
    const invalidFields = [];

    if (work_name.length < 6 || work_name.length > 100) {
        invalidFields.push("work_name");
    }

    if (actor.length < 10 || actor.length > 100) {
        invalidFields.push("actor");
    }

    if (details.length > 2000) {
        invalidFields.push("details");
    }

    return invalidFields;
};

const selectValidator = ({ period_work, work_type }) => {
    const invalidFields = [];

    if (period_work === "") {
        invalidFields.push("period_work");
    }

    if (work_type === "") {
        invalidFields.push("work_type");
    }

    return invalidFields;
};

const registerValidator = (info) => {
    const data = Object.fromEntries(info);

    const {
        work_name,
        actor,
        work_year,
        period_work,
        work_type
    } = data;

    const invalidFields = [];

    invalidFields.push(...minMaxValidator(data));
    invalidFields.push(...selectValidator(data));

    const stringFields = [
        ["work_name", work_name],
        ["actor", actor],
        ["period_work", period_work],
        ["work_type", work_type]
    ];

    stringFields.forEach(([field, value]) => {
        if (!stringValidator(value)) {
            invalidFields.push(field);
        }
    });

    if (!Number.isInteger(Number(work_year))) {
        invalidFields.push("work_year");
    }

    return [...new Set(invalidFields)];
};

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const invalidFields = registerValidator(formData);

    if (invalidFields.length > 0) {
        alert(`Invalid fields: ${invalidFields.join(", ")}`);
        return false;
    }

    return true;

});
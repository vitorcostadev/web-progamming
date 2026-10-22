const FIELD_RULES = {
    work_name: { min: 6, max: 100 },
    actor: { min: 10, max: 100 },
    details: { min: 0, max: 2000 },
    work_year: { min: 0, max: 4 },
};

const SELECT_OPTIONS = {
    period_work: ["d.C", "a.C"],
    work_type: ["quadro", "escultura", "outro"],
};

const REQUIRED_STRING_FIELDS = ["work_name", "actor"];

function addError(errors, field, type, limit = null) {
    if (!errors.some((error) => error.field === field)) {
        errors.push({ field, type, limit });
    }
}

function validateRequiredStrings(data, errors) {
    for (const field of REQUIRED_STRING_FIELDS) {
        const value = data[field];
        if (typeof value !== "string" || value.trim().length === 0) {
            addError(errors, field, "invalid_type");
        }
    }
}

function validateTextLengths(data, errors) {
    for (const [field, { min, max }] of Object.entries(FIELD_RULES)) {
        if (field === "work_year") continue;

        const value = data[field];
        if (typeof value !== "string") {
            addError(errors, field, "invalid_type");
            continue;
        }

        const length = value.trim().length;
        if (length < min) {
            addError(errors, field, "min_length", min);
        } else if (length > max) {
            addError(errors, field, "max_length", max);
        }
    }
}

function validateYear(data, errors) {
    const year = data.work_year;
    if (
        typeof year !== "string" ||
        year.trim().length === 0 ||
        !Number.isInteger(Number(year))
    ) {
        addError(errors, "work_year", "invalid_type");
        return;
    }

    const { min, max } = FIELD_RULES.work_year;
    const length = year.trim().length;
    if (length > max) {
        addError(errors, "work_year", "max_length", max);
    } else if (length < min) {
        addError(errors, "work_year", "min_length", min);
    }
}

function validateSelects(data, errors) {
    for (const [field, options] of Object.entries(SELECT_OPTIONS)) {
        if (!options.includes(data[field])) {
            addError(errors, field, "invalid_option");
        }
    }
}

function validateWorkData(input) {
    const data = input && typeof input === "object" && !Array.isArray(input)
        ? { ...input, details: input.details ?? "" }
        : { details: "" };
    const errors = [];

    validateRequiredStrings(data, errors);
    validateTextLengths(data, errors);
    validateYear(data, errors);
    validateSelects(data, errors);

    return {
        isValid: errors.length === 0,
        errors,
        data,
    };
}

const workValidation = { validateWorkData };

if (typeof module !== "undefined" && module.exports) {
    module.exports = workValidation;
}

if (typeof window !== "undefined") {
    window.M2Validation = workValidation;
}

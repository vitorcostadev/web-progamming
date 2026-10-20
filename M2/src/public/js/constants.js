export const FIELD_RULES = {
    work_name: { min: 6, max: 100 },
    actor: { min: 10, max: 100 },
    details: { min: 0, max: 2000 },
    work_year: { min: 0, max: 4 }
};

export const SELECT_OPTIONS = {
    period_work: ["d.C", "a.C"],
    work_type: ["quadro", "escultura", "outro"]
};

export const normalizedNames = {
    work_name: "Nome da obra",
    actor: "Autor",
    work_year: "Ano da obra",
    period_work: "Período da obra",
    work_type: "Tipo da obra",
    details: "Detalhes da obra"
};

class ValidationError {
    constructor(field, type, limit = null) {
        this.field = field;
        this.type = type;
        this.limit = limit;
    }
}

export class ValidationResult {
    constructor() {
        this.invalidFields = [];
    }

    add(field, type, limit = null) {
        this.invalidFields.push(
            new ValidationError(field, type, limit)
        );
    }

    get isValid() {
        return this.invalidFields.length === 0;
    }

    get errors() {
        return this.invalidFields.map(error => ({
            field: error.field,
            type: error.type,
            limit: error.limit
        }));
    }
}

export const stringValidator = (data, fields, result) => {
    fields.forEach(field => {
        const value = data[field];

        if (
            typeof value !== "string" ||
            value.trim().length === 0 ||
            any(value.split(""), char => !isNaN(char) && char !== " ")
        ) {
            result.add(field, "invalid_type");
        }
    });
};

export const minMaxValidator = (data, result) => {
    for (const [field, { min, max }] of Object.entries(FIELD_RULES)) {
        
        if (field === "work_year") continue;

        const value = data[field];

        if (typeof value !== "string") {
            result.add(field, "invalid_type");
            continue;
        }

        const length = value.trim().length;

        if (length < min) {
            result.add(field, "min_length", min);
        } else if (length > max) {
            result.add(field, "max_length", max);
        }
    }
};

export const yearValidator = (year, result) => {
    if (
        typeof year !== "string" ||
        year.trim().length === 0 ||
        !Number.isInteger(Number(year))
    ) {
        result.add("work_year", "invalid_type");
        return;
    }

    const { min, max } = FIELD_RULES.work_year;
    const length = year.trim().length;

    if (length > max) {
        result.add("work_year", "max_length", max);
    } else if (length < min) {
        result.add("work_year", "min_length", min);
    }
};

export const selectValidator = (data, result) => {
    for (const [field, options] of Object.entries(SELECT_OPTIONS)) {
        if (!options.includes(data[field])) {
            result.add(field, "invalid_option");
        }
    }
};

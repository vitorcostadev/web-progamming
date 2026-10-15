export function validateWorkData(data) {
    const result = new ValidationResult();

    stringValidator(data, REQUIRED_STRING_FIELDS, result);
    minMaxValidator(data, result);
    yearValidator(data.work_year, result);
    selectValidator(data, result);

    return {
        isValid: result.isValid,
        errors: result.errors,
        data
    }
};

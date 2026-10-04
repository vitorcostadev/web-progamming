const test =  require('node:test');
const assert = require('node:assert/strict');
const { stringValidator, any } = require('./M2/src/js/constants.js');

const yearValidator = (year) => {
    const number = Number(year);

    return (
        Number.isInteger(number)
    );
};

const registerValidator = (
    work_name,
    actor,
    work_year,
    period_work,
    work_type,
    details
) => {
    const invalidNameFields = [
        work_name,
        actor,
        period_work,
        work_type
    ].filter((value) => !stringValidator(value));

    if (!yearValidator(work_year)) {
        invalidNameFields.push(work_year);
    }

    if (invalidNameFields.length > 0) {
        return invalidNameFields;
    }

    return true;
};


test('checkInvalidYear', () => {
    const result = registerValidator(
        "",
        "Actor Name",
        "Invalid Year",
        "Period Work",
        "Work Type",
        "Details"
    );
    assert.deepStrictEqual(result, ['', 'Invalid Year']);
});

test('checkInvalidWorkName', () => {
    const result = registerValidator(
        "",
        "Actor Name",
        2020,
        "Period Work",
        "Work Type",
        "Details"
    );
    assert.deepStrictEqual(result, ['']);
});

test('checkInvalidActor', () => {
    const result = registerValidator(
        "Work Name",
        "",
        2020,
        "Period Work",
        "Work Type",
        "Details"
    );
    assert.deepStrictEqual(result, ['']);
});

test('checkInvalidPeriodWork', () => {
    const result = registerValidator(
        "Work Name",
        "Actor Name",
        2020,
        "",
        "Work Type",
        "Details"
    );
    assert.deepStrictEqual(result, ['']);
});

test('checkInvalidWorkType', () => {
    const result = registerValidator(
        "Work Name",
        "Actor Name",
        2020,
        "Period Work",
        "",
        "Details"
    );
    assert.deepStrictEqual(result, ['']);
});
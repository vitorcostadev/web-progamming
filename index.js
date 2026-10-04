import test from 'node:test';
import assert from 'node:assert/strict';

import { stringValidator } from './M2/src/js/constants.js';

const yearValidator = (year) => {
    return Number.isInteger(Number(year));
};

const registerValidator = (
    work_name,
    actor,
    work_year,
    period_work,
    work_type,
    details
) => {
    const invalidFields = [
        work_name,
        actor,
        period_work,
        work_type
    ].filter((value) => !stringValidator(value));

    if (!yearValidator(work_year)) {
        invalidFields.push(work_year);
    }

    return invalidFields.length > 0
        ? invalidFields
        : true;
};

const validData = {
    work_name: "Work Name",
    actor: "Actor Name",
    work_year: 2020,
    period_work: "Period Work",
    work_type: "Work Type",
    details: "Details"
};

const testCases = [
    {
        name: "checkInvalidYear",
        data: {
            work_name: "",
            work_year: "Invalid Year"
        },
        expected: ["", "Invalid Year"]
    },
    {
        name: "checkInvalidWorkName",
        data: {
            work_name: ""
        },
        expected: [""]
    },
    {
        name: "checkInvalidActor",
        data: {
            actor: ""
        },
        expected: [""]
    },
    {
        name: "checkInvalidPeriodWork",
        data: {
            period_work: ""
        },
        expected: [""]
    },
    {
        name: "checkInvalidWorkType",
        data: {
            work_type: ""
        },
        expected: [""]
    }
];

testCases.forEach(({ name, data, expected }) => {
    test(name, () => {
        const values = {
            ...validData,
            ...data
        };

        const result = registerValidator(
            values.work_name,
            values.actor,
            values.work_year,
            values.period_work,
            values.work_type,
            values.details
        );

        assert.deepStrictEqual(result, expected);
    });
});
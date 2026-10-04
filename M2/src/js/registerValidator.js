const { any, stringValidator } = require("./constants.js");

var form = document.getElementById("museu-form");

const registerValidator = () => {
    const info = new FormData(form);
    
    const {
        work_name,
        actor,
        work_year,
        period_work,
        work_type,
        details
    } = Object.fromEntries(info);

    const invalidFields = [
        work_name,
        actor,
        period_work.value,
        work_type.value
    ].filter((value) => !stringValidator(value));

    if(Number.isInteger(Number(work_year))){
        invalidFields.push(work_year);
    }

    if(invalidFields.length > 0){
        //TODO
        return false;
    }

    return true;

};


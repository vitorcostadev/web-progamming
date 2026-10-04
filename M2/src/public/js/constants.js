export const stringValidator = (value) => {
    if (
        value.trim().length === 0 ||
        any(value.split(""), (char) => !isNaN(char) && char !== " ")
    ) {
        return false;
    }

    return true;
};

export const any = (array, callback) => {
    for (let i = 0; i < array.length; i++) {
        if(callback(array[i])) {
            return true;
        }
    }
    return false;
};
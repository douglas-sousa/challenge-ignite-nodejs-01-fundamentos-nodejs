class ValidatorError extends Error {
    constructor (message) {
        super(message);
    }
}

class Validator {
    #fieldName;
    #body;
    #isOptional;
    #validations = [];

    constructor (fieldName) {
        this.#fieldName = fieldName;
    }

    optional () {
        this.#isOptional = true;

        return this;
    }

    isString (message) {
        this.#validations.push(()  => {
            let isFieldValid = typeof this.#body?.[this.#fieldName] === 'string';
    
            if (this.#isOptional && !isFieldValid) {
                const isNil = this.#body?.[this.#fieldName] == null;
                isFieldValid = isNil;
            }

            if (isFieldValid) {
                return isFieldValid;
            }

            throw new ValidatorError(message || `Field ${this.#fieldName} missing or invalid`);
        });

        return this;
    }

    validate ({ body }) {
        this.#body = body;

        try {
            return this.#validations
                .every(validate => validate());
            
        } catch (error) {
            if (error instanceof ValidatorError) {
                return { errorMessage: error.message };
            }
        }
    }
}

function body (fieldName) {
    return new Validator(fieldName);
}

export default body;

import { ValidationOptions, registerDecorator } from "class-validator"
import { IsUniqueConstraint } from "./classes/isUniqueConstraint"
import { IsUniqueUserConstraint } from "./classes/isUniqueUserConstraint"

// decorator options interface
export type IsUniqueInterface = {
    tableName: string,
    column: string
}

// decorator function
export function isUniqueUser(options: IsUniqueInterface, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isUniqueUser',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsUniqueUserConstraint,
        })
    }
}

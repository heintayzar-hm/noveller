import { ValidationOptions, registerDecorator } from "class-validator"
import { IsUniqueConstraint } from "./classes/isUniqueConstraint"

// decorator options interface
export type IsUniqueInterface = {
    tableName: string,
    column: string
}

// decorator function
export function isUnique(options: IsUniqueInterface, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isUnique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsUniqueConstraint,
        })
    }
}

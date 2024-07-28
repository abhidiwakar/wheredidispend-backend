import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import * as dayjs from 'dayjs';

@ValidatorConstraint({ async: false })
export class IsCustomDateConstraint implements ValidatorConstraintInterface {
  validate(dateStr: any) {
    // Regular expression to match "YYYY-MM-DD hh:mm A" format
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2} (AM|PM)$/;
    if (!regex.test(dateStr)) {
      return false;
    }

    return dayjs(dateStr, 'YYYY-MM-DD hh:mm A', true).isValid();
  }

  defaultMessage(args: ValidationArguments) {
    return `Date (${args.value}) must be in the format "YYYY-MM-DD hh:mm A"`;
  }
}

export function IsCustomDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCustomDateConstraint,
    });
  };
}

// validate-one-or-the-other.decorator.ts
import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class OneOrTheOtherConstraint implements ValidatorConstraintInterface {
	validate(value: any, args: ValidationArguments) {
	  const [relatedPropertyName] = args.constraints;
	  const relatedValue = (args.object as any)[relatedPropertyName];
	  return (value && !relatedValue) || (!value && relatedValue);
	}
  
	defaultMessage(args: ValidationArguments) {
	  const [relatedPropertyName] = args.constraints;
	  return `Only one of ${args.property} or ${relatedPropertyName} should be provided.`;
	}
  }
  
  export function OneOrTheOther(
	property: string,
	validationOptions?: ValidationOptions,
  ) {
	return function (object: Object, propertyName: string) {
	  registerDecorator({
		target: object.constructor,
		propertyName: propertyName,
		options: validationOptions,
		constraints: [property],
		validator: OneOrTheOtherConstraint,
	  });
	};
  }
  
import { useState } from "react";

type ValidationType = 'email' | 'notEmpty' | 'positiveNumber' | 'notNull';

interface ValidationField {
  value: string | null;
  validation: ValidationType;
}

export const useValidator = (fields: Record<string, ValidationField>) => {

  // Inicializamos todos los campos como válidos
  const [validationStates, setValidationStates] = useState<Record<string, boolean>>(() =>
    Object.keys(fields).reduce((acc, fieldName) => ({
      ...acc,
      [fieldName]: true
    }), {})
  );

  const validateEmail = (email: string) => {
    // string@string@.string
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const validatePositiveNumber = (value: string) => {
    // Regex explanation:
    // ^        - start of string
    // [0-9]*   - zero or more digits
    // \.?      - optional decimal point
    // [0-9]+   - one or more digits after decimal point (if exists)
    // $        - end of string
    const re = /^[0-9]*\.?[0-9]+$/;

    if (!re.test(value)) {
      return false;
    }

    // Convert to number and check if it's >= 0
    const num = parseFloat(value);
    return num >= 0;
  };

  const isNotEmpty = (value: string) => {
    // Check if the value is not an empty string
    return value.trim() !== '';
  };

  const isNotNull = (value: any) => {
    return value !== null && value !== undefined;
  };

  const validateField = (value: string | null, type: ValidationType): boolean => {
    switch (type) {
      case 'email':
        return validateEmail(value as string);
      case 'notEmpty':
        return isNotEmpty(value as string);
      case 'positiveNumber':
        return validatePositiveNumber(value as string)
      case 'notNull':
        return isNotNull(value)
      default:
        return true;
    }
  };

  const validateSingle = (fieldName: string): boolean => {
    const field = fields[fieldName];
    if (!field) return true;

    const isValid = validateField(field.value, field.validation);
    setValidationStates(prev => ({
      ...prev,
      [fieldName]: isValid
    }));

    return isValid;
  };

  const validateAll = (): boolean => {
    // Create a new object to track validation results
    const newValidationStates: Record<string, boolean> = {};

    // Validate all fields and store results
    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      const isValid = validateField(field.value, field.validation);
      newValidationStates[fieldName] = isValid;
    });

    // Update state
    setValidationStates(newValidationStates);

    // Return whether all fields are valid
    return Object.values(newValidationStates).every(isValid => isValid);
  };

  return {
    validateAll,
    validateSingle,
    validationStates
  };
};
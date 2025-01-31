import { useState } from "react";

type ValidationType = 'email' | 'notEmpty';

interface ValidationField {
  value: string;
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

  const isNotEmpty = (value: string) => {
    // Check if the value is not an empty string
    return value.trim() !== '';
  };

  const validateField = (value: string, type: ValidationType): boolean => {
    switch (type) {
      case 'email':
        return validateEmail(value);
      case 'notEmpty':
        return isNotEmpty(value);
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
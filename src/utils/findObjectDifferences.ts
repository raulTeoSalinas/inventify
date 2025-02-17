export const findObjectDifferences = <T extends Record<string, any>>(
  original: T,
  current: T
): Partial<T> | null => {
  const differences: Partial<T> = {};

  // Iterate only over original object keys
  Object.keys(original).forEach((key) => {
    // For nested objects
    if (
      typeof original[key] === 'object' &&
      original[key] !== null &&
      typeof current[key] === 'object' &&
      current[key] !== null
    ) {
      const nestedDiff = compareNestedObjects(original[key], current[key]);
      if (nestedDiff) {
        differences[key as keyof T] = current[key];
      }
    }
    // For primitive values
    else if (key in current && original[key] !== current[key]) {
      differences[key as keyof T] = current[key];
    }
  });

  return Object.keys(differences).length > 0 ? differences : null;
};

const compareNestedObjects = (original: any, current: any): boolean => {
  // If both have ID, first compare that
  if ('id' in original && 'id' in current) {
    // If IDs are different, objects are different
    if (original.id !== current.id) return true;

    // If IDs are same, compare other properties
    for (const key of Object.keys(original)) {
      // Skip typename and other metadata
      if (key === '__typename') continue;

      if (
        key in current &&
        key !== 'id' &&
        JSON.stringify(original[key]) !== JSON.stringify(current[key])
      ) {
        return true;
      }
    }
  }

  return false;
};
// Helper function to remove __typename from objects recursively
export const removeTypename = (obj: any): any => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => removeTypename(item));
  }

  const newObj = { ...obj };
  if ('__typename' in newObj) {
    delete newObj.__typename;
  }

  // Recursively clean nested objects
  Object.keys(newObj).forEach(key => {
    if (typeof newObj[key] === 'object' && newObj[key] !== null) {
      newObj[key] = removeTypename(newObj[key]);
    }
  });

  return newObj;
};
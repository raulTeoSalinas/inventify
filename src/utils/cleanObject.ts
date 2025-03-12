type AnyObject = { [key: string]: any };

// This function removes the __typename property from an object or an array of objects.
// It also removes any nested object properties that are not the id property.
// It returns a new object or array of objects with the __typename property removed.
// It also returns a new object or array of objects with nested object properties when items are new (with no id property).
// It also converts the .quantity, .price, .quantity, .quantityRaw properties to numbers.
// It is used to clean the object before sending it to the server.
export const cleanObject = (input: AnyObject | AnyObject[]): AnyObject | AnyObject[] => {
  const cleanSingleObject = (obj: AnyObject): AnyObject => {
    const cleanedObject: AnyObject = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key === '__typename') {
          continue; // Skip the __typename property
        }
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          cleanedObject[key] = { id: obj[key].id };
        } else {
          cleanedObject[key] = obj[key];
        }

        // Convert .quantity, .price, .amount to numbers
        if (['quantity', 'price', 'quantity', 'quantityRaw'].includes(key)) {
          cleanedObject[key] = Number(obj[key]);
        }
      }
    }

    return cleanedObject;
  };

  if (Array.isArray(input)) {
    return input.map(item => cleanSingleObject(item));
  } else {
    return cleanSingleObject(input);
  }
};
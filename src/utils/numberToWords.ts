export const numberToWords = (num: number, language = 'ES') => {
  // Validación de entrada
  if (typeof num !== 'number' || num < 0 || num > 10000000) {
    return 'Número fuera de rango (0-10,000,000)';
  }

  // Separar parte entera y decimal
  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100); // Redondear a 2 decimales

  if (language === 'ES') {
    // Español
    const unidades = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const especiales = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    const convertThreeDigits = (n: number): string => {
      if (n === 0) return unidades[0];
      
      let result = '';
      
      // Centenas
      if (n >= 100) {
        if (n === 100) return 'cien';
        result += centenas[Math.floor(n / 100)] + ' ';
        n %= 100;
      }
      
      // Decenas y unidades
      if (n > 0) {
        if (n < 10) {
          result += unidades[n];
        } else if (n < 20) {
          result += especiales[n - 10];
        } else {
          const unidad = n % 10;
          const decena = Math.floor(n / 10);
          
          if (unidad === 0) {
            result += decenas[decena];
          } else if (decena === 2) {
            result += 'veinti' + unidades[unidad];
          } else {
            result += decenas[decena] + ' y ' + unidades[unidad];
          }
        }
      }
      
      return result.trim();
    };

    // Convertir parte entera
    let resultado = '';
    let tempNum = integerPart;
    
    // Casos especiales
    if (tempNum === 0) resultado = unidades[0];
    else if (tempNum === 1000000) resultado = 'un millón';
    else if (tempNum === 1000) resultado = 'mil';
    else {
      // Millones
      if (tempNum >= 1000000) {
        const millones = Math.floor(tempNum / 1000000);
        if (millones === 1) {
          resultado += 'un millón ';
        } else {
          resultado += convertThreeDigits(millones) + ' millones ';
        }
        tempNum %= 1000000;
      }
      
      // Miles
      if (tempNum >= 1000) {
        const miles = Math.floor(tempNum / 1000);
        if (miles === 1) {
          resultado += 'mil ';
        } else {
          resultado += convertThreeDigits(miles) + ' mil ';
        }
        tempNum %= 1000;
      }
      
      // Resto
      if (tempNum > 0) {
        resultado += convertThreeDigits(tempNum);
      }
    }
    
    // Añadir parte decimal si existe
    if (decimalPart > 0) {
      resultado += ' con ' + (decimalPart < 10 ? '0' + decimalPart : decimalPart);
    }
    
    return resultado.trim();
    
  } else if (language === 'EN') {
    // Inglés
    const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const convertHundreds = (n: number): string => {
      if (n === 0) return 'zero';
      
      let result = '';
      
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + ones[n % 10] : '');
      
      result = ones[Math.floor(n / 100)] + ' hundred';
      
      if (n % 100 !== 0) {
        result += ' ' + convertHundreds(n % 100);
      }
      
      return result;
    };
    
    // Convertir parte entera
    let result = '';
    let tempNum = integerPart;
    
    if (tempNum === 0) result = ones[0];
    else {
      // Millions
      if (tempNum >= 1000000) {
        result += convertHundreds(Math.floor(tempNum / 1000000)) + ' million ';
        tempNum %= 1000000;
      }
      
      // Thousands
      if (tempNum >= 1000) {
        result += convertHundreds(Math.floor(tempNum / 1000)) + ' thousand ';
        tempNum %= 1000;
      }
      
      // Hundreds
      if (tempNum > 0) {
        result += convertHundreds(tempNum);
      }
    }
    
    // Añadir parte decimal si existe
    if (decimalPart > 0) {
      result += ' with ' + (decimalPart < 10 ? '0' + decimalPart : decimalPart);
    }
    
    return result.trim();
  }
  
  return 'Idioma no soportado';
}
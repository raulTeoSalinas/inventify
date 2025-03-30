// React
import {useEffect, useState, useMemo} from 'react'
// React Native

// External Dependencies
// Internal Dependencies
import { useMainContext } from '../../../contexts/mainContext';
import { negativeToOposite } from '../../../utils/negativeToOposite';
import { Note } from '../../../viewModels/useNotes/useNotes.model';
import useThemeProvider from '../../../theme/ThemeProvider.controller';
import { useAppSelector } from '../../../store/hooks';
import { Unit } from '../../../viewModels/useUnits/useUnits.model';
import useTranslations from '../../../translations/useTranslations';

const useDashBoardView = () => {

  const segments = [
    'DASH_SEGMENT_DAY',
    'DASH_SEGMENT_WEEK',
    'DASH_SEGMENT_MONTH',
  ]

  const t = useTranslations();
  const [segmentSelected, setSegmentSelected] = useState(segments[0]);

  const { notes } = useMainContext();

  const [notesFiltered, setNotesFiltered] = useState<Note[]>([]);

  const [percentageDifference, setPercentageDifference] = useState<number>(0);
  
  // Función reutilizable para calcular el total de cualquier lista de notas
  const calculateTotal = (notesList: Note[] = []) => {
    return notesList.reduce((totalAcc, note) => {
      const noteTotal = note.transactions.reduce((acc, transaction) => {
        return acc + (transaction.price as number) * 
          (!transaction.idServices ? negativeToOposite(transaction.quantity as number) : 1);
      }, 0);
      return totalAcc + noteTotal;
    }, 0);
  };

    // Función para calcular el remaining (lo que falta por pagar) de una sola nota
  const calculateNoteRemaining = (note: Note) => {
    // Calcular el total de la nota
    const noteTotal = note.transactions.reduce((acc, transaction) => {
      return acc + (transaction.price as number) * (!transaction.idServices ? negativeToOposite(transaction.quantity as number) : 1);
    }, 0)
    
    // Calcular el total de pagos
    const paymentTotal = note.payments.reduce((acc, payment) => {
      const amount = payment.amount;
      const numericAmount = !isNaN(Number(amount)) ? Number(amount) : 0;
      return acc + numericAmount;
    }, 0);
    
    // Calcular lo que queda por pagar
    return  noteTotal - paymentTotal;
  };
  
  // Función reutilizable que devuelve el rango de fechas según el segmento
  const getDateRange = (segment: string) => {
    const today = new Date();
    
    // Para el período actual
    let currentStart: Date;
    let currentEnd: Date = new Date(today);
    currentEnd.setHours(23, 59, 59, 999);
    
    // Para el período anterior
    let previousStart: Date;
    let previousEnd: Date;
    
    if (segment === segments[0]) { // Día
      // Período actual = hoy
      currentStart = new Date(today);
      currentStart.setHours(0, 0, 0, 0);
      
      // Período anterior = ayer
      previousEnd = new Date(today);
      previousEnd.setDate(today.getDate() - 1);
      previousEnd.setHours(23, 59, 59, 999);
      
      previousStart = new Date(previousEnd);
      previousStart.setHours(0, 0, 0, 0);
    } 
    else if (segment === segments[1]) { // Semana
      const currentDay = today.getDay();
      const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1;
      
      // Período actual = esta semana (lunes a domingo)
      currentStart = new Date(today);
      currentStart.setDate(today.getDate() - daysToSubtract);
      currentStart.setHours(0, 0, 0, 0);
      
      // Período anterior = semana anterior
      previousStart = new Date(currentStart);
      previousStart.setDate(currentStart.getDate() - 7);
      
      previousEnd = new Date(currentStart);
      previousEnd.setDate(previousStart.getDate() + 6);
      previousEnd.setHours(23, 59, 59, 999);
    } 
    else { // Mes
      // Período actual = este mes
      currentStart = new Date(today.getFullYear(), today.getMonth(), 1);
      currentStart.setHours(0, 0, 0, 0);
      
      // Período anterior = mes anterior
      previousStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      previousStart.setHours(0, 0, 0, 0);
      
      previousEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      previousEnd.setHours(23, 59, 59, 999);
    }
    
    return { currentStart, currentEnd, previousStart, previousEnd };
  };
  
  // Función para filtrar notas por rango de fechas
  const filterNotesByDateRange = (notesList: Note[] = [], startDate: Date, endDate: Date) => {
    return notesList.filter(note => {
      const date = new Date(note.dateMade);
      return date >= startDate && date <= endDate;
    });
  };
  
  useEffect(() => {
    if (!notes.all?.list) return;
    
    const { currentStart, currentEnd, previousStart, previousEnd } = getDateRange(segmentSelected);
    
    // Filtrar para el período actual
    const filteredNotes = filterNotesByDateRange(notes.all.list, currentStart, currentEnd);
    setNotesFiltered(filteredNotes);
    
    // Calcular el total actual
    const currentTotal = calculateTotal(filteredNotes);
    
    // Filtrar y calcular para el período anterior
    const previousNotes = filterNotesByDateRange(notes.all.list, previousStart, previousEnd);
    const previousTotal = calculateTotal(previousNotes);
    
    // Calcular el porcentaje de diferencia
    let difference = 0;
    if (previousTotal === 0) {
      difference = currentTotal > 0 ? 100 : 0;
    } else {
      difference = ((currentTotal - previousTotal) / previousTotal) * 100;
    }
    
    setPercentageDifference(difference);
    
  }, [notes.all?.list, segmentSelected]);
  
  // Podemos acceder a los valores calculados directamente
  const totalByNotesFiltered = calculateTotal(notesFiltered);
  const totalRemainingByNotesFiltered = notesFiltered.reduce((acc, note) => {
    return acc + calculateNoteRemaining(note);
  }, 0);

  // Función para obtener el producto más vendido de las notas filtradas
  const getMostSoldProduct = () => {
    // Crear un objeto para almacenar las cantidades vendidas por producto
    const productCounts: { [key: string]: { quantity: number, description: string, unit: Unit } } = {};
    
    // Recorrer todas las notas filtradas
    notesFiltered.forEach(note => {
      // Recorrer todas las transacciones de cada nota
      note.transactions.forEach(transaction => {
        // Solo contar si es una venta (no un servicio)
        if (!transaction.idServices) {
          const product = transaction.idFabricatedProducts || transaction.idRawProducts;
          if (!product) return; // Si no producto producto, continuar
          const productId = product.id;
          if (!productId) return; // Si no hay ID, continuar
          const productName = product.description;
          if (!productName) return; // Si no hay nombre, continuar
          const productUnit = product.idUnits;
          if (!productUnit) return; // Si no hay unidad, continuar
          const quantity = transaction.quantity ? Math.abs(Number(transaction.quantity)) : 0;
          // Si el producto ya existe en nuestro conteo, incrementar cantidad
          if (productCounts[productId]) {
            productCounts[productId].quantity += quantity;
          } else {
            // Si es la primera vez que vemos este producto, inicializarlo
            productCounts[productId] = {
              quantity,
              description: productName,
              unit: productUnit,
            };
          }
        }
      });
    });
    
    // Convertir el objeto a un array para poder ordenarlo
    const productsArray = Object.keys(productCounts).map(id => ({
      id,
      ...productCounts[id]
    }));
    
    // Ordenar por cantidad (de mayor a menor)
    productsArray.sort((a, b) => b.quantity - a.quantity);
    
    // Devolver el primer elemento (el más vendido) o null si no hay productos
    return productsArray.length > 0 ? productsArray[0] : null;
  };

  // Obtener el producto más vendido
  const mostSoldProduct = getMostSoldProduct();

  const theme = useThemeProvider();

  const language = useAppSelector((state) => state.config.language);

  const getTranslatedUnit = (item: Unit) => {
    return language === "EN" ? item.nameEng : item.nameSpa;
  }


  const calculateNoteTotal = (note: Note): number => {
    return note.transactions.reduce((acc, transaction) => {
      return acc + (transaction.price as number) * 
        (!transaction.idServices ? negativeToOposite(transaction.quantity as number) : 1);
    }, 0);
  };

  // Generar datos para el gráfico según el segmento seleccionado
  const chartData = useMemo(() => {
    if (!notes.all?.list) return { labels: [], datasets: [] };

    const today = new Date();
    let labels: string[] = [];
    let data: number[] = [];
    
    if (segmentSelected === segments[0]) {
      // Vista diaria (lunes a domingo)
      labels = [t('DASH_MON'), t('DASH_TUE'), t('DASH_WED'), t('DASH_THU'), t('DASH_FRI'), t('DASH_SAT'), t('DASH_SUN')];
      
      // Obtener el inicio de la semana actual (lunes)
      const currentDay = today.getDay() || 7; // Convierte 0 (domingo) a 7
      const daysToSubtract = currentDay - 1;
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - daysToSubtract);
      startOfWeek.setHours(0, 0, 0, 0);
      
      // Inicializar datos en cero
      data = Array(7).fill(0);
      
      // Agrupar notas por día de la semana (solo de la semana actual)
      notes.all.list.forEach(note => {
        const noteDate = new Date(note.dateMade);
        
        // Verificar si la nota pertenece a la semana actual
        const noteDateStart = new Date(noteDate);
        noteDateStart.setHours(0, 0, 0, 0);
        
        // Calcular inicio y fin de la semana actual
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        // Solo procesar notas de la semana actual
        if (noteDateStart >= startOfWeek && noteDateStart <= endOfWeek) {
          const dayOfWeek = noteDate.getDay() || 7; // Convierte 0 (domingo) a 7
          const dayIndex = dayOfWeek - 1; // Índice 0 es lunes
          
          if (dayIndex >= 0 && dayIndex < 7) {
            data[dayIndex] += calculateNoteTotal(note);
          }
        }
      });
      
    } else if (segmentSelected === segments[1]) {
      // Vista semanal (semanas del mes)
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      // Determinar el número de semanas en el mes actual
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      
      // Inicializar semanas
      const weeksInMonth = Math.ceil((lastDayOfMonth.getDate() + firstDayOfMonth.getDay()) / 7);
      labels = Array(weeksInMonth).fill(0).map((_, i) => `${t('DASH_WEEK')} ${i + 1}`);
      data = Array(weeksInMonth).fill(0);
      
      // Agrupar notas por semana del mes
      notes.all.list.forEach(note => {
        const noteDate = new Date(note.dateMade);
        
        // Solo procesar notas del mes actual
        if (noteDate.getMonth() === currentMonth && noteDate.getFullYear() === currentYear) {
          // Calcular a qué semana pertenece
          const dayOfMonth = noteDate.getDate();
          const dayOfWeek = noteDate.getDay() || 7;
          const weekOfMonth = Math.ceil((dayOfMonth + firstDayOfMonth.getDay() - 1) / 7) - 1;
          
          if (weekOfMonth >= 0 && weekOfMonth < weeksInMonth) {
            data[weekOfMonth] += calculateNoteTotal(note);
          }
        }
      });
      
    } else if (segmentSelected === segments[2]) {
      // Vista mensual (meses del año)
      labels = [t('DASH_JAN'), t('DASH_FEB'), t('DASH_MAR'), t('DASH_APR'), t('DASH_MAY'), t('DASH_JUN'), t('DASH_JUL'), t('DASH_AUG'), t('DASH_SEP'), t('DASH_OCT'), t('DASH_NOV'), t('DASH_DEC')];
      data = Array(12).fill(0);
      
      const currentYear = today.getFullYear();
      
      // Agrupar notas por mes
      notes.all.list.forEach(note => {
        const noteDate = new Date(note.dateMade);
        
        // Solo procesar notas del año actual
        if (noteDate.getFullYear() === currentYear) {
          const month = noteDate.getMonth();
          data[month] += calculateNoteTotal(note);
        }
      });
    }
    
    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(0, 191, 255, ${opacity})`,
          strokeWidth: 2
        }
      ],
    };
  }, [notes, segmentSelected, segments]);

  return {
    totalByNotesFiltered,
    totalRemainingByNotesFiltered,
    percentageDifference,
    mostSoldProduct,
    segmentSelected,
    setSegmentSelected,
    chartData,
    segments,
    theme,
    getTranslatedUnit
  }
}

export default useDashBoardView;


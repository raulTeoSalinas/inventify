// React
import React, { useEffect, useState } from 'react'
// React Native
import { View } from "react-native"
// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout,
  ScrollView,
  SegmentedControl,
  Text,
  CardLayout,
  SectionHeader,
  Separator
} from "../../../designSystem"

// External Dependencies
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// Internal Dependencies
import useRoute from '../../../navigation/useRoute/useRoute';
import { RootStackParamList } from "../../../navigation/StackNavigation/StackNavigation";
import { negativeToOposite } from '../../../utils/negativeToOposite';
import { useMainContext } from '../../../contexts/mainContext';
import { Note } from '../../../viewModels/useNotes/useNotes.model';
import { formatCurrency } from '../../../utils/formatCurrency';
import { Row } from './CalculateComissionView.styles';

export type CalculateComissionViewProps = NativeStackScreenProps<RootStackParamList, "CalculateComissionView">;




const useCalculateComissionView = () => {

  const segmentsOptions = ["CALCULATE_COMISSIONS_DAY", "CALCULATE_COMISSIONS_WEEK"]
  const [selectedSegment, setSelectedSegment] = useState(segmentsOptions[0]);
  const route = useRoute({ screenName: "CalculateComissionView" });

  const { seller } = route.params || {};

  const { notes } = useMainContext();

  const [notesFiltered, setNotesFiltered] = useState(notes.all.list ?? []);

  useEffect(() => {
    if (notes.all.list) {
      const filtered = notes.all.list.filter((note) => {
        // Convertir la fecha de la nota a objeto Date
        const noteDate = new Date(note.dateMade);
        const selectedDate = new Date();

        if (selectedSegment === segmentsOptions[0]) {
          // Filtrar por día - deben tener la misma fecha (año, mes, día)
          return (
            noteDate.getFullYear() === selectedDate.getFullYear() &&
            noteDate.getMonth() === selectedDate.getMonth() &&
            noteDate.getDate() === selectedDate.getDate()
          );
        } else if (selectedSegment === segmentsOptions[1]) {
          // Filtrar por semana - necesitamos calcular el inicio y fin de la semana
          // donde el lunes es el primer día y el domingo el último

          // Clonar la fecha seleccionada para no modificar el estado original
          const currentDate = new Date(selectedDate);

          // Obtener el día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)
          const dayOfWeek = currentDate.getDay();

          // Calcular cuántos días restar para llegar al lunes (inicio de semana)
          // Si es domingo (0), restamos 6 días para llegar al lunes anterior
          const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

          // Establecer la fecha al lunes (inicio de la semana)
          const startOfWeek = new Date(currentDate);
          startOfWeek.setDate(currentDate.getDate() - daysToSubtract);
          startOfWeek.setHours(0, 0, 0, 0);

          // Establecer la fecha al domingo (fin de la semana)
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);

          // Comprobar si la fecha de la nota está dentro del rango de la semana
          return noteDate >= startOfWeek && noteDate <= endOfWeek;
        }

        return true; // Por defecto, incluir todas las notas si no hay filtro
      });

      setNotesFiltered(filtered);

    }
  }, [notes.all.list, selectedSegment]);


  function calculateCommissions(notes: Note[]) {
    // Objeto para almacenar las comisiones totales
    const commissions: {
      byNotes: Array<{
        noteID: string;
        total: number;
        products: Array<{
          commissionAmount: number;
          description: string;
        }>;
      }>;
      total: number;
    } = {
      byNotes: [],
      total: 0
    };

    // Iterar sobre todas las notas
    notes.forEach(note => {
      // Crear un objeto para almacenar los productos de esta nota
      const noteCommission = {
        noteID: note.id,
        total: 0,
        products: [] as Array<{
          commissionAmount: number;
          description: string;
        }>
      };

      // Iterar sobre todas las transacciones de la nota
      note.transactions.forEach(transaction => {
        // Obtener el ID del producto
        const productId = transaction.idFabricatedProducts?.id || transaction.idRawProducts?.id;
        const productDescription = transaction.idFabricatedProducts?.description || transaction.idRawProducts?.description || "Desconocido";

        if (!productId) return;

        // Buscar el esquema de comisión correspondiente
        const scheme = seller.comissionSchemes.find(scheme => {
          const schemeProductId = scheme.idFabricatedProducts?.id || scheme.idRawProducts?.id;
          return productId === schemeProductId;
        });

        if (!scheme) return;

        const isCustomerOfSeller = seller.customers.some(
          (customer) => customer.id === note.idCustomers?.id
        );

        // Si no corresponde a los clientes del vendedor, no incluirla
        if (!isCustomerOfSeller) return;

        // Convertir cantidad negativa a positiva
        const quantity = negativeToOposite(Number(transaction.quantity));

        // Calcular comisión según el tipo
        let commissionAmount = 0;

        switch (scheme.type) {
          case "FIXED":
            commissionAmount = quantity * (scheme.amount || 0);
            break;

          case "PERCENTAGE":
            commissionAmount = (quantity * Number(transaction.price)) * ((scheme.amount || 0) / 100);
            break;

          case "DIFFERENCE":
            if (transaction.idFabricatedProducts?.wholesalePrice || transaction.idRawProducts?.wholesalePrice) {
              const wholesalePrice = transaction.idFabricatedProducts?.wholesalePrice || transaction.idRawProducts?.wholesalePrice;
              const wholesaleTotal = quantity * (wholesalePrice || 0);
              const actualTotal = quantity * Number(transaction.price);
              commissionAmount = actualTotal - wholesaleTotal;
            }
            break;
        }

        // Buscar si ya tenemos este producto en la lista de productos de la nota
        const existingProductIndex = noteCommission.products.findIndex(
          p => p.description === productDescription
        );

        if (existingProductIndex !== -1) {
          // Si ya existe, actualizar el monto de comisión
          noteCommission.products[existingProductIndex].commissionAmount += commissionAmount;
        } else {
          // Si no existe, agregar nuevo producto
          noteCommission.products.push({
            commissionAmount,
            description: productDescription
          });
        }

        // Actualizar total de la nota
        noteCommission.total += commissionAmount;

        // Actualizar total general
        commissions.total += commissionAmount;
      });

      // Solo agregamos la nota si tiene productos con comisión
      if (noteCommission.products.length > 0) {
        // Verificar si ya existe una nota con este ID
        const existingNoteIndex = commissions.byNotes.findIndex(n => n.noteID === note.id);

        if (existingNoteIndex !== -1) {
          // Si ya existe, fusionar los productos y actualizar el total
          let totalToAdd = 0;

          noteCommission.products.forEach(product => {
            const existingProductIndex = commissions.byNotes[existingNoteIndex].products.findIndex(
              p => p.description === product.description
            );

            if (existingProductIndex !== -1) {
              // Actualizar monto de comisión si ya existe el producto
              commissions.byNotes[existingNoteIndex].products[existingProductIndex].commissionAmount += product.commissionAmount;
            } else {
              // Agregar nuevo producto a la nota existente
              commissions.byNotes[existingNoteIndex].products.push(product);
            }

            totalToAdd += product.commissionAmount;
          });

          // Actualizar el total de la nota
          commissions.byNotes[existingNoteIndex].total += totalToAdd;
        } else {
          // Si no existe, agregar la nueva nota
          commissions.byNotes.push(noteCommission);
        }
      }
    });

    return commissions;
  }

  const comissions = calculateCommissions(notesFiltered);

  return {
    comissions,
    segmentsOptions,
    selectedSegment,
    setSelectedSegment,
    seller,
  }
}

export default useCalculateComissionView;


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
import { Transaction } from '../../../viewModels/useTransactions/useTransactions.model';

export type CalculateComissionViewProps = NativeStackScreenProps<RootStackParamList, "CalculateComissionView">;




const useCalculateComissionView = () => {

  const route = useRoute({ screenName: "CalculateComissionView" });

  const { seller } = route.params || {};

  const { notes } = useMainContext();

  const calculateTotalAmount = (transactions: Transaction[]): number => {
    return transactions.reduce((total, transaction) => {
      // Verificar que precio y cantidad no sean undefined y convertirlos a números
      const price = Number(transaction.price) || 0;
      const quantity = Math.abs(Number(transaction.quantity) || 1); // IF quantity is 0, set it to 1 for services

      return total + (price * quantity);
    }, 0);
  };
  
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

      if (note.isComissionPaid) return;

      const totalAmount = calculateTotalAmount(note.transactions as Transaction[]);
  
      const totalPayments = note.payments.reduce((acc, payment) => {
        return acc + Number(payment.amount);
      }, 0);

      // Si la nota no tiene pagos o el total de pagos es mayor al total de la nota, no calcular comisiones
      if (totalPayments < totalAmount) return;

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

  const comissions = calculateCommissions(notes.all.list || []);

  return {
    comissions,
    seller,
    notes
  }
}

export default useCalculateComissionView;


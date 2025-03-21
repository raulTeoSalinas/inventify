
// React
import React from 'react';
// React Native
import { FlatList } from "react-native";
// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout,
  CardLayout,
  Text,
  Separator
} from "../../../designSystem";
import { TransactionsViewProps } from "./TransactionsView.model";
import useTransactionsView from "./TransactionsView.controller";
import { Transaction } from "../../../viewModels/useTransactions/useTransactions.model";
import { Row, TransactionBadge } from "./TransactionsView.styles";

const TransactionsView: React.FC<TransactionsViewProps> = (props) => {

  const {
    product
  } = useTransactionsView()

  type TransactionsCardProps = {
    item: Transaction
  };



  const TransactionsCard = ({ item }: TransactionsCardProps) => {

    const isoDate = item?.date_created;
    const date = isoDate ? new Date(isoDate).toLocaleString() : new Date().toLocaleString();


    const getDescription = (description: 'Added' | 'Discounted By Fabricated' | 'Discounted By Note'): string => {
      const descriptionMap = {
        'Added': 'CATA_TRANS_ADDED',
        'Discounted By Fabricated': 'CATA_TRANS_DISC_FAB',
        'Discounted By Note': 'CATA_TRANS_DISC_NOTE'
      };

      return descriptionMap[description] || description;
    };

    const isDiscount = item.description.startsWith("Discoun");

    const formatQuantity = (value) => {
      // Primero convertimos a número para asegurarnos
      const num = Number(value);

      // Si es un número entero, no mostramos decimales
      if (Number.isInteger(num)) {
        return num > 0 ? `+${num}` : `${num}`;
      }

      // Si tiene decimales, redondeamos a 3 pero eliminamos ceros finales
      const fixed = num.toFixed(3);
      const trimmed = fixed.replace(/\.?0+$/, '');

      return num > 0 ? `+${trimmed}` : trimmed;
    };

    const quantity = formatQuantity(item.quantity);

    return (
      <CardLayout style={{ marginHorizontal: 12, marginVertical: 4 }}>
        <Row>
          <Text bold size="extraSmall" copyID={`ID:`} />
          <Text size="extraSmall" copyID={item.id ?? ""} />
        </Row>
        <Separator />
        <Row>
          <Text bold size="extraSmall" copyID="CATA_TRANS_DATETIME" />
          <Text size="extraSmall" copyID={date} />
        </Row>
        <Row>
          <Text bold size="extraSmall" copyID="CATA_TRANS_DESCRIPTION" />
          <TransactionBadge isDiscount={isDiscount}>
            <Text color={isDiscount ? "error" : "success"} bold size="extraSmall" copyID={getDescription(item.description)} />
          </TransactionBadge>
        </Row>
        <Row>
          <Text bold size="extraSmall" copyID="CATA_TRANS_QUANTITY" />

          <Text color={isDiscount ? "error" : "success"} bold size="small" copyID={quantity} />

        </Row>
      </CardLayout>
    );
  };

  return (
    <ViewLayout>

      <Header copyIDDescription="CATA_TRANS_DESC" backButton headerSize="extraLarge" copyIDTitle="CATA_TRANS_TITLE" />
      <Text style={{ marginHorizontal: 12, marginBottom: 12 }} copyID={`• ${product.description}`} />
      <FlatList
        data={product?.transactions}
        renderItem={({ item }) => (
          <TransactionsCard item={item} />
        )}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        keyExtractor={(item) => (item.id ?? '').toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={<Text textAlign="center" copyID="CATA_SEARCHER_EMPTY" />}
      />

    </ViewLayout>
  )
}

export default TransactionsView;


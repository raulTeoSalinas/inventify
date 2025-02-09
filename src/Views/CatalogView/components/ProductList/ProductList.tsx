
// React
import React from 'react';
// React Native
import { FlatList } from "react-native";
// Internal Dependencies
import ProductCard from "../ProductCard/ProductCard";
import { ProductListProps } from "./ProductList.model";


const ProductList: React.FC<ProductListProps> = ({ onScroll, products }) => {


  return (

    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingBottom: 120 }}
      onScroll={onScroll}
    />

  )
}

export default ProductList;


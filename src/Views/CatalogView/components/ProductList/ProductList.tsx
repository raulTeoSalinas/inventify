
// React
import React from 'react';
// React Native
import { FlatList } from "react-native";
// Internal Dependencies
import ProductCard from "../ProductCard/ProductCard";
import { ProductListProps } from "./ProductList.model";



const products = [
  { id: 1, description: 'Tornillo cruz 4"', units: 358, unit: "pz" },
  { id: 2, description: 'Mariposa chica', units: 760, unit: "pz" },
  { id: 3, description: 'Lámina acero 1/4"', units: 2300, unit: "kg" },
  { id: 4, description: 'Lámina aluminio 1/8"', units: 700, unit: "kg" },
  { id: 5, description: 'Placa acero inoxidable 3/16"', units: 1800, unit: "kg" },
  { id: 6, description: 'Tubo redondo galvanizado 2"', units: 4500, unit: "kg" },
  { id: 7, description: 'Tuerca hexagonal M10', units: 670, unit: "pz" },
  { id: 8, description: 'Varilla corrugada 3/8"', units: 3000, unit: "kg" },
  { id: 9, description: 'Chapa galvanizada 18"', units: 1200, unit: "kg" },
  { id: 10, description: 'Perfil cuadrado 1.5"', units: 3400, unit: "kg" },
  { id: 11, description: 'Alambre galvanizado 2mm', units: 8000, unit: "kg" },
  { id: 12, description: 'Arandela plana M12', units: 560, unit: "pz" },
  { id: 13, description: 'Soporte en "L" acero', units: 900, unit: "pz" },
  { id: 14, description: 'Cinta perforada metálica', units: 1500, unit: "pz" }
];

const ProductList: React.FC<ProductListProps> = ({ onScroll }) => {


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


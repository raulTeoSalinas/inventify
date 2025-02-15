
// React
import React from 'react';
// React Native
import { FlatList } from "react-native";
// Internal Dependencies
import ProductCard from "../ProductCard/ProductCard";
import { ProductListProps, ProductItem } from "./ProductList.model";
import ServiceCard from "../ServiceCard/ServiceCard";
import { Service } from "../../../../../viewModels/useServices/useServices.model";
import { RawProduct } from "../../../../../viewModels/useRawProducts/useRawProducts.model";
import { FabricatedProduct } from "../../../../../viewModels/useFabricatedProducts/useFabricatedProducts.model";
import { Text } from "../../../../../designSystem";


const ProductList: React.FC<ProductListProps> = ({ onScroll, products }) => {


  return (

    <FlatList<ProductItem>
      data={products}
      renderItem={({ item }) => (
        item?.__typename === "services" ?
          <ServiceCard
            service={item as Service}
          />
          :
          <ProductCard
            product={item as RawProduct | FabricatedProduct}
          />
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingBottom: 120 }}
      onScroll={onScroll}
      ListEmptyComponent={<Text textAlign="center" copyID="CATA_SEARCHER_EMPTY" />}
    />

  )
}

export default ProductList;


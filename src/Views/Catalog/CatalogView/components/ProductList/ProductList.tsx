
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
import useNavigation from "../../../../../navigation/useNavigation/useNavigation";


const ProductList: React.FC<ProductListProps> = ({ onScroll, products }) => {

  const navigation = useNavigation()

  const handleEditProduct = (item: RawProduct | FabricatedProduct) => {
    // Podemos usar la propiedad __typename para verificar el tipo
    if (item.__typename === 'rawProducts') {
      // TypeScript sabrá que dentro de este if, item es de tipo RawProduct
      navigation.navigate('CURawMaterialView', {
        rawProduct: item as RawProduct
      });
      return
    }
    if (item.__typename === 'fabricatedProducts') {
      // TypeScript sabrá que dentro de este if, item es de tipo Fabricated
      navigation.navigate("CUFabricatedView", {
        fabricatedProduct: item as FabricatedProduct
      });
      return
    }
  }

  const handleEditService = (item: Service) => {
    navigation.navigate("CUServicesView", {
      service: item
    })
  }

  return (

    <FlatList<ProductItem>
      data={products}
      renderItem={({ item }) => (
        item?.__typename === "services" ?
          <ServiceCard
            service={item as Service}
            onEditPress={() => handleEditService(item as Service)}
          />
          :
          <ProductCard
            onEditPress={() => handleEditProduct(item as (RawProduct | FabricatedProduct))}
            product={item as (RawProduct | FabricatedProduct)}
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


import React from "react";
import { RawProduct } from "../../../../viewModels/useRawProducts/useRawProducts.model";
import { FabricatedProduct } from "../../../../viewModels/useFabricatedProducts/useFabricatedProducts.model";
import { Service } from "../../../../viewModels/useServices/useServices.model";
import { CatalogType } from "../../CatalogView.model";

export type ProductListProps = {
  onScroll: () => void;
  products: CatalogType[]
}

export type ProductItem = (RawProduct | FabricatedProduct | Service) & {
  __typename?: string;
};

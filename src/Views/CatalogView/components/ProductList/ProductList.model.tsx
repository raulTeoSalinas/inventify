import React from "react";
import { RawProduct } from "../../../../viewModels/useRawProducts/useRawProducts";

export type ProductListProps = {
  onScroll: () => void;
  products: RawProduct[] | undefined
}


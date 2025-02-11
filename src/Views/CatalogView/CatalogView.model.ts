// External Dependencies
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
// Internal Dependencies
import { RootTabParamList } from "../../navigation/BottomTabNavigation/BottomTabNavigation"
import { RawProduct } from "../../viewModels/useRawProducts/useRawProducts.model";
import { FabricatedProduct } from "../../viewModels/useFabricatedProducts/useFabricatedProducts.model";
import { Service } from "../../viewModels/useServices/useServices.model";

export type CatalogViewProps = BottomTabScreenProps<RootTabParamList, "CatalogView">;


export type CatalogType = RawProduct | FabricatedProduct | Service;

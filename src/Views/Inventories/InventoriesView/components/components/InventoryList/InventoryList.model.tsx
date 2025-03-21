import { Inventory } from "../../../../../../viewModels/useInventories/useInventories.model";


export type InventoryListProps = {
  onScroll?: () => void;
  inventories: Inventory[]
}




// React
import React, { useCallback, useState } from 'react';
// React Native
import { FlatList, View, TextInput as RNTextInput } from "react-native";
// External Dependencies
import { BottomSheetFooter, BottomSheetFooterProps } from '@gorhom/bottom-sheet';// Internal dependencies
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Internal Dependencies
import ProductCard from "../ProductCard/ProductCard";
import { ProductListProps, ProductItem } from "./ProductList.model";
import { Service } from "../../../../../../viewModels/useServices/useServices.model";
import { RawProduct } from "../../../../../../viewModels/useRawProducts/useRawProducts.model";
import { FabricatedProduct } from "../../../../../../viewModels/useFabricatedProducts/useFabricatedProducts.model";
import { Text, Modal, Icon, Button, TextInput, Toggle } from "../../../../../../designSystem";
import useNavigation from "../../../../../../navigation/useNavigation/useNavigation";
import { FooterContainer } from "../../../../../../designSystem/molecules/SelectInput/SelectInput.styles";
import { useValidator } from "../../../../../../hooks/useValidator/useValidator";
import { useAppSelector, useAppDispatch } from "../../../../../../store/hooks";
import { Unit } from "../../../../../../viewModels/useUnits/useUnits.model";
import useTransactions from "../../../../../../viewModels/useTransactions/useTransactions";
import { useMainContext } from "../../../../../../contexts/mainContext";
import { useToast } from "../../../../../../hooks/useToast/useToast";
import { setDiscountRaw } from "../../../../../../store/slices/configSlice";
import { Transaction } from "../../../../../../viewModels/useTransactions/useTransactions.model";

const InventoriesList: React.FC<ProductListProps> = ({ onScroll, products }) => {

  const navigation = useNavigation()

  const discountRaw = useAppSelector((state) => state.config.discountRaw);

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

  const { rawProducts, fabricatedProducts } = useMainContext()
  const [addModalVisible, setAddModalVisible] = useState(false)

  const insets = useSafeAreaInsets()

  const paddingBottom = insets.bottom === 0 ? 20 : insets.bottom;

  const handleCancel = () => {
    setQuantityToAdd("")
    setAddModalVisible(false)
  }

  const [quantityToAdd, setQuantityToAdd] = useState("")
  const [productSelectedToAdd, setProductSelectedToAdd] = useState<FabricatedProduct | RawProduct | null>(null)

  const { validateAll, validateSingle, validationStates } = useValidator({
    quantityToAdd: { value: quantityToAdd, validation: "positiveNumber" }
  })

  const transactions = useTransactions();

  const { showToast } = useToast();

  const handleAdd = async () => {

    const isValidated = validateAll()

    if (!isValidated) return;

    if (productSelectedToAdd?.__typename === "rawProducts") {

      try {
        await transactions.crud.create({
          description: 'Added',
          idRawProducts: { id: productSelectedToAdd?.id },
          quantity: Number(quantityToAdd)
        })
        showToast({
          type: "success",
          title: "GENERAL_SUCCESS_TOAST",
          message: "CATA_ENTER_TOAST_SUCCESS"
        })
      } catch {
        showToast({
          type: "error",
          title: "CATA_ENTER_TOAST_ERROR",
          message: "GENERAL_BANNER_MESSAGE"
        })
      }
      setAddModalVisible(false)

      setQuantityToAdd("");
      await rawProducts.all.refetch();

      return;
    }

    if (productSelectedToAdd?.__typename === "fabricatedProducts") {
      try {
        if (!discountRaw) {

          await transactions.crud.create({
            description: 'Added',
            idFabricatedProducts: { id: productSelectedToAdd?.id },
            quantity: Number(quantityToAdd)
          })
        } else {

          const transactionsToCreate: Partial<Transaction>[] = [{
            description: 'Added',
            idFabricatedProducts: { id: productSelectedToAdd?.id },
            quantity: Number(quantityToAdd)
          }];

          if ('rawProducts' in productSelectedToAdd && productSelectedToAdd?.rawProducts && productSelectedToAdd?.rawProducts.length > 0) {
            for (let i = 0; i < productSelectedToAdd?.rawProducts.length; i++) {
              const rawProduct = productSelectedToAdd?.rawProducts[i];

              // Calculate how many raw products are used based on quantity added
              // Each fabricated product requires quantityRaw units of each raw material
              const quantityUsed = Number(rawProduct.quantityRaw) * Number(quantityToAdd);

              // Add transaction for the raw product
              transactionsToCreate.push({
                quantity: -quantityUsed, // Negative because it's being used/consumed
                description: "Discounted By Fabricated",
                idRawProducts: { id: rawProduct?.rawProducts_id?.id }
              });
            }
          }

          await transactions.crud.createMultiple(transactionsToCreate)
          showToast({
            type: "success",
            title: "GENERAL_SUCCESS_TOAST",
            message: "CATA_ENTER_TOAST_SUCCESS"
          })
        }

        await rawProducts.all.refetch();
        await fabricatedProducts.all.refetch();
        setAddModalVisible(false)
      } catch {
        showToast({
          type: "error",
          title: "CATA_ENTER_TOAST_ERROR",
          message: "GENERAL_BANNER_MESSAGE"
        })
      }

      return
    }
  }

  const handleAddProduct = (item: RawProduct | FabricatedProduct) => {
    setAddModalVisible(true)
    setProductSelectedToAdd(item);
  }

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <FooterContainer paddingBottom={paddingBottom}>
          <Button onPress={handleCancel} backgroundColor="white" style={{ flex: 1 }} size="large" copyID="GENERAL_CANCEL" />
          <Button loading={transactions.crud.isLoading} onPress={handleAdd} style={{ flex: 1 }} size="large" copyID="CATA_CREATE_ENTER" />
        </FooterContainer>
      </BottomSheetFooter>
    ),
    [handleAdd, paddingBottom, handleCancel]
  );

  const language = useAppSelector((state) => state.config.language);

  const getTranslatedUnit = (item: Unit) => {
    return language === "EN" ? item.nameEng : item.nameSpa;
  }

  const dispatch = useAppDispatch();
  const changeDiscount = (value: boolean) => {
    dispatch(setDiscountRaw(value));
  }

  const onDismissModal = () => {
    setQuantityToAdd("");
    setAddModalVisible(false)
  }

  const getQuantityRaw = (rawProduct) => {

    const result = Number(quantityToAdd) * Number(rawProduct.quantityRaw);

    if (Number.isInteger(result)) {
      return String(result)
    }

    return `${Number(result).toFixed(4)}`
  }

  const getUnitsRaw = (rawProduct) => {
    return rawProduct.rawProducts_id?.idUnits ? getTranslatedUnit(rawProduct.rawProducts_id.idUnits) ?? "" : ""
  }

  const handleOpenViewTransactions = (item: RawProduct | FabricatedProduct) => {
    navigation.navigate('TransactionsView', {
      product: item
    });
  }

  return (
    <>
      <Modal onDismiss={onDismissModal} footerComponent={renderFooter} index={1} visible={addModalVisible} setVisible={setAddModalVisible}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Icon provider="FontAwesome" color="secondary" size={80} name="boxes-packing" />
          <Text bold size="huge" copyID="CATA_CREATE_ENTER" />
          <Text style={{ marginTop: "4%" }} copyID="CATA_ENTER_TEXT" />
          <Text bold style={{ marginTop: "2%" }} copyID={`• ${productSelectedToAdd?.description}`} />

          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <TextInput
              inputMode='decimal'
              setValue={setQuantityToAdd}
              onBlur={() => validateSingle("quantityToAdd")}
              isError={!validationStates.quantityToAdd}
              errorMessage="CURAWMATERIAL_REPRICE_ERROR"
              labelCopyID="CATA_ENTER_LABEL"
              placeholder="CATA_ENTER_PLACEHOLDER"
              style={{ marginTop: "4%", width: "80%" }}
            />
            <Text style={{ marginTop: "9%", marginLeft: "1%" }} copyID={productSelectedToAdd ? getTranslatedUnit(productSelectedToAdd?.idUnits) ?? "" : ""} />
          </View>

          {
            productSelectedToAdd?.__typename === "fabricatedProducts" && (
              <>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%", marginLeft: "12%", marginTop: "4%", marginBottom: "2%" }}>
                  <Toggle isActive={discountRaw} onPress={() => changeDiscount(!discountRaw)} />
                  <Text size="small" style={{ marginLeft: "1%" }} copyID="CATA_ENTER_DISCOUNT" />
                </View>
              </>
            )
          }

          {
            productSelectedToAdd && 'rawProducts' in productSelectedToAdd && discountRaw
            && productSelectedToAdd.rawProducts.map((rawProduct, i) => (
              <View style={{ width: "90%", marginVertical: "1%" }} key={i}>
                <Text size="small" copyID="CATA_ENTER_RAW_MATERIAL" copyVariables={{ quantity: getQuantityRaw(rawProduct), unit: getUnitsRaw(rawProduct), product: rawProduct?.rawProducts_id?.description ?? "" }} />
              </View>
            ))
          }

        </View>


      </Modal >
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
              onAddPress={() => handleAddProduct(item as (RawProduct | FabricatedProduct))}
              onViewTransactionsPress={() => handleOpenViewTransactions(item as (RawProduct | FabricatedProduct))}
            />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        onScroll={onScroll}
        ListEmptyComponent={<Text textAlign="center" copyID="CATA_SEARCHER_EMPTY" />}
      />
    </>
  )
}

export default InventoriesList;


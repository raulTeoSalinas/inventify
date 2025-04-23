// React
import React, {useState} from 'react';
// React Native
import { View, TouchableOpacity } from "react-native";
// External Dependencies
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// Internal Dependencies
import {
  Header,
  ViewLayout,
  TextInput,
  PillButton,
  ModalDelete,
  Text,
  Separator,
  SectionHeader,
  Toggle,
  SelectInput,
  RadioButton,
  Button,
  CardLayout,
  Icon,
  Modal,
  DateInput
} from "../../../designSystem";
import { StyledButton } from "./CUNotesView.styles";
import { ItemContainer } from "../../../designSystem/molecules/SelectInput/SelectInput.styles";
import { CUNotesViewProps } from "./CUNotesView.model";
import { RawProduct } from "../../../viewModels/useRawProducts/useRawProducts.model";
import { FabricatedProduct } from "../../../viewModels/useFabricatedProducts/useFabricatedProducts.model";
import { Service } from "../../../viewModels/useServices/useServices.model";
import { formatCurrency } from "../../../utils/formatCurrency";
import useNotesView from "./CUNotesView.controller";

const CUNotesView: React.FC<CUNotesViewProps> = (props) => {

  const {
    nameCustomer,
    setNameCustomer,
    phoneCustomer,
    setPhoneCustomer,
    emailCustomer,
    setEmailCustomer,
    date,
    setDate,
    transactions,
    payments,
    selectedOptions,
    setSelectedOptions,
    customer,
    selectedOptionCustomer,
    setSelectedOptionCustomer,
    isNewCustomer,
    setIsNewCustomer,
    customerPaymentInOne,
    total,
    remaining,
    errorProduct,
    handleCreate,
    handleUpdate,
    openDeleteModal,
    handleDelete,
    handleChangeCustomer,
    handleQuantityChange,
    handleChangeProduct,
    addRowTransactions,
    deleteRowTransactions,
    handlePressPrice,
    renderFooter,
    addRowPayments,
    handleAmountChange,
    handleDateChange,
    deleteRowPayments,
    pressToggleCustomerPaymentInOne,
    validationStates,
    onDismissModal,
    priceModalVisible,
    setPriceModalVisible,
    note,
    customers,
    rawProducts,
    fabricatedProducts,
    services,
    theme,
    getTranslatedUnit,
    notes,
    visibleDeleteModal,
    setVisibleDeleteModal,
    selectedIndexTransactionPrice,
    price,
    setPrice,
    customerAdvances,
    paymentOptions,
    handleTypePaymentChange,
    getPaymentOptionByValue,
    selectedPaymentOptions,
    setSelectedPaymentOptions
  } = useNotesView()

  return (
    <ViewLayout>

      <Header backButton deleteFunc={note && (() => openDeleteModal('NOTE', 0))} headerSize="extraLarge" copyIDTitle={!note ? "CUNOTES_CREATE_NOTE" : "CUNOTES_EDIT_NOTE"} copyIDTitleVariables={{ id: note?.id ?? "" }} />
      <KeyboardAwareScrollView extraScrollHeight={10} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        <SectionHeader copyID="CUNOTES_GENERAL_DATA" />
        <DateInput
          labelCopyID="CUNOTES_NOTE_DATE"
          style={{ width: "90%", marginVertical: 4 }}
          date={date}
          setDate={setDate}
        />

        <SectionHeader copyID="CUNOTES_CUSTOMER_DATA" />
        <Toggle isActive={isNewCustomer} onPress={() => setIsNewCustomer(!isNewCustomer)} style={{ width: "90%", marginTop: "2%" }} copyID="CUNOTES_NEW_CUSTOMER" />
        {
          isNewCustomer ? (
            <>
              <TextInput
                isError={!validationStates.nameCustomer}
                errorMessage="CUNOTES_VALID_NAME"
                autoCapitalize="sentences"
                placeholder="CUNOTES_CUSTOMER_NAME_PLACEHOLDER"
                labelCopyID="CUNOTES_CUSTOMER_NAME"
                value={nameCustomer}
                setValue={setNameCustomer}
                style={{ marginVertical: 4 }}
              />
              <TextInput
                isError={false}
                autoCapitalize="none"
                inputMode="email"
                placeholder="CUNOTES_CUSTOMER_EMAIL_PLACEHOLDER"
                labelCopyID="CUNOTES_CUSTOMER_EMAIL"
                value={emailCustomer}
                setValue={setEmailCustomer}
                style={{ marginVertical: 4 }}
              />
              <TextInput
                isError={false}
                inputMode="tel"
                placeholder="CUNOTES_CUSTOMER_PHONE_PLACEHOLDER"
                labelCopyID="CUNOTES_CUSTOMER_PHONE"
                value={phoneCustomer}
                setValue={setPhoneCustomer}
                style={{ marginVertical: 4 }}
              />
            </>
          ) : (
            <SelectInput
              isError={!validationStates.customer}
              errorMessage="CUNOTES_SELECT_VALID_CUSTOMER"
              labelCopyID="CUNOTES_SELECT_CUSTOMER"
              handleAccept={handleChangeCustomer}
              options={customers.all.list ?? []}
              initialOption={customer}
              selectedOption={selectedOptionCustomer}
              setSelectedOption={setSelectedOptionCustomer}
              titleCopyID="CUNOTES_SELECT_CUSTOMER_TITLE"
              style={{ width: "90%", marginVertical: 4 }}
              searchKey="name"
              placeHolderSearch="CUNOTES_SEARCH_BY_NAME"
              specialRenderItem={({ item }) => (
                <ItemContainer>
                  <RadioButton
                    onPress={() => setSelectedOptionCustomer(item)}
                    style={{ width: "100%" }}
                    isActive={selectedOptionCustomer ? selectedOptionCustomer?.id === item?.id : false}
                    labelCopyID={`${item?.name}\n${item?.email}\n${item?.phoneNumber}`}
                  />
                  <Separator />
                </ItemContainer>
              )}
            >
              <Text copyID={customer ? customer?.name : "CUNOTES_SELECT"} />
            </SelectInput>
          )
        }
        { 
          customerAdvances > 0 && (
            <Text bold color='success' size='small' copyID={`El cliente cuenta con ${formatCurrency(customerAdvances)} en adelantos.`} />
          )
        }
        <SectionHeader copyID="CUNOTES_PRODUCTS_SERVICES" />
        {
          transactions.map((transaction, i) => (
            <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8 }}>
              <Text copyID={String(i + 1)} />
              <CardLayout style={{ marginTop: "4%", flex: 1 }}>
                <SelectInput
                  isError={!validationStates[`transactions${i}_product`]}
                  errorMessage="CUNOTES_SELECT_PRODUCT_SERVICE"
                  labelCopyID="CUNOTES_PRODUCT_SERVICE"
                  backgroundLight
                  segmentOptions={["CUNOTES_SEGMENT_RAW", "CUNOTES_SEGMENT_FAB", "CUNOTES_SEGMENT_SER"]}
                  searchKey="description"
                  handleAccept={() => handleChangeProduct(i)}
                  options={[rawProducts.all.list ?? [], fabricatedProducts.all.list ?? [], services.all.list ?? []]}
                  initialOption={transaction?.idRawProducts ?? transaction?.idFabricatedProducts ?? transaction?.idServices ?? {}}
                  selectedOption={selectedOptions[i]}
                  setSelectedOption={(option: Partial<RawProduct> | Partial<FabricatedProduct> | Partial<Service>) => {
                    setSelectedOptions(prev => ({
                      ...prev,
                      [i]: option
                    }));
                  }}
                  titleCopyID="CUNOTES_SELECT_PRODUCT_SERVICE_TITLE"
                  style={{ flex: 1 }}
                  specialRenderItem={({ item }) => (
                    <View style={{ width: "100%" }}>
                      <RadioButton
                        onPress={() => {
                          setSelectedOptions(prev => ({
                            ...prev,
                            [i]: item
                          }));
                        }}
                        style={{ width: "100%", paddingVertical: 16 }}
                        isActive={selectedOptions[i]?.id === item.id}
                        labelCopyID={item.description || ""}
                      />
                      <Separator />
                    </View>
                  )}
                >
                  <Text color={(transaction?.idFabricatedProducts ?? transaction?.idRawProducts ?? transaction?.idServices) ? "text" : "textLight"} size="extraSmall" copyID={transaction?.idRawProducts?.description || transaction?.idFabricatedProducts?.description || transaction?.idServices?.description || "CUNOTES_SELECT"} />
                </SelectInput>
                {
                  (transaction.idServices || transaction.idFabricatedProducts || transaction.idRawProducts) && (
                    <View key={i} style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                      <View>
                        <Text size="small" textAlign="left" style={{ marginLeft: "2%", marginBottom: "1%" }} copyID={transaction.idServices ? "CUNOTES_PRICE" : "CUNOTES_UNIT_PRICE"} />
                        <StyledButton
                          backgroundLight
                          onPress={() => handlePressPrice(i)}
                          activeOpacity={0.8}
                          style={!validationStates[`transactions${i}_price`] && {
                            borderWidth: 1,
                            borderColor: theme.colors.error
                          }}
                        >
                          <Text size='extraSmall' color={transaction.price ? "text" : "textLight"} copyID={transaction.price
                            ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(transaction.price))
                            : "CUNOTES_PRICE"} />
                          <Icon name="chevron-down" />
                        </StyledButton>
                      </View>

                      {!transaction.idServices && (
                        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                          <TextInput
                            isError={!validationStates[`transactions${i}_quantity`]}
                            labelCopyID="CUNOTES_QUANTITY"
                            style={{ flex: 1 }}
                            backgroundLight
                            setValue={(newValue) => handleQuantityChange(i, newValue)}
                            placeholder="CUNOTES_QUANTITY_PLACEHOLDER"
                            inputMode="decimal"
                            value={
                              transaction?.quantity !== undefined
                                ? String(transaction.quantity)
                                : ""
                            }
                          />
                          <Text style={{ marginTop: 18, marginLeft: 2 }} copyID={getTranslatedUnit(transaction) || ""} />
                        </View>
                      )}

                    </View>
                  )

                }



              </CardLayout>

              <TouchableOpacity onPress={!note ? () => deleteRowTransactions(i) : () => openDeleteModal('TRANSACTION', i)}>
                <Icon color="error" name="trash" />
              </TouchableOpacity>

            </View>
          ))
        }
        <Button style={{ marginTop: "4%" }} onPress={addRowTransactions} copyID="CUNOTES_ADD" />
        {
          errorProduct && (
            <Text style={{ width: "90%", marginTop: "2%" }} textAlign="center" color="error" copyID="CUNOTES_AT_LEAST_ONE_PRODUCT" />
          )
        }
        <SectionHeader copyID="CUNOTES_PAYMENTS" />
        {!note &&
          <Toggle isActive={customerPaymentInOne} onPress={pressToggleCustomerPaymentInOne} style={{ width: "90%", marginTop: "2%" }} copyID="CUNOTES_ONE_PAYMENT" />
        }
        {
          payments.map((payment, i) => (
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "90%", gap: 8 }} key={i}>
              <Text copyID={String(i + 1)} />
              <CardLayout style={{ marginTop: "4%", flex: 1 }}>
              <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
                <TextInput
                  backgroundLight
                  isError={!validationStates[`payments${i}_amount`]}
                  placeholder="CUNOTES_AMOUNT_PLACEHOLDER"
                  inputMode="decimal"
                  labelCopyID="CUNOTES_AMOUNT"
                  style={{ flex: 0.8, marginTop: "4%" }}
                  setValue={(newValue) => handleAmountChange(i, newValue)}
                  value={payment?.amount !== undefined ? String(payment.amount) : ""}
                />
                <DateInput
                  backgroundLight
                  isError={!validationStates[`payments${i}_date`]}
                  labelCopyID="CUNOTES_PAYMENT_DATE"
                  style={{ flex: 1, marginTop: "4%" }}
                  date={payment.dateMade ?? ""}
                  setDate={(date) => handleDateChange(i, date ?? "")}
                />
              </View>
              <SelectInput
                backgroundLight
                isError={!validationStates[`payments${i}_type`]}
                errorMessage="CUNOTES_SELECT_PAYMENT_TYPE"
                labelCopyID="CUNOTES_PAYMENT_TYPE"
                handleAccept={() => handleTypePaymentChange(i, selectedPaymentOptions[i]?.value as "deposit" | "cash" | "fromAdvance")}
                options={ customerAdvances > 0 ? paymentOptions : paymentOptions.filter(option => option.value !== "fromAdvance") }
                initialOption={getPaymentOptionByValue(payment.type as "deposit" | "cash" | "fromAdvance")}
                selectedOption={getPaymentOptionByValue(payment.type ?? "")}
                setSelectedOption={(option) => {
                  setSelectedPaymentOptions(prev => ({
                    ...prev,
                    [i]: option
                  }));
                }}
                titleCopyID="CUNOTES_SELECT_PAYMENT_TYPE_TITLE"
                style={{ flex: 1, marginTop: "4%" }}
                specialRenderItem={({ item }) => (
                  <View style={{ width: "100%" }}>
                    <RadioButton
                      onPress={() => {
                        setSelectedPaymentOptions(prev => ({
                          ...prev,
                          [i]: item
                        }));
                      }}
                      style={{ width: "100%", paddingVertical: 16 }}
                      isActive={!!(item && selectedPaymentOptions[i]?.value === item.value)}
                      labelCopyID={item?.label ?? ""}
                      copyVariables={{amount: formatCurrency(customerAdvances)}}
                    />
                    <Separator />
                  </View>
                )}
              >
                <Text 
                  size="extraSmall" 
                  copyID={ getPaymentOptionByValue(payment.type ?? "")?.label ?? ""} 
                  copyVariables={{
                    amount: formatCurrency(customerAdvances)
                  }}
                />
              </SelectInput>

              </CardLayout>
              {
                !customerPaymentInOne && (
                  <TouchableOpacity style={{ marginTop: 30 }} onPress={!note ? () => deleteRowPayments(i) : () => openDeleteModal('PAYMENT', i)}>
                    <Icon color="error" name="trash" />
                  </TouchableOpacity>
                )
              }



            </View>
          ))
        }
        {
          !customerPaymentInOne && (
            <Button style={{ marginTop: "4%" }} onPress={addRowPayments} copyID="CUNOTES_ADD" />
          )
        }
        <View style={{ flexDirection: "row", alignItems: "center", width: "90%", gap: 8, marginLeft: 8, marginTop: "2%" }}>
          <Text copyID="CUNOTES_REMAINING" />
          <Text
            color={
              remaining === 0
                ? "success"
                : remaining > 0
                  ? "warning"
                  : "error"
            }
            bold
            copyID={formatCurrency(remaining)} />

        </View>

        {
          remaining > 0 && (
            <View style={{ alignItems: "center", width: "90%", gap: 8, marginLeft: 8, marginTop: "2%", backgroundColor: theme.colors.warningLight, padding: 8, borderRadius: 8, borderColor: theme.colors.warning, borderWidth: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 8, width: "100%" }}>
                <Icon name="warning" color="dark" />
                <Text color="dark" size="small" bold copyID="CUNOTES_ATTENTION" />
              </View>

              <Text color="dark" size="small" copyID="CUNOTES_EXCEEDING_AMOUNT" />
            </View>
          )
        }
        <SectionHeader copyID="CUNOTES_TOTAL" />
        <View style={{ flexDirection: "row", alignItems: "center", width: "90%", gap: 8, marginLeft: 8, marginTop: "2%" }}>
          <Text copyID="CUNOTES_TOTAL" />
          <Text bold copyID={new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(total))} />
        </View>

        {
          !note ? (

            <PillButton onPress={handleCreate} isLoading={notes.crud.isLoading} style={{ width: "80%", marginVertical: "12%" }} isGradient copyID="GENERAL_CREATE" />
          ) : (
            <PillButton onPress={handleUpdate} isLoading={notes.crud.isLoading} style={{ width: "80%", marginVertical: "12%" }} isGradient copyID="GENERAL_UPDATE" />
          )
        }
      </KeyboardAwareScrollView>
      <ModalDelete loading={notes.crud.isLoading} handleDelete={handleDelete} visible={visibleDeleteModal} setVisible={setVisibleDeleteModal} />
      <Modal onDismiss={onDismissModal} footerComponent={renderFooter} index={1} visible={priceModalVisible} setVisible={setPriceModalVisible}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>

          <Text bold size="huge" copyID="CUNOTES_SELECT_PRICE" />
          <Text style={{ marginTop: "4%", marginHorizontal: "2%" }} copyID="CUNOTES_MODIFYING_UNIT_PRICE" />
          <Text bold style={{ marginVertical: "2%" }} copyID={`• ${transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.description ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.description ?? transactions[selectedIndexTransactionPrice]?.idServices?.description}`} />

          {
            (!transactions[selectedIndexTransactionPrice]?.idServices) ? (
              <>
                <RadioButton
                  style={{ width: "80%" }}
                  copyVariables={{ price: transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.wholesalePrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.wholesalePrice ?? "" }}
                  labelCopyID='CUNOTES_WHOLESALE_PRICE'
                  isActive={Number(price) === (transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.wholesalePrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.wholesalePrice)}
                  onPress={() => setPrice(String(transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.wholesalePrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.wholesalePrice))}
                />
                <Separator style={{ width: "90%", marginVertical: "2%" }} />
                <RadioButton
                  style={{ width: "80%" }}
                  copyVariables={{ price: transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.retailPrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.retailPrice ?? "" }}
                  labelCopyID='CUNOTES_RETAIL_PRICE'
                  isActive={Number(price) === (transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.retailPrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.retailPrice)}
                  onPress={() => setPrice(String(transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.retailPrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.retailPrice))}
                />

              </>
            ) : (
              <RadioButton
                style={{ width: "80%" }}
                copyVariables={{ price: transactions[selectedIndexTransactionPrice]?.idServices?.defaultPrice ?? '' }}
                labelCopyID='CUNOTES_DEFAULT_PRICE'
                isActive={Number(price) === transactions[selectedIndexTransactionPrice]?.idServices?.defaultPrice}
                onPress={() => setPrice(String(transactions[selectedIndexTransactionPrice]?.idServices?.defaultPrice))}
              />
            )

          }
          <Separator style={{ width: "90%", marginVertical: "2%" }} />
          <RadioButton
            style={{ width: "80%" }}
            labelCopyID={`CUNOTES_CUSTOM_PRICE`}
            isActive={Number(price) !== (transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.retailPrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.retailPrice) &&
              Number(price) !== (transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.wholesalePrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.wholesalePrice) &&
              Number(price) !== (transactions[selectedIndexTransactionPrice]?.idServices?.defaultPrice)}
            onPress={() => setPrice("")}
          />
          {
            Number(price) !== (transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.retailPrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.retailPrice) &&
            Number(price) !== (transactions[selectedIndexTransactionPrice]?.idFabricatedProducts?.wholesalePrice ?? transactions[selectedIndexTransactionPrice]?.idRawProducts?.wholesalePrice) &&
            Number(price) !== (transactions[selectedIndexTransactionPrice]?.idServices?.defaultPrice) && (
              <TextInput
                isBottomSheet
                isError={!validationStates[`transactions${selectedIndexTransactionPrice}_price`]}
                defaultValue={price}
                inputMode="decimal"
                placeholder="CUNOTES_CUSTOM_PRICE_PLACEHOLDER"
                labelCopyID="CUNOTES_CUSTOM_PRICE"
                setValue={setPrice}
                errorMessage="CUNOTES_VALID_CUSTOM_PRICE"
                style={{ marginTop: "4%", width: "80%" }}
              />
            )
          }
        </View>
      </Modal >
    </ViewLayout >
  )
}

export default CUNotesView;
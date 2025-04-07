
// React
import React from 'react';
// React Native
import { View, TouchableOpacity } from 'react-native';
// External Dependencies
import { KeyboardAwareScrollView, KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
// Internal Dependencies
import {
  Header,
  ViewLayout,
  TextInput,
  PillButton,
  ModalDelete,
  SectionHeader,
  SelectInput,
  Icon,
  RadioButton,
  Separator,
  Text,
  Button,
  SegmentedControl,
  CardLayout,
} from "../../../designSystem";
import { CUSellersViewProps } from "./CUSellersView.model";
import { ItemContainer } from '../../../designSystem/molecules/SelectInput/SelectInput.styles';
import { Customer } from '../../../viewModels/useCustomers/useCustomers.model';
import useCUSellersView from './CUSellersView.controller';

const CUSellersView: React.FC<CUSellersViewProps> = (props) => {

  const {
    name,
    setName,
    visibleDeleteModal,
    setVisibleDeleteModal,
    customersFromSeller,
    selectedCustomerOptions,
    setSelectedCustomerOptions,
    filteredCustomers,
    segmentSelected,
    setSegmentSelected,
    schemesValues,
    selectedSchemes,
    schemeAmounts,
    setSchemeAmounts,
    handleCreate,
    handleUpdate,
    handleDelete,
    openDeleteModal,
    addRowCustomer,
    deleteRowCustomer,
    handleChangeCustomer,
    validationStates,
    validateSingle,
    seller,
    segments,
    SCHEME_TYPES,
    rawProducts,
    fabricatedProducts,
    handleSchemeChange,
    handleAcceptScheme,
    sellers
  } = useCUSellersView()


  return (
    <ViewLayout>

      <Header backButton deleteFunc={seller && openDeleteModal} headerSize="extraLarge" copyIDTitle={!seller ? "CUSELLERS_HEADER" : "CUSELLERS_HEADER_EDIT"} />
      <KeyboardAwareScrollView extraScrollHeight={10} contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        <SectionHeader copyID="CUNOTES_GENERAL_DATA" />
        <TextInput
          autoCapitalize="words"
          errorMessage="CUSELLERS_NAME_ERROR"
          placeholder="CUSELLERS_NAME_PLACE"
          labelCopyID="CUSELLERS_NAME_LABEL"
          onBlur={() => validateSingle("name")}
          isError={!validationStates.name}
          value={name}
          setValue={setName}
          style={{ marginVertical: "4%" }}
        />
        <SectionHeader copyID="CUSELLERS_CUSTOMERS" />
        {customersFromSeller.map((customer, i) => (
          <View style={{ width: "90%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "2%" }} key={i}>
            <SelectInput
              isError={!validationStates[`customer${i}`]}
              errorMessage="CUNOTES_SELECT_VALID_CUSTOMER"
              handleAccept={() => handleChangeCustomer(i)}
              options={[...(customer.id ? [customer as Customer] : []), ...filteredCustomers]}
              initialOption={customer as Customer}
              selectedOption={selectedCustomerOptions[i] as Customer}
              setSelectedOption={(option: Customer) => {
                setSelectedCustomerOptions(prev => ({
                  ...prev,
                  [i]: option
                }));
              }}
              titleCopyID="CUNOTES_SELECT_CUSTOMER_TITLE"
              style={{ flex: 1 }}
              searchKey="name"
              placeHolderSearch="CUNOTES_SEARCH_BY_NAME"
              specialRenderItem={({ item }) => (
                <ItemContainer>
                  <RadioButton
                    onPress={() => {
                      setSelectedCustomerOptions(prev => ({
                        ...prev,
                        [i]: item
                      }));
                    }}
                    style={{ width: "100%" }}
                    isActive={selectedCustomerOptions[i]?.id === item.id}
                    labelCopyID={`${item?.name}\n${item?.email || "Sin correo"}\n${item?.phoneNumber || "Sin teléfono"}`}
                  />
                  <Separator />
                </ItemContainer>
              )}
            >
              <Text color={customer?.name ? "text" : "textLight"} size="extraSmall" copyID={customer?.name || "CUNOTES_SELECT"} />
            </SelectInput>

            {customersFromSeller.length > 1 && (
              <TouchableOpacity onPress={() => deleteRowCustomer(i)}>
                <Icon color="error" name="trash" />
              </TouchableOpacity>
            )}
          </View>
        ))}
        {
          filteredCustomers.length > 0 && (
            <Button style={{ marginTop: "4%" }} onPress={addRowCustomer} copyID="CUSELLER_ADD_CUSTOMER" />
          )
        }

        <SectionHeader copyID="CUSELLER_COMISSIONS_SCHEME" />
        <SegmentedControl itemSelected={segmentSelected} setItemSelected={setSegmentSelected} items={segments} style={{ marginHorizontal: 12, marginTop: 12 }} />
        <KeyboardAwareFlatList
          data={segmentSelected === segments[0] ? rawProducts.all.list : fabricatedProducts.all.list}
          renderItem={({ item }) => {
            const productId = item.id;
            const confirmedSchemeType = schemesValues[productId] || SCHEME_TYPES.NONE;
            const temporarySchemeType = selectedSchemes[productId] || SCHEME_TYPES.NONE;
            const schemeAmount = schemeAmounts[productId] || 0;
            const getExplanation = () => {
              switch (confirmedSchemeType) {
                case SCHEME_TYPES.FIXED:
                  return "CUSELLER_COMISSIONS_SCHEME_FIXED_DESC";
                case SCHEME_TYPES.PERCENTAGE:
                  return "CUSELLER_COMISSIONS_SCHEME_PERCENTAGE_DESC";
                case SCHEME_TYPES.DIFFERENCE:
                  return "CUSELLER_COMISSIONS_SCHEME_DIFFERENCE_DESC";
                case SCHEME_TYPES.NONE:
                  return "CUSELLER_COMISSIONS_SCHEME_NONE_DESC";
                default:
                  return "CUSELLER_COMISSIONS_SCHEME_NONE_DESC";
              }
            }

            return (
              <CardLayout style={{ marginVertical: 6, marginHorizontal: "4%" }}>
                <Text bold size="small" copyID={item.description} />
                <Separator />
                <SelectInput
                  isError={validationStates[`scheme_${productId}`] !== undefined && !validationStates[`scheme_${productId}`]}
                  labelCopyID='CUSELLER_COMISSIONS_SCHEME_TYPE'
                  options={Object.values(SCHEME_TYPES)}
                  initialOption={confirmedSchemeType}
                  selectedOption={temporarySchemeType}
                  setSelectedOption={(option) => handleSchemeChange(productId, option)}
                  handleAccept={() => handleAcceptScheme(productId)}
                  titleCopyID="CUSELLER_COMISSIONS_SCHEME_TYPE"
                  style={{ width: '100%' }}
                >
                  <Text copyID={confirmedSchemeType || ''} />
                </SelectInput>

                {(confirmedSchemeType !== SCHEME_TYPES.NONE && confirmedSchemeType !== SCHEME_TYPES.DIFFERENCE) && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {
                      confirmedSchemeType === SCHEME_TYPES.FIXED && (
                        <Text style={{ marginTop: 22 }} bold copyID="$" />
                      )
                    }
                    <TextInput
                      labelCopyID='CUSELLER_COMISSIONS_VALUE'
                      style={{ width: '60%' }}
                      isError={validationStates[`schemeAmount_${productId}`] !== undefined && !validationStates[`schemeAmount_${productId}`]}
                      setValue={(value) => {
                        if (value === '' || /^(0|[1-9][0-9]*)?\.?[0-9]*$/.test(value)) {
                          const isEditingDecimal = value.endsWith('.') || (value.includes('.') && !value.endsWith('0'));
                          setSchemeAmounts(prev => ({
                            ...prev,
                            [productId]: isEditingDecimal || value.startsWith('0.') || value === '0' ?
                              value :
                              (value === '' ? '' : Number(value))
                          }));
                        }
                      }}
                      placeholder={"Ej. 10.00"}
                      inputMode="decimal"
                      value={schemeAmount ? String(schemeAmount) : ""}
                    />
                    {
                      confirmedSchemeType === SCHEME_TYPES.PERCENTAGE && (
                        <Text style={{ marginTop: 22, marginLeft: "1%" }} bold copyID={"%"} />
                      )
                    }
                  </View>
                )}
                <Text bold size='small' style={{ marginLeft: "1%" }} copyVariables={{ value: String(schemeAmount) }} copyID={getExplanation()} />
              </CardLayout>
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          style={{ width: "100%", marginTop: "4%", overflow: "visible" }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={
            <View style={{ width: "90%", alignItems: "center", marginTop: "4%" }}>
              <Text size="small" copyID="CUNOTES_NO_PRODUCTS" />
            </View>
          }
        />


        {
          !seller ? (

            <PillButton onPress={handleCreate} isLoading={sellers.crud.isLoading} style={{ width: "80%", marginVertical: "12%" }} isGradient copyID="GENERAL_CREATE" />
          ) : (
            <PillButton onPress={handleUpdate} isLoading={sellers.crud.isLoading} style={{ width: "80%", marginVertical: "12%" }} isGradient copyID="GENERAL_UPDATE" />
          )
        }
      </KeyboardAwareScrollView>
      <ModalDelete loading={sellers.crud.isLoading} handleDelete={handleDelete} visible={visibleDeleteModal} setVisible={setVisibleDeleteModal} />

    </ViewLayout>
  )
}

export default CUSellersView;


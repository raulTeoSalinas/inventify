// React
import React, { useState, useCallback } from "react"
// React Native
import { ScrollView, View } from "react-native"
// Internal Dependencies
import Text from "../../atoms/Text/Text"
import Icon from "../../atoms/Icon/Icon"
import RadioButton from "../../atoms/RadioButton/RadioButton"
import Modal from "../../organisms/Modal/Modal"
import { StyledButton, FooterContainer, ItemContainer } from "./SelectInput.styles"
import { SelectInputProps } from "./SelectInput.model"
import Separator from "../../atoms/Separator/Separator"
import Button from "../../atoms/Button/Button"
import { BottomSheetFooter, BottomSheetFlatList, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ListRenderItem } from 'react-native';



const SelectInput = <T,>({
  children,
  options,
  titleCopyID,
  specialRenderItem,
  selectedOption,
  setSelectedOption,
  initialOption,
  handleAccept,
  ...restProps
}: SelectInputProps<T>) => {

  const [isVisible, setIsVisible] = useState(false);


  const insets = useSafeAreaInsets()

  const paddingBottom = insets.bottom === 0 ? 20 : insets.bottom;

  const handleCancel = () => {
    setSelectedOption(initialOption);
    setIsVisible(false)
  }

  const accept = () => {
    handleAccept()
    setIsVisible(false)
  }


  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <FooterContainer paddingBottom={paddingBottom}>
          <Button onPress={handleCancel} backgroundColor="white" style={{ flex: 1 }} size="large" copyID="GENERAL_CANCEL" />
          <Button onPress={accept} style={{ flex: 1 }} size="large" copyID="GENERAL_ACCEPT" />
        </FooterContainer>
      </BottomSheetFooter>
    ),
    [handleAccept, paddingBottom, handleCancel, accept]
  );


  const renderItem: ListRenderItem<T> = useCallback(
    ({ item, index }) => {
      if (specialRenderItem) {
        return specialRenderItem({ item, index });
      }

      return (
        <ItemContainer>
          <RadioButton
            onPress={() => setSelectedOption(item)}
            style={{ width: "100%" }}
            isActive={selectedOption === item}
            labelCopyID={String(item)}
          />
          <Separator />
        </ItemContainer>
      );
    },
    [specialRenderItem, selectedOption]
  );

  return (
    <>
      <StyledButton
        onPress={() => setIsVisible(true)}
        activeOpacity={0.8}
        {...restProps}
      >
        {children}
        <Icon name="chevron-down" />
      </StyledButton>
      <Modal onDismiss={handleCancel} footerComponent={renderFooter} visible={isVisible} setVisible={setIsVisible}>


        <Text bold style={{ marginTop: 10, marginBottom: 8 }} textAlign="center" copyID={titleCopyID} />
        <BottomSheetFlatList
          data={options}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}

          contentContainerStyle={{ paddingHorizontal: 26, paddingBottom: 100 }}
        />


      </Modal >
    </>
  )
}

export default SelectInput;
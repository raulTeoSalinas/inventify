// React
import React, { useState, useCallback, useEffect } from "react"
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
import Searcher from "../Searcher/Searcher"
import useThemeProvider from "../../../theme/ThemeProvider.controller"
import SegmentedControl from "../SegmentedControl/SegmentedControl"


const SelectInput = <T,>({
  children,
  options,
  titleCopyID,
  specialRenderItem,
  selectedOption,
  setSelectedOption,
  initialOption,
  handleAccept,
  style,
  labelCopyID,
  errorMessage,
  isError,
  searchKey,
  placeHolderSearch,
  segmentOptions,
  backgroundLight,
  ...restProps
}: SelectInputProps<T>) => {

  const [isVisible, setIsVisible] = useState(false);

  const [optionsIndex, setOptionsIndex] = useState(0);

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

  const [searchText, setSearchText] = useState("")



  const [optionsDisplayed, setOptionsDisplayed] = useState<T[]>(options as T[])

  useEffect(() => {
    const optionsInternal: T[] = Array.isArray(options[0]) ? options[optionsIndex] as T[] : options as T[];
    // Si el texto de búsqueda está vacío, mostrar todos los productos
    if (!searchText.trim()) {
      setOptionsDisplayed(optionsInternal);
      return;
    }

    // Realizar la búsqueda con texto normalizado
    const normalizedSearch = searchText
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Filtrar los productos
    const filteredProducts = optionsInternal.filter(item => {
      if (!item || !searchKey) return false;
      const value = item[searchKey] as any;
      if (typeof value !== 'string') return false;

      return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .includes(normalizedSearch);
    });

    setOptionsDisplayed(filteredProducts as T[]);
  }, [searchText, optionsIndex, options
  ]);

  const theme = useThemeProvider();

  const [sectionSelected, setSectionSelected] = useState(segmentOptions ? segmentOptions[0] : "");
  const handleChangeSection = (section: string) => {
    // find index of section in segmentOptions and set it to optionsIndex
    const index = segmentOptions?.findIndex((item) => item === section);

    if (index !== undefined) {
      setOptionsIndex(index);

    }
    setSectionSelected(section);
  }

  return (
    <>
      <View style={style}>
        {
          labelCopyID && (
            <Text size="small" textAlign="left" style={{ marginLeft: "2%", marginBottom: "1%" }} copyID={labelCopyID} />
          )
        }
        <View style={[!backgroundLight && {
          shadowColor: "#5e5e5e7a",
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.00,
          elevation: 24,
        }]}>
          <StyledButton
            backgroundLight={backgroundLight}
            onPress={() => setIsVisible(true)}
            activeOpacity={0.8}
            style={isError && {
              borderWidth: 1,
              borderColor: theme.colors.error
            }}
            {...restProps}
          >
            {children}
            <Icon name="chevron-down" />
          </StyledButton>
        </View>
        {isError && errorMessage &&
          <Text color="error" size="small" style={{ textAlign: "center" }} copyID={errorMessage} />
        }
      </View>

      <Modal onDismiss={handleCancel} footerComponent={renderFooter} visible={isVisible} setVisible={setIsVisible}>


        <Text bold style={{ marginTop: 10, marginBottom: 8 }} textAlign="center" copyID={titleCopyID} />
        {
          searchKey && (
            <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 8 }}>
              <Searcher placeHolderCopyID={placeHolderSearch ? placeHolderSearch : "CATA_SEARCHER_PLACE"} setText={setSearchText} style={{ width: "90%" }} />

            </View>
          )
        }

        {
          segmentOptions && (
            <SegmentedControl items={segmentOptions}
              itemSelected={sectionSelected}
              setItemSelected={handleChangeSection}
              style={{ marginHorizontal: 20, marginBottom: 8 }} />
          )
        }

        <BottomSheetFlatList
          data={optionsDisplayed}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 26, paddingBottom: 100 }}
        />


      </Modal >
    </>
  )
}

export default SelectInput;
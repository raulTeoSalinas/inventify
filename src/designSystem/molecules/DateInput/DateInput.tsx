import React, { useState, useCallback } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import Modal from "../../organisms/Modal/Modal";
import { BottomSheetFooterProps, BottomSheetFooter } from '@gorhom/bottom-sheet';
import { Calendar } from "react-native-calendars";
import Text from "../../atoms/Text/Text";
import Icon from "../../atoms/Icon/Icon";
import Button from "../../atoms/Button/Button";
import useThemeProvider from "../../../theme/ThemeProvider.controller";
import { formatLongDate } from "../../../utils/formatDates";
import { Container, Column } from "./DateInput.styles";
import { useAppSelector } from "../../../store/hooks";
import { StyledButton } from "./DateInput.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FooterContainer } from "../SelectInput/SelectInput.styles";

type InputDateProps = {
  date: string;
  setDate: (date: string) => void;
  isError?: boolean;
  style?: StyleProp<ViewStyle>;
  labelCopyID?: string;
}

const formatDateForCalendar = (dateString: string | undefined): string => {
  if (!dateString) return "";

  // Si ya es formato YYYY-MM-DD, devolver tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  try {
    // Convertir fecha ISO a objeto Date
    const date = new Date(dateString);

    // Verificar si es fecha válida
    if (isNaN(date.getTime())) {
      return "";
    }

    // Formatear como YYYY-MM-DD
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "";
  }
};

// Component definition
const InputDate: React.FC<InputDateProps> = ({ date, setDate, isError, style, labelCopyID, ...restProps }) => {

  // Hook for using Input Location
  const [modalVisible, setModalVisible] = useState(false);

  const initialFormattedDate = formatDateForCalendar(date);
  const [selectedDate, setSelectedDate] = useState(initialFormattedDate);

  const language = useAppSelector((state) => state.config.language)


  const getMarkedDates = () => {
    const marked = {};
    if (selectedDate) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: theme.colors.primary
      };
    }
    return marked;
  };


  const handleSelectDate = (selectedDate: string) => {
    setSelectedDate(selectedDate);
  };

  const theme = useThemeProvider();

  const insets = useSafeAreaInsets()

  const paddingBottom = insets.bottom === 0 ? 20 : insets.bottom;
  const onDismissModal = () => {
    setSelectedDate("");
    setModalVisible(false)
  }

  const handlePressAccept = () => {
    setDate(selectedDate);
    setModalVisible(false)
  }

  const openModal = () => {
    setModalVisible(true)
    setSelectedDate(initialFormattedDate)
  }

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <FooterContainer paddingBottom={paddingBottom}>
          <Button onPress={onDismissModal} backgroundColor="white" style={{ flex: 1 }} size="large" copyID="GENERAL_CANCEL" />
          <Button onPress={handlePressAccept} style={{ flex: 1 }} size="large" copyID="GENERAL_ACCEPT" />
        </FooterContainer>
      </BottomSheetFooter>
    ),
    [paddingBottom, handlePressAccept, onDismissModal]
  );

  return (
    <>
      <View style={style}>
        {
          labelCopyID && (
            <Text size="small" textAlign="left" style={{ marginLeft: 8, marginBottom: "1%" }} copyID={labelCopyID} />
          )
        }

        <View style={[{
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
            onPress={openModal}
            activeOpacity={0.8}
            style={isError && {
              borderWidth: 1,
              borderColor: theme.colors.error
            }}
            {...restProps}
          >
            <Text color={date ? "text" : "textLight"} size="small" copyID={date ? formatDateForCalendar(date) : "Seleccionar"} />
            <Icon name="calendar" />
          </StyledButton>
        </View>
      </View>
      <Modal
        index={1}
        visible={modalVisible}
        setVisible={setModalVisible}
        onDismiss={onDismissModal}
        footerComponent={renderFooter}
      >
        <Text copyID="Selecciona la fecha" bold textAlign="center" />
        <Calendar
          style={{ marginTop: 20 }}
          enableSwipeMonths
          markedDates={getMarkedDates()}
          theme={{
            calendarBackground: theme.colors.background,
            arrowColor: theme.colors.primary,
            todayTextColor: theme.colors.secondary,
          }}
          onDayPress={date => {
            handleSelectDate(date.dateString)
          }}
        />
      </Modal>
    </>
  )
}

export default InputDate;
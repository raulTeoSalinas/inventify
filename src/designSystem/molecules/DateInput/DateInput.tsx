import React, { useState, useCallback, useEffect } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import Modal from "../../organisms/Modal/Modal";
import { BottomSheetFooterProps, BottomSheetFooter } from '@gorhom/bottom-sheet';
import { Calendar, LocaleConfig } from "react-native-calendars";
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

export const formatDateForCalendar = (dateString: string | undefined): string => {

  if (!dateString) return "";

  // Si ya es formato YYYY-MM-DD, devolver tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  try {
    // Extraer directamente la parte YYYY-MM-DD de la cadena ISO
    // Esto evita problemas con zonas horarias
    const datePart = dateString.split('T')[0];

    // Verificar que sea una fecha válida en formato YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return datePart;
    }

    // Si no se puede extraer de la forma simple, usar Date
    const date = new Date(dateString);

    // Verificar si es fecha válida
    if (isNaN(date.getTime())) {
      return "";
    }

    // Usar getFullYear, getMonth y getDate para evitar problemas de zona horaria
    const year = date.getFullYear();
    // getMonth() es base 0 (enero = 0), por lo que necesitamos añadir 1
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "";
  }
};

LocaleConfig.locales['ES'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: [
    'Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.',
    'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'
  ],
  dayNames: [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: 'Hoy'
};

// Component definition
const InputDate: React.FC<InputDateProps> = ({ date, setDate, isError, style, labelCopyID, ...restProps }) => {

  // Hook for using Input Location
  const [modalVisible, setModalVisible] = useState(false);

  const initialFormattedDate = formatDateForCalendar(date);
  const [selectedDate, setSelectedDate] = useState(initialFormattedDate);

  const language = useAppSelector((state) => state.config.language)

  useEffect(() => {
    if (language === "ES") {
      LocaleConfig.defaultLocale = "ES"
    } else {
      LocaleConfig.defaultLocale = "";
    }
  }, [language]);

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
        <Text copyID="DATEINPUT_TITLE" bold textAlign="center" />
        <Calendar
          current={selectedDate}
          style={{ marginTop: 20, marginHorizontal: 2 }}
          enableSwipeMonths
          markedDates={getMarkedDates()}
          theme={{
            calendarBackground: theme.colors.background,
            arrowColor: theme.colors.primary,
            todayTextColor: theme.colors.secondary,
            dayTextColor: theme.colors.text,
            textDisabledColor: theme.colors.shadow,
            monthTextColor: theme.colors.text,
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "bold",
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
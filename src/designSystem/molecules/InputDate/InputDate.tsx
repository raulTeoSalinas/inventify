// External Dependencies
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Calendar, DateData } from "react-native-calendars";
// Internal Dependencies
import useThemeProvider from "../../../theme/ThemeProvider.controller";
import Text from "../../atoms/Text/Text";
import useInputDate from "./InputDate.controller";
import { Column, Container } from "./InputDate.styles";


// Type definition
type InputDateProps = {
  date: string | null;
  setDate: (date: string | null) => void;
  description: string;
  size?: "large" | "regular"
};

// Component definition
const InputDate: React.FC<InputDateProps> = ({ date, setDate, description, size = "regular" }) => {

  // Hook for using Input Location
  const { presentRef, snapPoints, handleOpenModal, handleSelectDate, formatDate } = useInputDate(setDate)

  const theme = useThemeProvider();

  // Subcomponent Modal
  const Modal = () => (
    <BottomSheetModal
      index={0}
      ref={presentRef}
      snapPoints={snapPoints}
      backgroundStyle={{ backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border }}
    >
      <Text bold textAlign="center" style={{ marginBottom: "2%" }}>Please, select {description} date.</Text>
      <Calendar
        enableSwipeMonths
        current="2023-11-21"
        theme={{
          arrowColor: theme.colors.primary,
          todayTextColor: theme.colors.succes,
        }}
        onDayPress={(date: DateData) => {
          handleSelectDate(date.dateString)
        }}
      />
    </BottomSheetModal>
  )

  // Location input
  return (
    <>
      <Container size={size} onPress={handleOpenModal}>
        <Column>
          <Text size="tiny">{`Date of ${description}`}</Text>
          {date ? (

            <Text bold>{formatDate(date)}</Text>

          ) : (
            <Text color="textLight">Choose...</Text>
          )}
        </Column>
      </Container>
      <Modal />
    </>
  )
}

export default InputDate;


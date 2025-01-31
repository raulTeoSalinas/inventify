//React
import { useRef, useMemo, useCallback, useEffect } from "react";
// External dependencies
import { BottomSheetModal, BottomSheetModalProps, useBottomSheetModal, BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
// Internal dependencies
import useThemeProvider from "../../../theme/ThemeProvider.controller";

interface ModalProps extends Omit<BottomSheetModalProps, 'ref'> {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  children,
  setVisible,
  ...restProps
}) => {

  // Ref for Modal
  const presentRef = useRef<BottomSheetModal>(null);

  // Memoized snap points for Present modal
  const snapPoints = useMemo(() => ["50%", '70%', "90%"], []);

  // Function to close the Present modal.
  const handleCloseModal = () => presentRef.current?.close();

  // Function to open the Present modal.
  const handleOpenModal = useCallback(() => {
    presentRef.current?.present();
  }, []);

  const { dismissAll } = useBottomSheetModal();

  useEffect(() => {

    if (visible) {
      dismissAll()
      handleOpenModal()
    } else {
      handleCloseModal()
    }

  }, [visible])

  const theme = useThemeProvider();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      index={0}
      ref={presentRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      enableDismissOnClose
      onDismiss={() => setVisible(false)}
      handleIndicatorStyle={{ backgroundColor: theme.colors.shadow }}
      backgroundStyle={{ backgroundColor: theme.colors.background, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 56 }}
      {...restProps}
      stackBehavior="replace"
    >
      {children}
    </BottomSheetModal>
  )
}

export default Modal;
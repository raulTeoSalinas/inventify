//React
import React, { useRef, useMemo, useCallback, useEffect } from "react";
import { View } from "react-native";
// External dependencies
import { BottomSheetFooter, BottomSheetFooterProps } from '@gorhom/bottom-sheet';// Internal dependencies
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Modal from "../Modal/Modal";
import { FooterContainer } from "../../molecules/SelectInput/SelectInput.styles";
import Button from "../../atoms/Button/Button";
import Text from "../../atoms/Text/Text";
import Icon from "../../atoms/Icon/Icon";

interface ModalDeleteProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  handleDelete: () => void;
  loading: boolean;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({
  visible,
  setVisible,
  handleDelete,
  loading
}) => {

  const insets = useSafeAreaInsets()

  const paddingBottom = insets.bottom === 0 ? 20 : insets.bottom;

  const handleCancel = () => {
    setVisible(false)
  }

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <FooterContainer paddingBottom={paddingBottom}>
          <Button onPress={handleCancel} backgroundColor="white" style={{ flex: 1 }} size="large" copyID="GENERAL_CANCEL" />
          <Button loading={loading} backgroundColor="error" onPress={handleDelete} style={{ flex: 1 }} size="large" copyID="GENERAL_DELETE" />
        </FooterContainer>
      </BottomSheetFooter>
    ),
    [handleDelete, paddingBottom, handleCancel]
  );

  return (
    <Modal footerComponent={renderFooter} visible={visible} setVisible={setVisible}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Icon color="error" size={80} name="warning-outline" />
        <Text bold size="huge" copyID="GENERAL_WARNING" />
        <Text style={{ marginTop: "4%" }} copyID="MODAL_DELETE_TITLE" />
        <Text bold size="small" textAlign="center" style={{ marginTop: "8%", marginHorizontal: "4%" }} copyID="MODAL_DELETE_RECOVER" />
      </View>


    </Modal >
  )
}

export default ModalDelete;
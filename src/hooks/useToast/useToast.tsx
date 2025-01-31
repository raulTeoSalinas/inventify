import React, { useState, createContext, useContext } from "react";
import { Text, Icon } from "../../designSystem";

import { TouchableOpacity, View } from "react-native";
import useThemeProvider from "../../theme/ThemeProvider.controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ToastContextProps {
  showToast: (toast: ToastMessage) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

type ToastType = 'success' | 'error' | 'info' | 'warning';
// Primero actualizamos los tipos
interface ToastMessage {
  type: ToastType;
  title: string;
  message: string;
  duration?: number | null; // null significa que no se cerrará automáticamente
  autoClose?: boolean;
}

// Actualizamos el ToastProvider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showToast = ({
    message,
    type,
    duration = 3000,
    autoClose = true,
    title
  }: ToastMessage) => {
    setToast({ message, type, duration, autoClose, title });
    setIsVisible(true);

    if (autoClose && duration) {
      setTimeout(() => {
        setIsVisible(false);
      }, duration);
    }
  };

  const hideToast = () => {
    setIsVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {isVisible && toast && (
        <AnimatedToast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          isVisible={isVisible}
          autoClose={toast.autoClose}
          onPress={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};

// Actualizamos el componente Toast
interface AnimatedToastProps {
  type: ToastType;
  message: string;
  title: string;
  isVisible: boolean;
  autoClose?: boolean;
  onPress: () => void;
}

export const AnimatedToast: React.FC<AnimatedToastProps> = ({
  type,
  message,
  title,
  isVisible,
  autoClose = true,
  onPress
}) => {
  const theme = useThemeProvider();

  const getBackgroundColor = (type: ToastType) => {
    switch (type) {
      case 'success': return theme.colors.successLight;
      case 'error': return theme.colors.errorLight;
      case 'warning': return theme.colors.warningLight;
      default: return theme.colors.successLight;
    }
  };
  const getBorderColor = (type: ToastType) => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      default: return theme.colors.success;
    }
  };

  const getTextColor = (type: ToastType) => {
    switch (type) {
      case 'success': return 'dark';
      case 'error': return 'error';
      case 'warning': return 'dark';
      default: return 'success';
    }
  };

  const getIconName = (type: ToastType) => {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'alert-circle';
      case 'warning': return 'warning';
      default: return 'checkmark-circle';
    }
  };

  const insets = useSafeAreaInsets();

  if (!isVisible) return null;

  return (
    <TouchableOpacity
      onPress={!autoClose ? onPress : undefined}
      activeOpacity={0.9}
      style={{
        marginHorizontal: 20,
        position: 'absolute',
        left: 0,
        right: 0,
        top: insets.top + 8,
        backgroundColor: getBackgroundColor(type),
        borderWidth: 2,
        borderColor: getBorderColor(type),
        padding: 10,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: "space-between"
      }}
    >
      <View>
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <Icon color={getTextColor(type)} name={getIconName(type)} />
          <Text bold copyID={title} color={getTextColor(type)} />

        </View>
        <Text size="small" copyID={message} color={getTextColor(type)} />

      </View>
      {!autoClose && (
        <Icon
          name="close"
          color={getTextColor(type)}
        />
      )}
    </TouchableOpacity>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
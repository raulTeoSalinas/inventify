import React, { useState } from 'react';
import { Animated } from 'react-native';

const useHideInScroll = () => {
  // State to control the vertical scroll value
  const [scrollY] = useState(new Animated.Value(0));

  // Function to handle the scroll event
  const handleChangeScrollY = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  // Interpolation for the header size based on the scroll offset
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [90, 0],
    extrapolate: 'clamp',
  });

  // The Animated.View component with the style adjusted based on the scroll offset
  const HideView = ({ children }: { children: React.ReactNode }) => (
    <Animated.View style={{ height: headerHeight }}>
      {children}
    </Animated.View>
  );


  return {
    HideView,
    handleChangeScrollY,
  };
};

export default useHideInScroll;

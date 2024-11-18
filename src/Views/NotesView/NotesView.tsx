
// React
import React, { useState } from 'react';
// React Native

// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout,
  Text,
  Searcher,
  PillButton,

} from "../../designSystem";
import { NotesViewProps } from "./NotesView.model";
import { TouchableOpacity, View, Animated } from "react-native";
import NoteCard from "./components/NoteCard/NoteCard";
import { FlatList } from "react-native";
import useThemeProvider from "../../theme/ThemeProvider.controller";
import NoteList from "./components/NoteList/NoteList";

const NotesView: React.FC<NotesViewProps> = (props) => {


  const [scrollY] = useState(new Animated.Value(0));

  const theme = useThemeProvider()

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],  // Rango de scroll para cambiar la altura
    outputRange: [90, 0],   // La altura del header se reduce de 80 a 0
    extrapolate: 'clamp',
  });

  const handleChangeScrollY = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  return (
    <ViewLayout>
      <Animated.View style={{ height: headerHeight }}>
        <Header copyIDTitle="NOTE_HEADER_TITLE" copyIDDescription="NOTE_HEADER_DESCRIPTION" />
      </Animated.View>
      <View style={{ backgroundColor: theme.colors.background }}>
        <Searcher placeHolderCopyID="NOTE_SEARCH_PLACEHOLDER" style={{ marginHorizontal: 12, marginVertical: 12 }} />
      </View>


      <NoteList onScroll={handleChangeScrollY} />

      <View style={{ position: 'absolute', bottom: 80, right: 12 }}>
        <PillButton style={{ width: 100 }} backgroundColor="secondary" textColor="background" textSize="extraSmall" iconName="add-circle" copyID="Crear" />

      </View>
    </ViewLayout>
  )
}

export default NotesView;


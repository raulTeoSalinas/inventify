
// React
import React, { useEffect, useState } from 'react';
// React Native

// External Dependencies
// Internal Dependencies
import {
  Header,
  ViewLayout,
  Searcher,
  PillButton,

} from "../../../designSystem";
import { NotesViewProps } from "./NotesView.model";
import NoteList from "./components/NoteList/NoteList";
import useHideInScroll from "../../../hooks/useHideInScroll/useHideInSroll";
import { HeaderWrapper, ButtonWrapper } from "./NotesView.styles";
import useNavigation from "../../../navigation/useNavigation/useNavigation";
import { useMainContext } from "../../../contexts/mainContext";

const NotesView: React.FC<NotesViewProps> = (props) => {


  const { HideView, handleChangeScrollY } = useHideInScroll();

  const navigation = useNavigation();

  const handleCreate = () => {
    navigation.navigate("CUNotesView", {})
  }

  const [search, setSearch] = useState("");

  const { notes } = useMainContext();

  const [notesFiltered, setNotesFiltered] = useState(notes.all.list ?? []);
  useEffect(() => {
    if (search === "") {
      setNotesFiltered(notes.all.list ?? []);
      return;
    }

    if (notes.all.list) {
      const filtered = notes.all.list.filter((note) => {
        const normalizedSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const normalizedCustomerName = note.idCustomers?.name?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return (normalizedCustomerName ?? "").includes(normalizedSearch) || note.id?.toString().includes(search);
      });
      setNotesFiltered(filtered);
    }
  }, [notes.all.list, search])



  return (
    <ViewLayout>
      <HideView>
        <Header copyIDTitle="NOTE_HEADER_TITLE" copyIDDescription="NOTE_HEADER_DESCRIPTION" />
      </HideView>
      <HeaderWrapper>
        <Searcher setText={setSearch} placeHolderCopyID="NOTE_SEARCH_PLACEHOLDER" style={{ marginHorizontal: 12, marginVertical: 12 }} />
      </HeaderWrapper>
      <NoteList notes={notesFiltered} onScroll={handleChangeScrollY} />
      <ButtonWrapper>
        <PillButton onPress={handleCreate} backgroundColor="secondary" textColor="background" textSize="extraSmall" iconName="add-circle" copyID="GENERAL_CREATE" />
      </ButtonWrapper>
    </ViewLayout>
  )
}

export default NotesView;


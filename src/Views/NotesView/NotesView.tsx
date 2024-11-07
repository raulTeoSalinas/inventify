
// React
import React from 'react'
// React Native

// External Dependencies
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
// Internal Dependencies
import {
    Text,
} from "../../designSystem"
import { Container, Header } from "./NotesView.styles"
import { NotesViewProps } from "./NotesView.model"

const NotesView: React.FC<NotesViewProps> = (props) => {


    return (
        <BottomSheetModalProvider>

            <Container>
                <Header>
                    <Text style={{ marginTop: 40 }} bold size="huge">Track your flight</Text>
                    <Text>Keep you informed in real time!</Text>
                </Header>


            </Container>
        </BottomSheetModalProvider>

    )
}

export default NotesView;


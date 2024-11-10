
// React
import React from 'react'
// React Native

// External Dependencies
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
// Internal Dependencies
import {
    Text,
} from "../../designSystem"
import { Container, Header } from "./DashBoardView.styles"
import { DashBoardViewProps } from "./DashBoardView.model"

const DashBoardView: React.FC<DashBoardViewProps> = (props) => {


    return (
        <BottomSheetModalProvider>

            <Container>
                <Header>
                    <Text style={{ marginTop: 40 }} copyID="DASH_TITLE" bold size="huge" />
                    <Text>Keep you informed in real time!</Text>
                </Header>


            </Container>
        </BottomSheetModalProvider>

    )
}

export default DashBoardView;



// React
import React from 'react'
// React Native

// External Dependencies
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
// Internal Dependencies
import {
    Text,
} from "../../designSystem"
import { Container, Header } from "./InventoriesView.styles"
import { InventoriesViewProps } from "./InventoriesView.model"

const InventoriesView: React.FC<InventoriesViewProps> = (props) => {


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

export default InventoriesView;


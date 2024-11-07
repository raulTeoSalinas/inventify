// React
import { useMemo, useRef, useCallback } from "react";
// External Dependencies
import { BottomSheetModal } from '@gorhom/bottom-sheet';
// Internal Dependencies
import { Airport } from "../models/Airport";

// Custom hook to manage airport selection and Present modal interactions.

const useInputLocation = (setAirport: (airport: Airport | null) => void) => {

    // Ref for Modal
    const presentRef = useRef<BottomSheetModal>(null);

    // Memoized snap points for Present modal
    const snapPoints = useMemo(() => ["50%", '80%'], []);

    // Function to close the Present modal.
    const closeModal = () => presentRef.current?.close();

    // Function to open the Present modal.
    const handleOpenModal = useCallback(() => {
        presentRef.current?.present();
    }, []);

    /**
     * Handler function when an airport is selected.
     * Updates the selected airport state and closes the modal.
     * @param selectedAirport The airport object selected by the user.
     */
    const handlePressAirport = (selectedAirport: Airport) => {
        setAirport(selectedAirport);
        closeModal();
    };

    // Return state and functions to be used by the component
    return {
        snapPoints,
        presentRef,
        handleOpenModal,
        handlePressAirport,
    };
};

export default useInputLocation;
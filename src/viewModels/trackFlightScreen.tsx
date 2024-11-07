// React
import { useState } from "react";
// External Dependencies
import { NativeStackScreenProps } from "@react-navigation/native-stack";
// Internal Dependencies
import { RootStackParamList } from "../../App";
import { Airport } from "../models/Airport";

type useTrackFlightScreenProps = {
    prop: NativeStackScreenProps<RootStackParamList, "TrackFlightScreen">;
};

const useTrackFlightScreen = (prop: useTrackFlightScreenProps) => {

    const [originAirport, setOriginAirport] = useState<Airport | null>(null);
    const [destinationAirport, setDestinationAirport] = useState<Airport | null>(null);
    const [departureDate, setDepartureDate] = useState<string | null>(null);
    const [flightNumber, setFlightNumber] = useState<string>("");
    const [isByFlightNumber, setIsByFlightNumber] = useState<boolean>(true);
    const [isValidated, setIsValidated] = useState(true)

    const airports: Airport[] = [{ city: "Mexico City", code: "MEX" }, { city: "Cancún", code: "CUN" }]


    const navigateFLScreenByNumber = () => {
        if (departureDate != null && flightNumber != "") {
            setIsValidated(true);
            prop.prop.navigation.navigate("FlightsListingScreen", {
                departureDate: departureDate,
                flightNumber: flightNumber,
                destinationAirport: null,
                originAirport: null,
            })
        } else {
            setIsValidated(false)
        }

    }

    const navigateFLScreenByDestination = () => {

        if (departureDate != null && destinationAirport != null && originAirport != null) {
            setIsValidated(true);
            prop.prop.navigation.navigate("FlightsListingScreen", {
                departureDate: departureDate,
                flightNumber: null,
                destinationAirport: destinationAirport,
                originAirport: originAirport,
            })
        } else {
            setIsValidated(false)
        }

    }

    return {
        isByFlightNumber,
        setIsByFlightNumber,
        navigateFLScreenByDestination,
        navigateFLScreenByNumber,
        isValidated,
        flightNumber,
        setFlightNumber,
        departureDate,
        setDepartureDate,
        airports,
        originAirport,
        setOriginAirport,
        destinationAirport,
        setDestinationAirport,
    }
}

export default useTrackFlightScreen;
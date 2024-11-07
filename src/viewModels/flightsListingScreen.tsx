// React
import { useEffect } from "react";
// External Dependencies
import { useDispatch, useSelector } from 'react-redux';
// Internal Dependencies
import { RootState, AppDispatch } from "../redux/store"
import { fetchFlightStatusByAirportsAndDate, fetchFlightStatusByFlightCode, addFavorite, removeFavorite } from "../redux/flightsSlice"
import { FlightStatus } from "../models/FlightStatus"
import { Airport } from "../models/Airport";

type useFlightsListingScreenProps = {
    departureDate: string | null;
    flightNumber: string | null;
    destinationAirport: Airport | null
    originAirport: Airport | null
}

const useFlightsListingScreen = ({ departureDate, flightNumber, destinationAirport, originAirport }: useFlightsListingScreenProps) => {

    const dispatch = useDispatch<AppDispatch>();
    const { flightStatusCollection, favorites } = useSelector((state: RootState) => state.flights);

    const formatDate = (dateToFormat: string) => {
        // Create a Date object with the local time zone to avoid mismatches       
        const [year, month, day] = dateToFormat.split('-').map(Number);
        const date = new Date(year, month - 1, day);

        // Convert the date to the time zone and format it
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'America/Mexico_City',
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        };
        const formattedDate = date.toLocaleDateString('en-US', options)

        return formattedDate
    }

    const handleFetchByFlightCode = () => {
        dispatch(fetchFlightStatusByFlightCode({
            flightCode: flightNumber!,
            date: departureDate!
        }));
    };

    const handleFetchByAirportsAndDate = () => {
        dispatch(fetchFlightStatusByAirportsAndDate({
            departureAirport: originAirport?.code!,
            arrivalAirport: destinationAirport?.code!,
            date: departureDate!
        }));
    };

    const handleAddFavorite = (flight: FlightStatus) => {
        dispatch(addFavorite(flight));
    };

    const handleRemoveFavorite = (segmentCode: string) => {
        dispatch(removeFavorite(segmentCode));
    };

    useEffect(() => {

        if (flightNumber) {
            handleFetchByFlightCode()
        } else {
            handleFetchByAirportsAndDate()
        }

    }, [flightNumber]);

    const flightsToDisplay = [...favorites, ...flightStatusCollection.filter(
        flight => !favorites.some(fav => fav.segment.segmentCode === flight.segment.segmentCode)
    )];


    return {
        flightsToDisplay,
        handleRemoveFavorite,
        handleAddFavorite,
        flightStatusCollection,
        favorites,
        formatDate

    }

}

export default useFlightsListingScreen;
// React
import { useMemo } from "react";

const useFlightDetailScreen = () => {

    const snapPoints = useMemo(() => ['60%', '80%'], []);

    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const formatDate = (dateString: string) => {

        const date = new Date(dateString);

        // Convert the date to the time zone and format it
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'America/Mexico_City',
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        };
        const formattedDate = date.toLocaleDateString('en-US', options);

        return formattedDate

    };

    return {
        snapPoints,
        capitalizeFirstLetter,
        formatDate
    }
}

export default useFlightDetailScreen;
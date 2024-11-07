export interface FlightStatus {
    status: string;
    boardingTerminal: string;
    boardingGate: string;
    boardingTime: string;
    estimatedDepartureTime: string;
    estimatedArrivalTime: string;
    delayInMinutes: number;
    arrivalTerminal: string;
    arrivalGate: string;
    segment: {
        segmentCode: string;
        departureAirport: string;
        arrivalAirport: string;
        departureDateTime: string;
        arrivalDateTime: string;
        flightStatus: string;
        operatingCarrier: string;
        marketingCarrier: string;
        operatingFlightCode: string;
        marketingFlightCode: string;
        flightDurationInMinutes: number;
        aircraftType: string;
        stops: any[];
    };
    outGate: {
        accuracy: string;
        dateTimeUtc: string;
        dateTimeLocal: string;
        sourceType: string;
    };
    legType: string;
    totalFlightTimeInMinutes: number;
};
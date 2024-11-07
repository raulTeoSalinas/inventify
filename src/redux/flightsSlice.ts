import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FlightStatus } from "../models/FlightStatus";
import { fakeData } from "./fakeData";

type FlightsState = {
    flightStatusCollection: FlightStatus[];
    loading: boolean;
    error: string | null;
    favorites: FlightStatus[];
};

const initialState: FlightsState = {
    flightStatusCollection: [],
    loading: false,
    error: null,
    favorites: [],
};

// Simulate endpoint response
const mockFlightStatusResponse = fakeData;

// Asyncronic Thunks  to simulate calls to endpoints
export const fetchFlightStatusByFlightCode = createAsyncThunk(
    'flights/fetchFlightStatusByFlightCode',
    async ({ flightCode, date }: { flightCode: string; date: string }) => {
        // Filter hardcoded by flightCode and date
        const response = mockFlightStatusResponse.flightStatusCollection.filter(
            flight => flight.segment.operatingFlightCode === flightCode &&
                flight.estimatedDepartureTime.startsWith(date)
        );
        return response;
    }
);

export const fetchFlightStatusByAirportsAndDate = createAsyncThunk(
    'flights/fetchFlightStatusByAirportsAndDate',
    async ({ departureAirport, arrivalAirport, date }: { departureAirport: string; arrivalAirport: string; date: string }) => {
        // Filter hardcoded by origin, arrival airports and date
        const response = mockFlightStatusResponse.flightStatusCollection.filter(
            flight => flight.segment.departureAirport === departureAirport &&
                flight.segment.arrivalAirport === arrivalAirport &&
                flight.estimatedDepartureTime.startsWith(date)
        );
        return response;
    }
);

const flightsSlice = createSlice({
    name: 'flights',
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<FlightStatus>) => {
            state.favorites.push(action.payload);
        },
        removeFavorite: (state, action: PayloadAction<string>) => {
            state.favorites = state.favorites.filter(
                flight => flight.segment.segmentCode !== action.payload
            );
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFlightStatusByFlightCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFlightStatusByFlightCode.fulfilled, (state, action) => {
                state.loading = false;
                state.flightStatusCollection = action.payload;
            })
            .addCase(fetchFlightStatusByFlightCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch flight status';
            })
            .addCase(fetchFlightStatusByAirportsAndDate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFlightStatusByAirportsAndDate.fulfilled, (state, action) => {
                state.loading = false;
                state.flightStatusCollection = action.payload;
            })
            .addCase(fetchFlightStatusByAirportsAndDate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch flight status';
            });
    },
});

export const { addFavorite, removeFavorite } = flightsSlice.actions;
export default flightsSlice.reducer;

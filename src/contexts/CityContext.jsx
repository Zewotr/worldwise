import { createContext, useContext, useEffect, useReducer } from "react";
import { createCityInDb, deleteCityFromDb, fetchCityByIdFromDb, fetchCitiesFromDb } from "../lib/supabase";

const CityContext = createContext();

function mapCityRow(row) {
    return {
        id: row.id,
        cityName: row.city_name,
        country: row.country,
        emoji: row.emoji,
        date: row.visited_at,
        notes: row.notes ?? "",
        position: {
            lat: Number(row.lat),
            lng: Number(row.lng),
        },
    };
}

function toIsoDate(value) {
    const dateValue = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(dateValue.getTime())) return null;
    return dateValue.toISOString().slice(0, 10);
}

function serializeCity(city) {
    return {
        city_name: city.cityName,
        country: city.country,
        emoji: city.emoji,
        visited_at: toIsoDate(city.date),
        notes: city.notes ?? "",
        lat: Number(city.position.lat),
        lng: Number(city.position.lng),
    };
}

const reducer = (state, action) => {
    switch (action.type) {
        case "cities/loading":
            return { ...state, isLoading: true, error: null };
        case "cities/loaded":
            return { ...state, isLoading: false, cities: action.payload, error: null };
        case "city/loading":
            return { ...state, isLoading: true, error: null };
        case "city/loaded":
            return { ...state, isLoading: false, curentCity: action.payload, error: null };
        case "city/created":
            return { ...state, isLoading: false, cities: [...state.cities, action.payload], curentCity: action.payload, error: null };
        case "city/deleted":
            return { ...state, isLoading: false, cities: state.cities.filter(city => city.id !== action.payload), curentCity: state.curentCity.id === action.payload ? {} : state.curentCity, error: null };
        case "rejected":
            return { ...state, isLoading: false, error: action.payload };
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}
const initialState = {
    cities: [],
    isLoading: false,
    curentCity: {},
    error: null,
};

function CitiesProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { cities, isLoading, curentCity, error } = state;
    useEffect(() => {
        let ignore = false;
        async function fetchCities() {
            dispatch({ type: "cities/loading" });
            try {
                const data = await fetchCitiesFromDb();
                if (ignore) return;
                dispatch({ type: "cities/loaded", payload: data.map(mapCityRow) });
            } catch (err) {
                if (ignore) return;
                dispatch({ type: "rejected", payload: err.message || "There was an error loading data..." });
            } 
            
        }
        fetchCities();

        return () => {
            ignore = true;
        };
    }, []);

     async function getCity(id) {
        if (id === curentCity.id) return;
        try {
                dispatch({ type: "city/loading" });
                const data = await fetchCityByIdFromDb(id);
                dispatch({ type: "city/loaded", payload: mapCityRow(data) });
            } catch (err) {
                dispatch({ type: "rejected", payload: err.message || "There was an error loading data..." });
            } 
        }
    
    async function createCity(newCity) {
            try {
                dispatch({ type: "cities/loading" });
                const payload = serializeCity(newCity);
                const data = await createCityInDb(payload);
                const createdCity = mapCityRow(data);
                dispatch({ type: "city/created", payload: createdCity });
                return createdCity;
            } catch (err) {
                dispatch({ type: "rejected", payload: err.message || "There was an error Creating city..." });
                return null;
            }
        }
    async function deleteCity(id) {
            try {
                dispatch({ type: "cities/loading" });
                await deleteCityFromDb(id);
                dispatch({ type : "city/deleted", payload: id });
            } catch (err) {
                dispatch({ type: "rejected", payload: err.message || "There was an error Deleting city..." });
            } 

        }

    return (
        <CityContext.Provider value={{ cities, isLoading, curentCity, getCity, createCity, deleteCity, error }}>
            {children}
        </CityContext.Provider>
    );
}

function useCities() {
    const context = useContext(CityContext);
    if (!context) {
        throw new Error("useCities must be used within a CitiesProvider");
    }
    return context;
}

export {CitiesProvider, useCities};

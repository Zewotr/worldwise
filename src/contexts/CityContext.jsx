import { createContext, useContext, useEffect, useReducer, useState  } from "react";

const BASE_URL = "http://localhost:9000";

const CityContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "cities/loading":
            return { ...state, isLoading: true };
        case "cities/loaded":
            return { ...state, isLoading: false, cities: action.payload };
        case "city/loading":
            return { ...state, isLoading: true };
        case "city/loaded":
            return { ...state, isLoading: false, curentCity: action.payload };
        case "city/created":
            return { ...state, isLoading: false, cities: [...state.cities, action.payload], curentCity: action.payload };
        case "city/deleted":
        return { ...state, isLoading: false, cities: state.cities.filter(city => city.id !== action.payload), curentCity : {} };
        case "city/setCurrent":
            return { ...state,isLoading:false, curentCity: action.payload };
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
    // const [cities, setCities] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [curentCity, setCurentCity] = useState({});

    useEffect(() => {
        async function fetchCities() {
            dispatch({ type: "cities/loading" });
            try {
                // setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                // setCities(data); // 3. Save the data to state
                dispatch({ type : "cities/loaded", payload: data });
            } catch {
                // console.log("There was an error loading data...");
                dispatch({ type: "rejected", payload: "There was an error loading data..." });
            } 
            
        }
        fetchCities();
    }, []);

     async function getCity(id) {
        // if (Number(id) === curentCity.id) return; // prevent unnecessary fetch if the city is already the current city
        try {
                dispatch({ type: "city/loading" });
                // setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities/${id}`);
                const data = await res.json();
                // setCurentCity(data); // 3. Save the data to state
                dispatch({ type : "city/setCurrent", payload: data });
            } catch {
                // console.log("There was an error loading data...");
                dispatch({ type: "rejected", payload: "There was an error loading data..." });
            } 
        }
    
    async function createCity(newCity) {
            try {
                // setIsLoading(true);
                dispatch({ type: "cities/loading" });
                const res = await fetch(`${BASE_URL}/cities/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newCity),
                });
                const data = await res.json();
                // setCities((cities)=> [...cities, data]) // 3. Save the data to state
                dispatch({ type : "city/created", payload: data });
            } catch {
                // console.log("There was an error Creating city...");
                dispatch({ type: "rejected", payload: "There was an error Creating city..." });
            }
            //  finally {
            //     // setIsLoading(false);
            //     dispatch({ type: "city/loaded", payload: [] });
            // }            // We can decide to not set loading to false here, because after creating a city, we usually want to fetch the updated list of cities or navigate to the city details, which will trigger another loading state. Setting it to false here might cause unnecessary re-renders or a brief flash of the UI before the next loading state kicks in. so  reducer function holds all the logic to set loading to false after creating a city, when we dispatch the "city/created" action, we can set isLoading to false in the reducer, and then when we fetch the updated list of cities or navigate to the city details, we can set loading to true again, which will give us a smoother user experience without unnecessary loading states in between. the same to others
        }
    async function deleteCity(id) {
            try {
                // setIsLoading(true);
                dispatch({ type: "cities/loading" });
                await fetch(`${BASE_URL}/cities/${id}`, {
                    method: "DELETE",
                });
                // setCities((cities)=>cities.filter((city)=>city.id !== id )); // 3. Save the data to state
                dispatch({ type : "city/deleted", payload: id });
            } catch {
                // console.log("There was an error Deleting city...");
                dispatch({ type: "rejected", payload: "There was an error Deleting city..." });
            } 

        }

    return (
        <CityContext.Provider value={{ cities, isLoading, curentCity , getCity, createCity ,deleteCity , Error }}>
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
import { createContext, useContext, useEffect, useState  } from "react";

const BASE_URL = "http://localhost:9000";

const CityContext = createContext();

function CitiesProvider({ children }) {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [curentCity, setCurentCity] = useState({});

    useEffect(() => {
        async function fetchCities() {
            try {
                setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                setCities(data); // 3. Save the data to state
            } catch {
                console.log("There was an error loading data...");
            } finally {
                setIsLoading(false);
            }
        }
        fetchCities();
    }, []);

     async function getCity(id) {
            try {
                setIsLoading(true);
                const res = await fetch(`${BASE_URL}/cities/${id}`);
                const data = await res.json();
                setCurentCity(data); // 3. Save the data to state
            } catch {
                console.log("There was an error loading data...");
            } finally {
                setIsLoading(false);
            }
        }
        
    return (
        <CityContext.Provider value={{ cities, isLoading, curentCity , getCity }}>
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
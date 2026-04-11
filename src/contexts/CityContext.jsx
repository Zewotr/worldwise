import { createContext, useContext, useEffect, useReducer } from "react";

const CityContext = createContext();
const STORAGE_KEY = "worldwise_cities";

function getStoredCities() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveCities(cities) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        curentCity: action.payload,
        error: null,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        curentCity: state.curentCity.id === action.payload ? {} : state.curentCity,
        error: null,
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

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
    dispatch({ type: "cities/loading" });

    try {
      const data = getStoredCities();
      if (!ignore) {
        dispatch({ type: "cities/loaded", payload: data });
      }
    } catch (err) {
      if (!ignore) {
        dispatch({ type: "rejected", payload: err.message || "There was an error loading data..." });
      }
    }

    return () => {
      ignore = true;
    };
  }, []);

  async function getCity(id) {
    if (id === curentCity.id) return;
    dispatch({ type: "city/loading" });

    try {
      const citiesFromStorage = getStoredCities();
      const city = citiesFromStorage.find((item) => item.id === id);
      if (!city) throw new Error("City not found.");
      dispatch({ type: "city/loaded", payload: city });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message || "There was an error loading data..." });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "cities/loading" });
      const createdCity = { ...newCity, id: generateId() };
      const updatedCities = [...cities, createdCity];
      saveCities(updatedCities);
      dispatch({ type: "city/created", payload: createdCity });
      return createdCity;
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message || "There was an error creating city..." });
      return null;
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "cities/loading" });
      const updatedCities = cities.filter((city) => city.id !== id);
      saveCities(updatedCities);
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({ type: "rejected", payload: err.message || "There was an error deleting city..." });
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

export { CitiesProvider, useCities };

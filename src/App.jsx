import { BrowserRouter,Form,Route, Routes } from "react-router-dom";
import { useEffect, useState } from 'react'
import Homepage from "./pages/Homepage.jsx";
import Product from "./pages/Product.jsx";
import Pricing from "./pages/Pricing.jsx";
import AppLayout from "./pages/AppLayout.jsx";
import Login from "./components/Login.jsx";
import CityItem from "./components/CityItem.jsx"
import CityList from "./components/CityList.jsx"
import CountryItem from "./components/CountryItem.jsx"
// import Form from "./components/Form.jsx"

function App() {
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchCities() {
            try {
                setIsLoading(true);
                const res = await fetch("http://localhost:9000/cities");
                const data = await res.json();
                setCities(data); // 3. Save the data to state
            } catch {
                alert("There was an error loading data...");
            } finally {
                setIsLoading(false);
            }
        }
        fetchCities();
    }, []);

  return (
    <>  
        <BrowserRouter> 
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/product" element={<Product />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/app" element={<AppLayout />}>
                    <Route index element={<CityList cities={cities} isLoading={isLoading} />} />
                    <Route path="cities" element={<CityItem cities={cities} isLoading={isLoading} />} />
                    <Route path="country" element={<CountryItem /> } />
                    <Route path="form" element={<Form />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<h2>Page Not Found</h2>} />
            </Routes>   
        </BrowserRouter>
  </>)
}

export default App

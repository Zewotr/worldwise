import { BrowserRouter,Navigate,Route, Routes } from "react-router-dom";
import { CitiesProvider } from "./contexts/CityContext.jsx";
import Homepage from "./pages/Homepage.jsx";
import Product from "./pages/Product.jsx";
import Pricing from "./pages/Pricing.jsx";
import AppLayout from "./pages/AppLayout.jsx";
import Login from "./components/Login.jsx";
import City from "./components/City.jsx"
import CityList from "./components/CityList.jsx"
import CountryList from "./components/CountryList.jsx";
import Form from "./components/Form.jsx"
import { AuthProvider } from "./contexts/FakeAuthContext.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx";

function App() {
   

  return (
    <AuthProvider>
    <CitiesProvider>
        <BrowserRouter> 
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/product" element={<Product />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/app" 
                        element={ 
                        <ProtectedRoute > 
                            <AppLayout /> 
                        </ProtectedRoute>}
                        >
                    <Route index element={<Navigate replace to="cities" /> } />
                    <Route path="cities" element={<CityList />} />
                    <Route path="countries" element={<CountryList /> } />
                    <Route path="cities/:id" element={<City />} />
                    <Route path="form" element={<Form /> } />
                </Route>
                
                <Route path="/login" element={<Login />} />
                
                <Route path="*" element={<h2>Page Not Found</h2>} />
            </Routes>   
        </BrowserRouter>
    </CitiesProvider>
    </AuthProvider>
   );
}

export default App

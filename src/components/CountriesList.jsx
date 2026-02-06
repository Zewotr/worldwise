import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import styles from './CountriesList.module.css'
export default function CountriesList({cities, isLoading}) {
    const {cityCountry} = city;

    if (isLoading) return <Spinner />;
    if (!cities.length) return <Message message="Add your first city by clicking on the map!" />;

return (
        <ul className={styles.countriesList}>
            {/* 4. Map over the 'cities' state variable */}
            {cities.map(city => (
                    <CountryItem key={city.id} country={cityCountry} /> 
            ))}
        </ul>
    );
}
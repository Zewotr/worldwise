import Spinner from "./Spinner";
import CityItem from "./CityItem";
import Message from "./Message";
import styles from './CityList.module.css'
import { useCities } from "../contexts/CityContext";
export default function CityList() {
    const {cities, isLoading} = useCities();

    if (isLoading) return <Spinner />;
    if (!cities.length) return <Message message="Add your first city by clicking on the map!" />;

return (
        <ul className={styles.cityList}>
            {/* 4. Map over the 'cities' state variable */}
            {cities.map(city => (
                    <CityItem key={city.id} city={city} /> 
            ))}
        </ul>
    );
}
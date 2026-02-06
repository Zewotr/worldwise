import AppNav from "../components/AppNav.jsx"
import Sidebar from "../components/Sidebar.jsx"
import Map from "../components/Map.jsx"

import styles from './AppLayout.module.css'
export default function AppLayout() {
  return (
    <div className={styles.app}>
    {/* <AppNav /> */}
    <Sidebar />
    <Map />
    </div>
  )
}

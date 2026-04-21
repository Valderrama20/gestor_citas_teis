import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import Navbar from "../Navbar";
import styles from "./MainLayout.module.css";

export default function MainLayout() {
  return (
    <div className={styles.container}>
      <div className={styles.blobTop} />
      <div className={styles.blobBottom} />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

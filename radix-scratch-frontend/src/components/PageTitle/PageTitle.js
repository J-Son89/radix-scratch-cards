import styles from "./PageTitle.module.css";

export const PageTitle = ({ label }) =>
    <h3 className={styles.pageTitle}>{label} </h3>


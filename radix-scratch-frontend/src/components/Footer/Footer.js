import styles from "./Footer.module.css";
import cx from "classnames";
import { useLocation } from "react-router-dom";

export const Footer = ({ }) => {
  const { pathname } = useLocation();

  return (
    <div
      className={cx(styles.footerContainer, {
      })}
    >
      <div className={styles.logoContainer}>
        <h1 className={styles.logo}>
          <span className={styles.underline}>
            <span className={styles.number}>123</span>
            <span className={styles.letters}>NFT</span>
          </span>
        </h1>
      </div>
   

    </div>
  );
};

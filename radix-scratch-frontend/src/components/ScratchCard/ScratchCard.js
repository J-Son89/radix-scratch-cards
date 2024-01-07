import { useContext } from "react";
import styles from "./Header.module.css";
import cx from "classnames";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { IconLink } from "../IconLink/IconLink";
import { appState } from "../../appState";

const shortAddress = (address) => `${address.substring(0,3)}...${address.substring(address.length-3)}`

export const Header = ({ }) => {
  const [state] = useContext(appState);

  const { pathname } = useLocation();
  return (
    <div
      className={styles.scratchCard} 
    >
     

    </div>
  );
};

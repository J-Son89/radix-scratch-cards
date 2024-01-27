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
      className={cx(styles.headerContainer, {
        isHomePage: false,
      })}
    >
      <IconLink />

      <Link className={cx(styles.normalLink, styles.firstLink)} to={"adminPage"}>
        Admin
      </Link>
      <Link className={styles.normalLink} to={"createBatch"}>
        Make Batch
      </Link>
      <Link className={cx(styles.normalLink, styles.firstLink)} to={"buyPage"}>
        Buy Page
      </Link>
    

      <div className={styles.detailContainer}>
        <p>Account Name:</p>
        <pre id="accountName">{state.account && state.account.label || "None connected"}</pre>
      </div>

      <div className={styles.detailContainer}>
        <p>Account Address:</p>
        <pre id="accountAddress">{state.account && shortAddress(state.account.address) || "None connected"}</pre>
      </div>

      <div className={styles.connectButton}>
        <radix-connect-button />
      </div>

    </div>
  );
};

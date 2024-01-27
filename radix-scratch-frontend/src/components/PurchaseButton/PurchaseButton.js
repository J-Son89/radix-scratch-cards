import { Button } from "../Button/Button";
import styles from "./PurchaseButton.module.css";

export const PurchaseButton = (props) =>
    <Button {...props} className={styles.purchaseBtn}

    >
        <div className={styles.innerContainer}/>
            Buy
            <div className={styles.nowContainer}>
                Now
            </div>


    </Button>

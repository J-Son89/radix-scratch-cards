import Modal from "react-modal";
import styles from './Modal.module.css'

export const ScratchModal = ({
    modalIsOpen,
    afterOpenModal,
    closeModal,
    children
}) => {
    return (
        <Modal
        id="modal"
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={{
                overlay: {
                    zIndex: 100,
                    border: "2px solid #fa7d09",
                    margin: "auto",

                    position: "fixed", /* Stay in place */
                    left: 0,
                    top: 0,
                    overflow: "auto", /* Enable scroll if needed */
                    backgroundColor: "rgba(0,0,0,0.8)", /* Black w/ opacity */
                },
                content: {
                  }
            }}
            contentLabel="Card Viewer"
        >
            <div className={styles.container}>

                {children}
            </div>
        </Modal>
    );
};

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
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={{
                overlay: {
                    zIndex: 100,
                    border: "2px solid #fa7d09",
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

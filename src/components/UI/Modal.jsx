import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import classes from "./Modal.module.css";
import Button from "./Button";

const Modal = ({ children, open, onClose, className = "" }) => {
  const dialog = useRef(null);
  // Use effect to handle modal show/close
  useEffect(() => {
    const modal = dialog.current;
    if (modal && open) {
      modal.showModal();
    }

    // Cleanup
    return () => {
      if (modal && modal.close) {
        modal.close();
      }
    };
  }, [open]);

  // Prevent modal close when clicking inside the dialog
  const handleDialogClick = (e) => {
    e.stopPropagation();
  };

  if (!open) return null;

  return createPortal(
    <div className={classes[`modal-overlay`]} onClick={handleDialogClick}>
      <dialog
        ref={dialog}
        className={`${classes["modal"]} ${className}`}
        onClick={handleDialogClick}
      >
        {children}
        <Button onClick={onClose} className={classes["modal-close-button"]}>
          Close
        </Button>
      </dialog>
    </div>,
    document.getElementById("modal")
  );
};

export default Modal;

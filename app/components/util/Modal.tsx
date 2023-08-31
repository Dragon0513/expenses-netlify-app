import type { MouseEventHandler, ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose?: MouseEventHandler;
}

function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <dialog
        className="modal"
        open
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </dialog>
    </div>
  );
}

export default Modal;

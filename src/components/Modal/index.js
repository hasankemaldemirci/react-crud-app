import React from "react";

// Styles
import "./style.scss";

const Modal = props => {
  const { children, activeModal } = props;

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-content__title">
          {activeModal === "create" && "Create User"}
          {activeModal === "update" && "Update User"}
          {activeModal === "delete" && "Delete User"}
        </div>
        <div className="modal-content__body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

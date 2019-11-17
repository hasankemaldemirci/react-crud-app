import React, { useState, useEffect } from "react";

const DeleteUser = props => {
  const [user, setUser] = useState(props.currentUser);

  useEffect(() => {
    setUser(props.currentUser);
  }, [props]);

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        props.deleteUser(user.id);
      }}>
      <div className="form-group">
        Are you sure you want to delete {user.first_name} {user.last_name}?
      </div>
      <div className="form-group form-group--actions">
        <button className="primary-btn">Delete</button>
        <button className="cancel-btn" onClick={() => props.setShowModal(false)}>Cancel</button>
      </div>
    </form>
  );
};

export default DeleteUser;

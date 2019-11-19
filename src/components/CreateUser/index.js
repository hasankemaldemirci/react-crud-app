import React, { useState } from "react";

const CreateUser = props => {
  const initialData = { id: null, first_name: "", last_name: "", email: "" };
  const [user, setUser] = useState(initialData);

  const onInputChange = event => {
    const { name, value } = event.target;

    setUser({ ...user, [name]: value });
  };

  const cancel = event => {
    event.preventDefault();
    props.setActiveModal({ active: false });
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        if (!user.first_name || !user.last_name) return;
        props.createUser(user);
      }}
    >
      <div className="form-group">
        <label>First Name</label>
        <input
          type="text"
          name="first_name"
          value={user.first_name}
          onChange={onInputChange}
        />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input
          type="text"
          name="last_name"
          value={user.last_name}
          onChange={onInputChange}
        />
      </div>
      <div className="form-group">
        <label>E-Mail</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={onInputChange}
        />
      </div>
      <div className="form-group form-group--actions">
        <button className="primary-btn">Create</button>
        <button className="cancel-btn" onClick={cancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateUser;

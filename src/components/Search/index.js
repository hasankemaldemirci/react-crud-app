import React, { useState } from "react";

// Styles
import "./style.scss";

const Search = props => {
  const [searchTerm, setSearchTerm] = useState("");

  const onInputChange = event => {
    const value = event.target.value;
    setSearchTerm(value);
    if (!value.length) {
      props.search(value);
    }
  };

  return (
    <form
      className="search-form"
      onSubmit={event => {
        event.preventDefault();
        props.search(searchTerm);
      }}>
      <div className="form-group">
        <input id="search-input" type="text" placeholder="Search" onChange={onInputChange} />
        <button className="primary-btn">Search</button>
      </div>
    </form>
  );
};

export default Search;

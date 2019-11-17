import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "./app/api";

// Styles
import "./app.scss";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import DataTable from "./components/DataTable";
import CreateUser from "./components/CreateUser";
import UpdateUser from "./components/UpdateUser";
import DeleteUser from "./components/DeleteUser";
import Modal from "./components/Modal";
import Search from "./components/Search";
import Pagination from "./components/Pagination";

function App() {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users);

  const initialUser = {
    id: null,
    avatar: null,
    first_name: "",
    last_name: "",
    email: ""
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentUser, setCurrentUser] = useState(initialUser);
  const [showModal, setShowModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [savedUsers, setSavedUsers] = useState(users);
  const [pageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Operations
  const createUser = user => {
    user.id = users.length + 1;
    dispatch({ type: "CREATE_USER", data: user });
    setSavedUsers([...users, user]);
  };

  const updateRow = user => {
    setModal("update");

    setCurrentUser({
      id: user.id,
      avatar: user.avatar,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    });
  };

  const updateUser = (id, updatedUser) => {
    setShowModal(false);

    dispatch({
      type: "UPDATE_USER",
      data: users.map(user => (user.id === id ? updatedUser : user))
    });
  };

  const deleteRow = user => {
    setModal("delete");

    setCurrentUser({
      id: user.id,
      avatar: user.avatar,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    });
  };

  const deleteUser = id => {
    setShowModal(false);

    setSavedUsers(savedUsers.filter(user => user.id !== id));

    dispatch({
      type: "DELETE_USER",
      data: users.filter(user => user.id !== id)
    });
  };

  // Setting up Modal
  const setModal = modal => {
    search("");
    document.getElementById("search-input").value = "";
    setShowModal(true);
    setActiveModal(modal);
  };

  // Pagination
  const lastIndex = currentPage * 5;
  const firstIndex = lastIndex - 5;
  const currentUsers = users.slice(firstIndex, lastIndex);

  const paginate = page => {
    setCurrentPage(page);
  };

  // Search
  const search = term => {
    if (term.length > 2) {
      const results = savedUsers.filter(user =>
        Object.keys(user).some(key =>
          user[key]
            .toString()
            .toLowerCase()
            .includes(term.toString().toLowerCase())
        )
      );

      paginate(1);

      dispatch({ type: "SEARCH", data: results });
    } else if (!term.length) {
      dispatch({ type: "SEARCH", data: savedUsers });
    }
  };

  // Data Fetching from API
  const fetchData = async () => {
    setLoading(true);

    try {
      await getUsers().then(({ data }) => {
        setSavedUsers(data.data);
        dispatch({ type: "SET_USERS", data: data.data });
      });
    } catch (err) {
      setError(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="app">
      <Header />
      {!loading && (
        <main className="content">
          <div className="container">
            <div className="toolbar">
              <Search search={search} />
              <button
                className="primary-btn create-user-btn"
                onClick={() => setModal("create")}>
                Create New User
              </button>
            </div>
            {showModal && (
              <Modal activeModal={activeModal}>
                {activeModal === "create" && (
                  <CreateUser
                    createUser={createUser}
                    setShowModal={setShowModal}
                  />
                )}
                {activeModal === "update" && (
                  <UpdateUser
                    currentUser={currentUser}
                    updateUser={updateUser}
                    setShowModal={setShowModal}
                  />
                )}
                {activeModal === "delete" && (
                  <DeleteUser
                    currentUser={currentUser}
                    deleteUser={deleteUser}
                    setShowModal={setShowModal}
                  />
                )}
              </Modal>
            )}
            <DataTable
              users={currentUsers}
              updateRow={updateRow}
              deleteRow={deleteRow}
              currentPage={currentPage}
              pageSize={pageSize}
            />
            <Pagination
              totalResults={users.length}
              currentPage={currentPage}
              pageSize={pageSize}
              paginate={paginate}
            />
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
}

export default App;

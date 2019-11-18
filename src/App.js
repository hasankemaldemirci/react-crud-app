import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUsers,
  getCreatedUser,
  getUpdatedUser,
  getDeletedUser
} from "./app/api";

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
import Loader from "./components/Loader";

function App() {
  const dispatch = useDispatch();
  const users = useSelector(state => state.users);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    id: null,
    avatar: null,
    first_name: "",
    last_name: "",
    email: ""
  });
  const [showModal, setShowModal] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [savedUsers, setSavedUsers] = useState(users);
  const [pageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sorted, setSorted] = useState(false);

  const lastIndex = currentPage * pageSize;
  const firstIndex = lastIndex - pageSize;
  const currentUsers = users.slice(firstIndex, lastIndex);

  // Setting up Modal
  const setModal = modal => {
    search("");
    setShowModal(true);
    setActiveModal(modal);
  };

  // Pagination // TODO: Refactor
  const paginate = page => {
    setCurrentPage(page);
  };

  // Search
  const search = term => {
    if (term.length > 2) {
      setCurrentPage(1);

      const results = savedUsers.filter(user =>
        Object.keys(user).some(key =>
          user[key]
            .toString()
            .toLowerCase()
            .includes(term.toString().toLowerCase())
        )
      );

      dispatch({ type: "SET_USERS", data: results });
    } else if (!term.length) {
      dispatch({ type: "SET_USERS", data: savedUsers });
    }
  };

  // Sorting
  const sorting = key => {
    setSorted(!sorted);
    switch (key) {
      case "name":
        const nameSort = [...savedUsers].sort((a, b) => {
          return sorted
            ? a.first_name.localeCompare(b.first_name, "tr")
            : b.first_name.localeCompare(a.first_name, "tr");
        });
        dispatch({ type: "SET_USERS", data: nameSort });
        return;
      case "surname":
        const surnameSort = [...savedUsers].sort((a, b) => {
          return sorted
            ? a.last_name.localeCompare(b.last_name, "tr")
            : b.last_name.localeCompare(a.last_name, "tr");
        });
        dispatch({ type: "SET_USERS", data: surnameSort });
        return;
      case "email":
        const emailSort = [...savedUsers].sort((a, b) => {
          return sorted
            ? a.email.localeCompare(b.email, "tr")
            : b.email.localeCompare(a.email, "tr");
        });
        dispatch({ type: "SET_USERS", data: emailSort });
        return;
      default:
        break;
    }
  };

  // Create User
  const createUser = async user => {
    setLoading(true);

    try {
      await getCreatedUser(user).then(res => {
        const result = res.data;
        dispatch({ type: "CREATE_USER", data: result });
        setSavedUsers([...users, result]);
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Update User
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

  const updateUser = async (id, updatedUser) => {
    setShowModal(false);
    setLoading(true);

    try {
      await getUpdatedUser(id, updatedUser).then(res => {
        const result = res.data;
        dispatch({
          type: "SET_USERS",
          data: users.map(user =>
            user.id === id ? Object.assign(user, result) : user
          )
        });
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete User
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

  const deleteUser = async id => {
    setShowModal(false);
    setLoading(true);

    try {
      await getDeletedUser(id).then(() => {
        dispatch({
          type: "SET_USERS",
          data: users.filter(user => user.id !== id)
        });
        setSavedUsers(savedUsers.filter(user => user.id !== id));
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
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
    fetchUsers();
  }, []);

  return (
    <div className="app">
      <Header />
      <main className="content">
        <div className="container">
          {error && <div className="api-error"></div>}
          {loading ? (
            <Loader />
          ) : (
            <div className="content-wrapper">
              <div className="toolbar">
                <Search search={search} resetSearch={search} />
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
                onSortChange={sorting}
              />
              <Pagination
                totalResults={users.length}
                currentPage={currentPage}
                pageSize={pageSize}
                paginate={paginate}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;

import React, { Component } from "react";
import PropTypes from "prop-types";
import getUsers from "../api/AllUsers";
import styles from "../styles/userloader.module.sass";

export default class UsersLoader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      gender: "all",
      usersPerPage: 5,
      currentPage: 1,
      isLoading: false,
      error: null,
    };
  }

  loadUsers = () => {
    const { currentPage, usersPerPage, gender } = this.state;
    this.setState({ isLoading: true });
    const params = { page: currentPage, results: usersPerPage };
    if (gender !== "all") params.gender = gender;

    getUsers(params)
      .then((data) => this.setState({ users: data.results }))
      .catch((e) => this.setState({ error: e }))
      .finally(() => this.setState({ isLoading: false }));
  };

  componentDidMount() {
    this.loadUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage, usersPerPage, gender } = this.state;
    if (
      prevState.usersPerPage !== usersPerPage ||
      prevState.currentPage !== currentPage ||
      prevState.gender !== gender
    ) {
      this.loadUsers();
    }
  }

  selectUsersNum = (e) => {
    this.setState({
      usersPerPage: Number(e.target.value),
      currentPage: 1,
    });
  };

  selectGender = (e) => {
    this.setState({
      gender: String(e.target.value),
      currentPage: 1,
    });
  };

  prevPage = () => {
    const { currentPage } = this.state;
    if (currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    }
  };

  nextPage = () => {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 });
  };

  render() {
    const { users, isLoading, error, usersPerPage, gender } = this.state;
    return (
      <>
        <div className={styles.BtnsContainer}>
          <button onClick={this.prevPage} className={`${styles.sheetBtn} ${styles.prevBtn}`}>
            {"<"}
          </button>
          <button onClick={this.nextPage} className={`${styles.sheetBtn} ${styles.nextBtn}`}>
            {">"}
          </button>
        </div>

        <select
          className={styles.userNum}
          name="per-page"
          id="per-page"
          value={usersPerPage}
          onChange={this.selectUsersNum}
        >
          <option value={1}>1</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <select
          className={styles.genderSelect}
          name="gender"
          id="gender"
          value={gender}
          onChange={this.selectGender}
        >
          <option value={"all"}>all</option>
          <option value={"male"}>male</option>
          <option value={"female"}>female</option>
        </select>
        {error && <div>Oops... Error</div>}
        {isLoading && <div>Loading... Please wait...</div>}
        {!error && !isLoading && (
          <ul className={styles.users}>
            {users.map((u) => (
              <li key={u.login.uuid}>
                <article
                  className={`${styles.userCard} ${u.gender === "male" ? styles.maleCard : styles.femaleCard}`}
                >
                  <img src={u.picture.large} alt="user" className={styles.userImg} />
                  <h3>
                    {u.name.first} {u.name.last}
                  </h3>
                  <span className={styles.nat}>{u.nat}</span>
                  <p>{u.login.username}</p>
                  <p className={styles.email}>{u.email}</p>
                  <span className={styles.gender}>{u.gender}</span>
                </article>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }
}


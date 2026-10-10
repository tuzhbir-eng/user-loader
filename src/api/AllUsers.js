function getUsers(options) {
  const defaultOptions = {
    page: 1,
    results: 5,
    seed: "u5",
    inc: ["name", "gender", "email", "login", "picture", "nat"],
  };

  const realOptions = {
    ...defaultOptions,
    ...options,
  };

  const { page, results, seed, inc, gender } = realOptions;

  return fetch(
    `https://randomuser.me/api/?results=${results}&page=${page}&inc=${inc}${gender ? `&gender=${gender}` : `&seed=${seed}`}`,
  ).then((response) => response.json());
}

export default getUsers;


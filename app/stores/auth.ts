import { createStore } from "easy-peasy";

export const AuthStore = createStore({
  token: "",
  user: { name: "" },
});

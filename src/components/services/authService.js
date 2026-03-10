// import axios from "axios";

// const BASE_URL = "http://localhost:8080/api/user";

// const AuthService = {
//   register: async (data) => {
//     const response = await axios.post(`${BASE_URL}/register`, data);
//     return response.data;
//   },

//   login: async (credentials) => {
//     const response = await axios.post(`${BASE_URL}/login`, credentials);
//     const { token, role, username } = response.data;
//     localStorage.setItem("token", token);
//     localStorage.setItem("role", role);
//     localStorage.setItem("username", username);
//     return response.data;
//   },

//   logout: () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("username");
//   },

//   getToken: () => localStorage.getItem("token"),
//   getRole: () => localStorage.getItem("role"),
//   getUsername: () => localStorage.getItem("username"),
//   isLoggedIn: () => !!localStorage.getItem("token"),

//   getDashboardPath: () => {
//     const role = localStorage.getItem("role");
//     if (role === "PLANNER") return "/planner/events";
//     if (role === "STAFF") return "/staff/event-details";
//     if (role === "CLIENT") return "/client/booking-details";
//     return "/login";
//   },
// };

// export default AuthService;


// ── MOCK MODE — No backend needed for frontend testing ──
// To switch to real backend later, replace login/register with real axios calls

const MOCK_USERS = [
  { username: "planner1", password: "password", email: "planner@test.com", role: "PLANNER" },
  { username: "staff1",   password: "password", email: "staff@test.com",   role: "STAFF"   },
  { username: "client1",  password: "password", email: "client@test.com",  role: "CLIENT"  },
];

const AuthService = {
  register: async (data) => {
    await new Promise((r) => setTimeout(r, 800));
    return { message: "Registration successful." };
  },

  login: async (credentials) => {
    await new Promise((r) => setTimeout(r, 800));

    const user = MOCK_USERS.find(
      (u) => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      const error = new Error("Invalid credentials");
      error.response = { data: { message: "Invalid username or password." } };
      throw error;
    }

    const fakeToken = `mock-jwt-token-${user.role}-${Date.now()}`;
    localStorage.setItem("token", fakeToken);
    localStorage.setItem("role", user.role);
    localStorage.setItem("username", user.username);

    return { token: fakeToken, role: user.role, username: user.username };
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
  },

  getToken: () => localStorage.getItem("token"),
  getRole: () => localStorage.getItem("role"),
  getUsername: () => localStorage.getItem("username"),
  isLoggedIn: () => !!localStorage.getItem("token"),

  getDashboardPath: () => {
    const role = localStorage.getItem("role");
    if (role === "PLANNER") return "/planner/events";
    if (role === "STAFF")   return "/staff/event-details/1";
    if (role === "CLIENT")  return "/client/booking-details/1";
    return "/login";
  },
};

export default AuthService;
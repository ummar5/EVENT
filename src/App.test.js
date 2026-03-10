import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import AuthService from "./services/authService";

// ── Mock AuthService ──
jest.mock("./services/authService");

// ── Helper: render App at a specific route ──
const renderAt = (route) => {
  window.history.pushState({}, "", route);
  return render(<App />);
};

// ────────────────────────────────────────────
// 1. Public Routes
// ────────────────────────────────────────────
describe("Public Routes", () => {
  beforeEach(() => {
    AuthService.isLoggedIn.mockReturnValue(false);
    AuthService.getRole.mockReturnValue(null);
  });

  test("renders LoginPage at /login", () => {
    renderAt("/login");
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  test("renders RegistrationPage at /register", () => {
    renderAt("/register");
    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
  });

  test("redirects / to /login when not logged in", () => {
    renderAt("/");
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });
});

// ────────────────────────────────────────────
// 2. Protected Route — Unauthenticated
// ────────────────────────────────────────────
describe("Protected Routes — Unauthenticated", () => {
  beforeEach(() => {
    AuthService.isLoggedIn.mockReturnValue(false);
    AuthService.getRole.mockReturnValue(null);
  });

  test("redirects /planner/events to /login when not logged in", () => {
    renderAt("/planner/events");
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  test("redirects /staff/event-details/1 to /login when not logged in", () => {
    renderAt("/staff/event-details/1");
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  test("redirects /client/booking-details/1 to /login when not logged in", () => {
    renderAt("/client/booking-details/1");
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });
});

// ────────────────────────────────────────────
// 3. Protected Route — Wrong Role
// ────────────────────────────────────────────
describe("Protected Routes — Wrong Role", () => {
  test("redirects CLIENT trying to access /planner/events", () => {
    AuthService.isLoggedIn.mockReturnValue(true);
    AuthService.getRole.mockReturnValue("CLIENT");
    renderAt("/planner/events");
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  test("redirects STAFF trying to access /planner/create-event", () => {
    AuthService.isLoggedIn.mockReturnValue(true);
    AuthService.getRole.mockReturnValue("STAFF");
    renderAt("/planner/create-event");
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  test("redirects PLANNER trying to access /client/booking-details/1", () => {
    AuthService.isLoggedIn.mockReturnValue(true);
    AuthService.getRole.mockReturnValue("PLANNER");
    renderAt("/client/booking-details/1");
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });
});

// ────────────────────────────────────────────
// 4. Protected Route — Correct Role
// ────────────────────────────────────────────
describe("Protected Routes — Correct Role", () => {
  test("PLANNER can access /planner/events", () => {
    AuthService.isLoggedIn.mockReturnValue(true);
    AuthService.getRole.mockReturnValue("PLANNER");
    renderAt("/planner/events");
    expect(screen.getByText(/event dashboard/i)).toBeInTheDocument();
  });

  test("PLANNER can access /planner/create-event", () => {
    AuthService.isLoggedIn.mockReturnValue(true);
    AuthService.getRole.mockReturnValue("PLANNER");
    renderAt("/planner/create-event");
    expect(screen.getByText(/create new event/i)).toBeInTheDocument();
  });

  test("PLANNER can access /planner/add-resource", () => {
    AuthService.isLoggedIn.mockReturnValue(true);
    AuthService.getRole.mockReturnValue("PLANNER");
    renderAt("/planner/add-resource");
    expect(screen.getByText(/add new resource/i)).toBeInTheDocument();
  });

  test("PLANNER can access /planner/allocate", () => {
    AuthService.isLoggedIn.mockReturnValue(true);
    AuthService.getRole.mockReturnValue("PLANNER");
    renderAt("/planner/allocate");
    expect(screen.getByText(/allocate resource to event/i)).toBeInTheDocument();
  });

  test("STAFF can access /staff/event-details/1", () => {
    AuthService.isLoggedIn.mockReturnValue(true);
    AuthService.getRole.mockReturnValue("STAFF");
    renderAt("/staff/event-details/1");
    expect(screen.getByText(/event details/i)).toBeInTheDocument();
  });

  test("STAFF can access /staff/update-setup/1", () => {
    AuthService.isLoggedIn.mockReturnValue(true);
    AuthService.getRole.mockReturnValue("STAFF");
    renderAt("/staff/update-setup/1");
    expect(screen.getByText(/update setup status/i)).toBeInTheDocument();
  });

  test("CLIENT can access /client/booking-details/1", () => {
    AuthService.isLoggedIn.mockReturnValue(true);
    AuthService.getRole.mockReturnValue("CLIENT");
    renderAt("/client/booking-details/1");
    expect(screen.getByText(/your booking/i)).toBeInTheDocument();
  });
});

// ────────────────────────────────────────────
// 5. Fallback Route
// ────────────────────────────────────────────
describe("Fallback Route", () => {
  test("redirects unknown route to /login", () => {
    AuthService.isLoggedIn.mockReturnValue(false);
    AuthService.getRole.mockReturnValue(null);
    renderAt("/some/unknown/route");
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });
});

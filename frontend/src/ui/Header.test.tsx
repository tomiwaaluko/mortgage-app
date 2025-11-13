import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./Header";
import * as useAuthModule from "../hooks/useAuth";

// Mock the useAuth hook
vi.mock("../hooks/useAuth");

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Header Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render logo and company name", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: null,
      loading: false,
    });

    renderWithRouter(<Header />);

    expect(screen.getByAltText("Logo")).toBeDefined();
    expect(screen.getByText("APEX Residential Finance")).toBeDefined();
  });

  it("should show Sign In and Get Started buttons when user is not logged in", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: null,
      loading: false,
    });

    renderWithRouter(<Header />);

    expect(screen.getByText("Sign In")).toBeDefined();
    expect(screen.getByText("Get Started")).toBeDefined();
  });

  it("should show Sign Out button when user is logged in", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: {
        _id: "123",
        email: "test@example.com",
        role: "customer",
      },
      loading: false,
    });

    renderWithRouter(<Header />);

    expect(screen.getByText("Sign Out")).toBeDefined();
  });

  it("should not display progress bar when not on a form page", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      user: null,
      loading: false,
    });

    const { container } = renderWithRouter(<Header />);

    // Progress bar should not be visible on home page
    const progressText = container.textContent?.includes("Step");
    expect(progressText).toBe(false);
  });
});

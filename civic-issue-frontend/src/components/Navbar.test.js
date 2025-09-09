import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";

// Helper function to render with router
const renderWithRouter = (ui, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
  return render(ui, { wrapper: BrowserRouter });
};

describe("Navbar Component", () => {
  test("renders navbar with title and links", () => {
    renderWithRouter(<Navbar />);

    expect(screen.getByText(/civic issue reporter/i)).toBeInTheDocument();
    expect(
      screen.getByText(/report and track civic issues/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Report Issue")).toBeInTheDocument();
    expect(screen.getByText("My Issues")).toBeInTheDocument();
  });

  test("highlights active link on home route", () => {
    renderWithRouter(<Navbar />, { route: "/" });

    const reportLink = screen.getByText("Report Issue");
    const myIssuesLink = screen.getByText("My Issues");

    expect(reportLink).toHaveClass("bg-blue-600", "text-white");
    expect(myIssuesLink).toHaveClass("bg-gray-200", "text-gray-700");
  });

  test("highlights active link on my-issues route", () => {
    renderWithRouter(<Navbar />, { route: "/my-issues" });

    const reportLink = screen.getByText("Report Issue");
    const myIssuesLink = screen.getByText("My Issues");

    expect(reportLink).toHaveClass("bg-gray-200", "text-gray-700");
    expect(myIssuesLink).toHaveClass("bg-blue-600", "text-white");
  });

  test("contains proper navigation links", () => {
    renderWithRouter(<Navbar />);

    const reportLink = screen.getByText("Report Issue");
    const myIssuesLink = screen.getByText("My Issues");

    expect(reportLink.closest("a")).toHaveAttribute("href", "/");
    expect(myIssuesLink.closest("a")).toHaveAttribute("href", "/my-issues");
  });
});

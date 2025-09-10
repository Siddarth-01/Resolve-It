import React from "react";
import { render, screen } from "@testing-library/react";
import StatusTracker from "./StatusTracker";

describe("StatusTracker Component", () => {
  test("renders all three steps", () => {
    render(<StatusTracker status="Pending" />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });

  test("shows only pending step as completed when status is Pending", () => {
    render(<StatusTracker status="Pending" />);

    // Check that pending step has green styling (completed)
    const pendingStep = screen.getByText("Pending");
    expect(pendingStep).toHaveClass("text-green-700");

    // Check that other steps have gray styling (not completed)
    const inProgressStep = screen.getByText("In Progress");
    const resolvedStep = screen.getByText("Resolved");
    expect(inProgressStep).toHaveClass("text-gray-500");
    expect(resolvedStep).toHaveClass("text-gray-500");
  });

  test("shows pending and in progress as completed when status is In Progress", () => {
    render(<StatusTracker status="In Progress" />);

    const pendingStep = screen.getByText("Pending");
    const inProgressStep = screen.getByText("In Progress");
    const resolvedStep = screen.getByText("Resolved");

    expect(pendingStep).toHaveClass("text-green-700");
    expect(inProgressStep).toHaveClass("text-green-700");
    expect(resolvedStep).toHaveClass("text-gray-500");
  });

  test("shows all steps as completed when status is Resolved", () => {
    render(<StatusTracker status="Resolved" />);

    const pendingStep = screen.getByText("Pending");
    const inProgressStep = screen.getByText("In Progress");
    const resolvedStep = screen.getByText("Resolved");

    expect(pendingStep).toHaveClass("text-green-700");
    expect(inProgressStep).toHaveClass("text-green-700");
    expect(resolvedStep).toHaveClass("text-green-700");
  });

  test("displays check marks for completed steps", () => {
    render(<StatusTracker status="Resolved" />);

    // All steps should have check marks (SVG icons)
    const checkIcons = screen.getAllByRole("img", { hidden: true });
    expect(checkIcons).toHaveLength(3);
  });

  test("displays numbers for incomplete steps", () => {
    render(<StatusTracker status="Pending" />);

    // Should show numbers 2 and 3 for incomplete steps
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});

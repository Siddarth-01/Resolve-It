import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MyIssues from "./MyIssues";

// Mock setTimeout to avoid waiting in tests
jest.useFakeTimers();

describe("MyIssues Component", () => {
  test("renders loading state initially", () => {
    render(<MyIssues />);

    expect(screen.getByText(/loading your issues/i)).toBeInTheDocument();
  });

  test("renders issues table after loading", async () => {
    render(<MyIssues />);

    // Fast forward timers to skip loading delay
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText(/my reported issues/i)).toBeInTheDocument();
      expect(
        screen.getByText(/broken streetlight on main street/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/pothole near city park entrance/i)
      ).toBeInTheDocument();
    });
  });

  test("displays correct status badges", async () => {
    render(<MyIssues />);

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      // Check for different status badges
      expect(screen.getByText("Pending")).toBeInTheDocument();
      expect(screen.getByText("In Progress")).toBeInTheDocument();
      expect(screen.getByText("Resolved")).toBeInTheDocument();
    });
  });

  test("displays summary cards with correct counts", async () => {
    render(<MyIssues />);

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText(/pending issues/i)).toBeInTheDocument();
      expect(screen.getByText(/in progress/i)).toBeInTheDocument();
      expect(screen.getByText(/resolved/i)).toBeInTheDocument();
    });
  });

  test("renders all table headers", async () => {
    render(<MyIssues />);

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText(/issue title/i)).toBeInTheDocument();
      expect(screen.getByText(/category/i)).toBeInTheDocument();
      expect(screen.getByText(/status/i)).toBeInTheDocument();
      expect(screen.getByText(/date reported/i)).toBeInTheDocument();
    });
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import IssueDetailModal from "./IssueDetailModal";

const mockIssue = {
  _id: "60d5ecb54ab8c123456789ab",
  title: "Broken streetlight on Main Street",
  description:
    "The streetlight at the corner of Main St and Oak Ave has been flickering and now completely dark for 3 days.",
  category: "Infrastructure",
  status: "In Progress",
  imageUrl: "test-image.jpg",
  location: {
    lat: 40.7128,
    lng: -74.006,
  },
  createdAt: "2023-09-10T10:30:00.000Z",
  updatedAt: "2023-09-11T14:20:00.000Z",
};

describe("IssueDetailModal Component", () => {
  test("renders modal when isOpen is true", () => {
    render(
      <IssueDetailModal issue={mockIssue} isOpen={true} onClose={jest.fn()} />
    );

    expect(screen.getByText("Issue Details")).toBeInTheDocument();
    expect(screen.getByText(mockIssue.title)).toBeInTheDocument();
    expect(screen.getByText(mockIssue.description)).toBeInTheDocument();
  });

  test("does not render modal when isOpen is false", () => {
    render(
      <IssueDetailModal issue={mockIssue} isOpen={false} onClose={jest.fn()} />
    );

    expect(screen.queryByText("Issue Details")).not.toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    const mockOnClose = jest.fn();

    render(
      <IssueDetailModal issue={mockIssue} isOpen={true} onClose={mockOnClose} />
    );

    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when Close button is clicked", () => {
    const mockOnClose = jest.fn();

    render(
      <IssueDetailModal issue={mockIssue} isOpen={true} onClose={mockOnClose} />
    );

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("displays issue information correctly", () => {
    render(
      <IssueDetailModal issue={mockIssue} isOpen={true} onClose={jest.fn()} />
    );

    expect(
      screen.getByText("Broken streetlight on Main Street")
    ).toBeInTheDocument();
    expect(screen.getByText(mockIssue.description)).toBeInTheDocument();
    expect(screen.getByText("Infrastructure")).toBeInTheDocument();
    expect(screen.getByText("40.712800, -74.006000")).toBeInTheDocument();
  });

  test("displays Google Maps link when location is provided", () => {
    render(
      <IssueDetailModal issue={mockIssue} isOpen={true} onClose={jest.fn()} />
    );

    const mapLink = screen.getByText("View on Google Maps");
    expect(mapLink).toBeInTheDocument();
    expect(mapLink.closest("a")).toHaveAttribute(
      "href",
      "https://www.google.com/maps?q=40.7128,-74.006"
    );
  });

  test("handles missing location gracefully", () => {
    const issueWithoutLocation = { ...mockIssue, location: null };

    render(
      <IssueDetailModal
        issue={issueWithoutLocation}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText("Location not provided")).toBeInTheDocument();
    expect(screen.queryByText("View on Google Maps")).not.toBeInTheDocument();
  });

  test("handles missing category gracefully", () => {
    const issueWithoutCategory = { ...mockIssue, category: null };

    render(
      <IssueDetailModal
        issue={issueWithoutCategory}
        isOpen={true}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByText("Uncategorized")).toBeInTheDocument();
  });

  test("includes StatusTracker component", () => {
    render(
      <IssueDetailModal issue={mockIssue} isOpen={true} onClose={jest.fn()} />
    );

    // Check if status tracker elements are present
    expect(screen.getByText("Current Progress")).toBeInTheDocument();
  });
});

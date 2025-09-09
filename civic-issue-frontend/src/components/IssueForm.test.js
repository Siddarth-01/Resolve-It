import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import IssueForm from "./IssueForm";

describe("IssueForm Component", () => {
  test("renders all form elements", () => {
    render(<IssueForm />);

    // Check if all form elements are present
    expect(screen.getByLabelText(/issue title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/issue description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument();
    expect(screen.getByText(/get current location/i)).toBeInTheDocument();
    expect(screen.getByText(/submit issue report/i)).toBeInTheDocument();
  });

  test("updates form data when inputs change", () => {
    render(<IssueForm />);

    const titleInput = screen.getByLabelText(/issue title/i);
    const descriptionInput = screen.getByLabelText(/issue description/i);

    fireEvent.change(titleInput, { target: { value: "Test Issue" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Test Description" },
    });

    expect(titleInput.value).toBe("Test Issue");
    expect(descriptionInput.value).toBe("Test Description");
  });

  test("validates file type on upload", () => {
    render(<IssueForm />);

    const fileInput = screen.getByLabelText(/upload image/i);
    const invalidFile = new File(["test"], "test.txt", { type: "text/plain" });

    // Mock window.alert
    window.alert = jest.fn();

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(window.alert).toHaveBeenCalledWith(
      "Please select only JPG or PNG files"
    );
  });
});

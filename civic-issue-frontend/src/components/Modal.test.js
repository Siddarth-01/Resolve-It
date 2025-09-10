import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test("renders modal when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <h1>Test Modal Content</h1>
        <p>This is test content inside the modal</p>
      </Modal>
    );

    expect(screen.getByText("Test Modal Content")).toBeInTheDocument();
    expect(
      screen.getByText("This is test content inside the modal")
    ).toBeInTheDocument();
  });

  test("does not render modal when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <h1>Test Modal Content</h1>
      </Modal>
    );

    expect(screen.queryByText("Test Modal Content")).not.toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <h1>Test Modal Content</h1>
      </Modal>
    );

    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when backdrop is clicked", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <h1>Test Modal Content</h1>
      </Modal>
    );

    // Click on the backdrop (the outer div)
    const backdrop = screen.getByText("Test Modal Content").closest(".fixed");
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("does not close when clicking inside modal content", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <h1>Test Modal Content</h1>
      </Modal>
    );

    // Click on the content inside the modal
    const content = screen.getByText("Test Modal Content");
    fireEvent.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("calls onClose when ESC key is pressed", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <h1>Test Modal Content</h1>
      </Modal>
    );

    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("applies custom className", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} className="custom-modal-class">
        <h1>Test Modal Content</h1>
      </Modal>
    );

    const modalContent = screen
      .getByText("Test Modal Content")
      .closest(".bg-white");
    expect(modalContent).toHaveClass("custom-modal-class");
  });

  test("has proper ARIA attributes", () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <h1>Test Modal Content</h1>
      </Modal>
    );

    const closeButton = screen.getByLabelText("Close modal");
    expect(closeButton).toBeInTheDocument();
  });

  test("prevents body scroll when open", () => {
    const originalBodyStyle = document.body.style.overflow;

    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <h1>Test Modal Content</h1>
      </Modal>
    );

    expect(document.body.style.overflow).toBe("hidden");

    // Cleanup
    document.body.style.overflow = originalBodyStyle;
  });
});

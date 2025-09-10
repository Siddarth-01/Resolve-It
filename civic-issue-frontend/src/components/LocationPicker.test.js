import React from "react";
import { render, screen } from "@testing-library/react";
import LocationPicker from "./LocationPicker";

// Mock Leaflet since it requires DOM
jest.mock("leaflet", () => ({
  map: jest.fn(() => ({
    setView: jest.fn(),
    remove: jest.fn(),
    on: jest.fn(),
  })),
  tileLayer: jest.fn(() => ({
    addTo: jest.fn(),
  })),
  marker: jest.fn(() => ({
    addTo: jest.fn(),
    bindPopup: jest.fn(),
    setPopupContent: jest.fn(),
    setLatLng: jest.fn(),
    on: jest.fn(),
  })),
  Icon: {
    Default: {
      prototype: {
        _getIconUrl: jest.fn(),
      },
      mergeOptions: jest.fn(),
    },
  },
}));

describe("LocationPicker", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test("renders without crashing", () => {
    render(<LocationPicker onChange={mockOnChange} />);
    expect(screen.getByText("Location not available")).toBeInTheDocument();
  });

  test("renders with custom className", () => {
    const { container } = render(
      <LocationPicker onChange={mockOnChange} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  test("renders with default coordinates when none provided", () => {
    render(<LocationPicker onChange={mockOnChange} />);
    // Component should render without error even with no coordinates
    expect(screen.getByText("Location not available")).toBeInTheDocument();
  });

  test("renders with provided coordinates", () => {
    render(
      <LocationPicker lat={40.7128} lng={-74.006} onChange={mockOnChange} />
    );
    expect(
      screen.getByText("Drag the marker to adjust location")
    ).toBeInTheDocument();
  });

  test("shows 'Location not available' when no coordinates provided", () => {
    render(<LocationPicker onChange={mockOnChange} />);
    expect(screen.getByText("Location not available")).toBeInTheDocument();
  });

  test("shows manual mode helper text by default", () => {
    render(
      <LocationPicker lat={40.7128} lng={-74.006} onChange={mockOnChange} />
    );
    expect(
      screen.getByText("Drag the marker to adjust location")
    ).toBeInTheDocument();
  });

  test("shows auto mode helper text when mode is auto", () => {
    render(
      <LocationPicker
        lat={40.7128}
        lng={-74.006}
        onChange={mockOnChange}
        mode="auto"
      />
    );
    expect(
      screen.getByText("This is your detected location")
    ).toBeInTheDocument();
  });

  test("shows manual mode helper text when mode is manual", () => {
    render(
      <LocationPicker
        lat={40.7128}
        lng={-74.006}
        onChange={mockOnChange}
        mode="manual"
      />
    );
    expect(
      screen.getByText("Drag the marker to adjust location")
    ).toBeInTheDocument();
  });

  test("has correct height class (h-48)", () => {
    const { container } = render(<LocationPicker onChange={mockOnChange} />);
    expect(container.firstChild).toHaveClass("h-48");
  });

  test("has shadow styling", () => {
    const { container } = render(<LocationPicker onChange={mockOnChange} />);
    expect(container.firstChild).toHaveClass("shadow");
  });
});

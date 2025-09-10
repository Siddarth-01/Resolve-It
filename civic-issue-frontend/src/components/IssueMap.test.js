import React from "react";
import { render, screen } from "@testing-library/react";
import IssueMap from "./IssueMap";

// Mock react-leaflet components since they require DOM and browser environment
jest.mock("react-leaflet", () => ({
  MapContainer: ({ children, center, zoom }) => (
    <div data-testid="map-container" data-center={center} data-zoom={zoom}>
      {children}
    </div>
  ),
  TileLayer: ({ attribution, url }) => (
    <div
      data-testid="tile-layer"
      data-attribution={attribution}
      data-url={url}
    />
  ),
  Marker: ({ position, children }) => (
    <div data-testid="marker" data-position={position}>
      {children}
    </div>
  ),
  Popup: ({ children }) => <div data-testid="popup">{children}</div>,
}));

// Mock leaflet
jest.mock("leaflet", () => ({
  Icon: {
    Default: {
      prototype: {
        _getIconUrl: jest.fn(),
      },
      mergeOptions: jest.fn(),
    },
  },
}));

describe("IssueMap Component", () => {
  test("renders map container with provided coordinates", () => {
    const lat = 40.7128;
    const lng = -74.006;

    render(<IssueMap lat={lat} lng={lng} />);

    const mapContainer = screen.getByTestId("map-container");
    expect(mapContainer).toBeInTheDocument();
    expect(mapContainer).toHaveAttribute("data-center", `${lat},${lng}`);
    expect(mapContainer).toHaveAttribute("data-zoom", "15");
  });

  test("renders tile layer with correct attributes", () => {
    render(<IssueMap lat={40.7128} lng={-74.006} />);

    const tileLayer = screen.getByTestId("tile-layer");
    expect(tileLayer).toBeInTheDocument();
    expect(tileLayer).toHaveAttribute(
      "data-url",
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );
  });

  test("renders marker at the correct position", () => {
    const lat = 40.7128;
    const lng = -74.006;

    render(<IssueMap lat={lat} lng={lng} />);

    const marker = screen.getByTestId("marker");
    expect(marker).toBeInTheDocument();
    expect(marker).toHaveAttribute("data-position", `${lat},${lng}`);
  });

  test("renders popup with location information", () => {
    const lat = 40.7128;
    const lng = -74.006;

    render(<IssueMap lat={lat} lng={lng} />);

    const popup = screen.getByTestId("popup");
    expect(popup).toBeInTheDocument();
    expect(popup).toHaveTextContent("Issue Location");
    expect(popup).toHaveTextContent(
      `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
    );
  });

  test("uses default coordinates when lat/lng not provided", () => {
    render(<IssueMap />);

    const mapContainer = screen.getByTestId("map-container");
    expect(mapContainer).toHaveAttribute("data-center", "40.7128,-74.006");
  });

  test("applies custom className", () => {
    render(<IssueMap lat={40.7128} lng={-74.006} className="custom-class" />);

    const mapWrapper = screen.getByTestId("map-container").parentElement;
    expect(mapWrapper).toHaveClass("custom-class");
  });

  test("has default styling classes", () => {
    render(<IssueMap lat={40.7128} lng={-74.006} />);

    const mapWrapper = screen.getByTestId("map-container").parentElement;
    expect(mapWrapper).toHaveClass("h-64");
    expect(mapWrapper).toHaveClass("rounded-lg");
    expect(mapWrapper).toHaveClass("overflow-hidden");
    expect(mapWrapper).toHaveClass("border");
    expect(mapWrapper).toHaveClass("border-gray-200");
  });

  test("handles partial coordinates", () => {
    render(<IssueMap lat={40.7128} />);

    const mapContainer = screen.getByTestId("map-container");
    expect(mapContainer).toHaveAttribute("data-center", "40.7128,-74.006");
  });
});

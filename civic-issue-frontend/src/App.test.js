import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders civic issue reporter", () => {
  render(<App />);
  const titleElement = screen.getByText(/civic issue reporter/i);
  expect(titleElement).toBeInTheDocument();
});

test("renders navigation links", () => {
  render(<App />);
  const reportLink = screen.getByText("Report Issue");
  const myIssuesLink = screen.getByText("My Issues");
  expect(reportLink).toBeInTheDocument();
  expect(myIssuesLink).toBeInTheDocument();
});

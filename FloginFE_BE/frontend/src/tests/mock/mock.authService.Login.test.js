import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../components/Login";
import authService from "../services/authService";

jest.mock("../services/authService");

test("Login success", async () => {
  authService.loginUser.mockResolvedValue({ token: "abc123" });

  render(<Login />);

  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "user@gmail.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByText("Login"));

  const msg = await screen.findByText(/Login successful/);
  expect(msg).toBeInTheDocument();
});

test("Login failed", async () => {
  authService.loginUser.mockRejectedValue(new Error("Invalid credentials"));

  render(<Login />);

  fireEvent.click(screen.getByText("Login"));

  const msg = await screen.findByText(/Login failed/);
  expect(msg).toBeInTheDocument();
});

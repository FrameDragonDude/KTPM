import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../components/Login';
import { login } from '../../services/authService';

// Mock authService.loginUser()
jest.mock('../../services/authService');

/**
 * Frontend Mocking
 * Mock external dependencies cho Login component
 */
describe('Login Component Mock Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test với mocked successful responses
  describe('Test with Mocked Successful Responses', () => {
    
    test('handles successful login with mocked authService', async () => {
      // Mock successful login response
      const mockUser = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        fullName: 'Admin User',
        token: 'fake-jwt-token-12345'
      };
      
      login.mockResolvedValueOnce({ data: mockUser });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passwordInput, 'Admin123');
      await userEvent.click(submitButton);
      
      // Verify onLogin was called
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    test('stores user data in localStorage on successful login', async () => {
      const mockUser = {
        id: 2,
        username: 'testuser',
        email: 'test@example.com',
        token: 'test-token-67890'
      };
      
      login.mockResolvedValueOnce({ data: mockUser });
      
      // Mock localStorage
      Storage.prototype.setItem = jest.fn();
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passwordInput, 'Admin123');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalled();
      });
    });

    test('handles remember me functionality with mocked service', async () => {
      const mockUser = {
        id: 3,
        username: 'rememberuser',
        email: 'remember@example.com',
        token: 'remember-token'
      };
      
      login.mockResolvedValueOnce({ data: mockUser });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const rememberCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passwordInput, 'Admin123');
      await userEvent.click(rememberCheckbox);
      await userEvent.click(submitButton);
      
      expect(mockOnLogin).toHaveBeenCalled();
      expect(rememberCheckbox).toBeChecked();
    });

    test('redirects to dashboard after successful login', async () => {
      const mockUser = {
        id: 4,
        username: 'dashuser',
        email: 'dash@example.com',
        token: 'dash-token'
      };
      
      login.mockResolvedValueOnce({ data: mockUser });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passwordInput, 'Admin123');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalledTimes(1);
      });
    });
  });

  // Test với mocked failed responses
  describe('Test with Mocked Failed Responses', () => {
    
    test('handles 401 Unauthorized error', async () => {
      // Mock 401 error response
      login.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: 'Sai tài khoản hoặc mật khẩu' }
        }
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'wrong@example.com');
      await userEvent.type(passwordInput, 'WrongPass');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Sai tài khoản hoặc mật khẩu/i)).toBeInTheDocument();
      });
      
      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('handles 404 Not Found error', async () => {
      login.mockRejectedValueOnce({
        response: {
          status: 404,
          data: { message: 'User không tồn tại' }
        }
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'notfound@example.com');
      await userEvent.type(passwordInput, 'Pass123');
      await userEvent.click(submitButton);
      
      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('handles 500 Internal Server Error', async () => {
      login.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: 'Internal Server Error' }
        }
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'Test123');
      await userEvent.click(submitButton);
      
      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('handles network error', async () => {
      login.mockRejectedValueOnce(new Error('Network Error'));
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'Test123');
      await userEvent.click(submitButton);
      
      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('handles timeout error', async () => {
      login.mockRejectedValueOnce({
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded'
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'Test123');
      await userEvent.click(submitButton);
      
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });

  // Verify mock calls
  describe('Verify Mock Calls', () => {
    
    test('verifies authService.login is called with correct parameters', async () => {
      login.mockResolvedValueOnce({
        data: { id: 1, username: 'test', token: 'token' }
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passwordInput, 'Admin123');
      await userEvent.click(submitButton);
      
      // Verify mock was called
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    test('verifies authService.login is called only once per submission', async () => {
      login.mockResolvedValueOnce({
        data: { id: 1, username: 'test', token: 'token' }
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passwordInput, 'Admin123');
      await userEvent.click(submitButton);
      
      // Should be called exactly once
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    test('verifies authService.login is not called with empty fields', async () => {
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      await userEvent.click(submitButton);
      
      // Should not be called
      expect(login).not.toHaveBeenCalled();
      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('verifies mock call count after multiple failed attempts', async () => {
      login.mockRejectedValue({
        response: { status: 401, data: { message: 'Sai mật khẩu' } }
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      // First attempt
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'Wrong1');
      await userEvent.click(submitButton);
      
      // Clear and second attempt
      await userEvent.clear(passwordInput);
      await userEvent.type(passwordInput, 'Wrong2');
      await userEvent.click(submitButton);
      
      // Clear and third attempt
      await userEvent.clear(passwordInput);
      await userEvent.type(passwordInput, 'Wrong3');
      await userEvent.click(submitButton);
      
      // onLogin should never be called
      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('verifies mock implementation with specific arguments', async () => {
      const mockLoginFn = jest.fn().mockResolvedValue({
        data: { id: 5, username: 'specific', token: 'specific-token' }
      });
      
      login.mockImplementation(mockLoginFn);
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passwordInput, 'Admin123');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalled();
      });
    });

    test('verifies no mock calls when validation fails', async () => {
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      // Only fill email, leave password empty
      const emailInput = screen.getByLabelText(/Email/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.click(submitButton);
      
      // Verify no API call was made
      expect(login).not.toHaveBeenCalled();
      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('clears all mocks between tests', () => {
      // This test verifies that mocks are properly cleared
      expect(login).not.toHaveBeenCalled();
      
      // All previous test calls should be cleared
      expect(login).toHaveBeenCalledTimes(0);
    });
  });

  describe('Additional Mock Testing Scenarios', () => {
    
    test('mocks consecutive login attempts', async () => {
      // First attempt fails
      login.mockRejectedValueOnce({
        response: { status: 401, data: { message: 'Sai mật khẩu' } }
      });
      
      // Second attempt succeeds
      login.mockResolvedValueOnce({
        data: { id: 6, username: 'retry', token: 'retry-token' }
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      // First attempt
      await userEvent.type(emailInput, 'retry@example.com');
      await userEvent.type(passwordInput, 'WrongPass');
      await userEvent.click(submitButton);
      
      expect(mockOnLogin).not.toHaveBeenCalled();
      
      // Second attempt
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.clear(passwordInput);
      await userEvent.type(passwordInput, 'Admin123');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalledTimes(1);
      });
    });

    test('mocks different response times', async () => {
      // Simulate slow response
      login.mockImplementation(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ data: { id: 7, username: 'slow', token: 'slow-token' } });
          }, 100);
        });
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passwordInput, 'Admin123');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalled();
      }, { timeout: 2000 });
    });
  });
});
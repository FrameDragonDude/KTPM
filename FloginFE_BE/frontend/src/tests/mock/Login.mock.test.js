import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../components/Login';

// Mock global fetch
global.fetch = jest.fn();

/**
 * Frontend Mocking - Mock fetch API instead of service
 */
describe('Login Component Mock Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
    localStorage.clear();
  });

  describe('Test with Mocked Successful Responses', () => {
    
    test('handles successful login with mocked fetch', async () => {
      const mockUser = {
        id: 1,
        username: 'admin',
        fullName: 'Admin User'
      };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser, token: 'fake-jwt-token' })
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const usernameInput = screen.getByLabelText(/Username/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(usernameInput, 'admin');
      await userEvent.type(passwordInput, 'Admin123');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalledTimes(1);
      });
    });

    test('stores user data in localStorage on successful login', async () => {
      const mockUser = { id: 2, username: 'testuser' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser, token: 'test-token' })
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      await userEvent.type(screen.getByLabelText(/Username/i), 'admin');
      await userEvent.type(screen.getByLabelText(/Mật khẩu/i, { selector: 'input' }), 'Admin123');
      await userEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));
      
      await waitFor(() => {
        expect(localStorage.getItem('token')).toBeTruthy();
        expect(localStorage.getItem('user')).toBeTruthy();
      });
    });

    test('handles remember me functionality', async () => {
      const mockUser = { id: 3, username: 'rememberuser' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser, token: 'remember-token' })
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      const rememberCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(screen.getByLabelText(/Username/i), 'admin');
      await userEvent.type(screen.getByLabelText(/Mật khẩu/i, { selector: 'input' }), 'Admin123');
      await userEvent.click(rememberCheckbox);
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalled();
        expect(rememberCheckbox).toBeChecked();
      });
    });

    test('redirects to product page after successful login', async () => {
      const mockUser = { id: 4, username: 'dashuser' };
      
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser, token: 'dash-token' })
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      await userEvent.type(screen.getByLabelText(/Username/i), 'admin');
      await userEvent.type(screen.getByLabelText(/Mật khẩu/i, { selector: 'input' }), 'Admin123');
      await userEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));
      
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Test with Mocked Failed Responses', () => {
    
    test('handles 401 Unauthorized error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid credentials' })
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      await userEvent.type(screen.getByLabelText(/Username/i), 'wrong');
      await userEvent.type(screen.getByLabelText(/Mật khẩu/i, { selector: 'input' }), 'WrongPass');
      await userEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      });
      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('handles network error gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network Error'));
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      await userEvent.type(screen.getByLabelText(/Username/i), 'test');
      await userEvent.type(screen.getByLabelText(/Mật khẩu/i, { selector: 'input' }), 'Test123');
      await userEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
      });
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });

  describe('Verify Mock Behavior', () => {
    
    test('verifies fetch is called with correct parameters', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 1, username: 'admin' }, token: 'token' })
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      await userEvent.type(screen.getByLabelText(/Username/i), 'admin');
      await userEvent.type(screen.getByLabelText(/Mật khẩu/i, { selector: 'input' }), 'Admin123');
      await userEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8080/api/auth/login',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
        );
      });
    });

    test('verifies fetch is called only once per submission', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 1, username: 'admin' }, token: 'token' })
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      await userEvent.type(screen.getByLabelText(/Username/i), 'admin');
      await userEvent.type(screen.getByLabelText(/Mật khẩu/i, { selector: 'input' }), 'Admin123');
      await userEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });

    test('verifies fetch is not called with empty fields', async () => {
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      // Click submit without filling fields
      await userEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));
      
      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });

  describe('Additional Scenarios', () => {
    
    test('handles consecutive login attempts', async () => {
      // First attempt fails
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' })
      });
      
      // Second attempt succeeds
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 1, username: 'admin' }, token: 'token' })
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      // First attempt - wrong password
      await userEvent.type(screen.getByLabelText(/Username/i), 'admin');
      await userEvent.type(screen.getByLabelText(/Mật khẩu/i, { selector: 'input' }), 'Wrong');
      await userEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
      });
      
      // Second attempt - correct password
      await userEvent.clear(screen.getByLabelText(/Mật khẩu/i, { selector: 'input' }));
      await userEvent.type(screen.getByLabelText(/Mật khẩu/i, { selector: 'input' }), 'Admin123');
      await userEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));
      
      await waitFor(() => {
        expect(mockOnLogin).toHaveBeenCalled();
      });
    });

    test('clears error message on successful login', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 1, username: 'admin' }, token: 'token' })
      });
      
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      
      await userEvent.type(screen.getByLabelText(/Username/i), 'admin');
      await userEvent.type(screen.getByLabelText(/Mật khẩu/i, { selector: 'input' }), 'Admin123');
      await userEvent.click(screen.getByRole('button', { name: /Đăng nhập/i }));
      
      await waitFor(() => {
        // Error message should not be visible on successful login
        const errorMessages = screen.queryAllByText(/Login failed|Invalid/i);
        expect(errorMessages.length).toBe(0);
      });
    });
  });
});

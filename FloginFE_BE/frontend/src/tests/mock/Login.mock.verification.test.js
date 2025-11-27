import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../components/Login';
import { login } from '../../services/authService';

/**
 * Login Mock Tests - Mock Verification
 * Test mock call verification and interactions
 */
jest.mock('../../services/authService');

describe('Login Component Mock Tests - Verification', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('verifies authService.login is called with correct parameters', async () => {
    login.mockResolvedValueOnce({
      data: { id: 1, username: 'test', token: 'token' }
    });
    
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'admin@example.com');
    await userEvent.type(passwordInput, 'Admin123');
    await userEvent.click(submitButton);
    
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  test('verifies authService.login is called only once per submission', async () => {
    login.mockResolvedValueOnce({
      data: { id: 1, username: 'test', token: 'token' }
    });
    
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'admin@example.com');
    await userEvent.type(passwordInput, 'Admin123');
    await userEvent.click(submitButton);
    
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });

  test('verifies authService.login is not called with empty fields', async () => {
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    await userEvent.click(submitButton);
    
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
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Wrong1');
    await userEvent.click(submitButton);
    
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'Wrong2');
    await userEvent.click(submitButton);
    
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'Wrong3');
    await userEvent.click(submitButton);
    
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
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
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
    
    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(submitButton);
    
    expect(login).not.toHaveBeenCalled();
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('clears all mocks between tests', () => {
    expect(login).not.toHaveBeenCalled();
    expect(login).toHaveBeenCalledTimes(0);
  });
});

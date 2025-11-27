import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Login from '../../components/Login';


jest.mock('axios');

describe('Login Component Integration Tests - Error Handling', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('clears error message on successful login', async () => {
    const mockOnLogin = jest.fn();
    
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.click(submitButton);
    expect(screen.getByText(/Vui lòng nhập đầy đủ thông tin/i)).toBeInTheDocument();
    
    await userEvent.type(emailInput, 'admin@example.com');
    await userEvent.type(passwordInput, 'Admin123');
    await userEvent.click(submitButton);
    
    expect(screen.queryByText(/Vui lòng nhập đầy đủ thông tin/i)).not.toBeInTheDocument();
    expect(mockOnLogin).toHaveBeenCalled();
  });

  test('handles API error response', async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { message: 'Sai tài khoản hoặc mật khẩu' }
      }
    });
    
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'WrongPass');
    await userEvent.click(submitButton);
    
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('handles network error', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));
    
    const mockOnLogin = jest.fn();
    render(<Login onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'Test123');
    await userEvent.click(submitButton);
    
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('error message disappears after correcting input', async () => {
    render(<Login onLogin={() => {}} />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
    
    await userEvent.click(submitButton);
    expect(screen.getByText(/Vui lòng nhập đầy đủ thông tin/i)).toBeInTheDocument();
    
    await userEvent.type(emailInput, 'admin@example.com');
    await userEvent.type(passwordInput, 'Admin123');
    await userEvent.click(submitButton);
    
    expect(screen.queryByText(/Vui lòng nhập đầy đủ thông tin/i)).not.toBeInTheDocument();
  });
});

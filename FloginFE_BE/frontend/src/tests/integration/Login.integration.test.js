import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Login from '../components/Login';

// Mock axios
jest.mock('axios');

/**
 * 4.1.1 Frontend Component Integration
 * Test tích hợp Login component với API service
 */
describe('Login Component Integration Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 4.1.1a - Test rendering và user interactions
  describe('Rendering and User Interactions', () => {
    
    test('renders all form elements correctly', () => {
      render(<Login onLogin={() => {}} />);
      
      // Check if all elements are rendered
      expect(screen.getByText(/Hệ Thống Quản Lý Sản Phẩm/i)).toBeInTheDocument();
      expect(screen.getByText(/Đăng nhập để quản lý kho hàng của bạn/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Mật khẩu/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Đăng nhập/i })).toBeInTheDocument();
      expect(screen.getByText(/Ghi nhớ đăng nhập/i)).toBeInTheDocument();
      expect(screen.getByText(/Quên mật khẩu/i)).toBeInTheDocument();
    });

    test('allows user to type in email field', async () => {
      render(<Login onLogin={() => {}} />);
      const emailInput = screen.getByLabelText(/Email/i);
      
      await userEvent.type(emailInput, 'test@example.com');
      
      expect(emailInput).toHaveValue('test@example.com');
    });

    test('allows user to type in password field', async () => {
      render(<Login onLogin={() => {}} />);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i);
      
      await userEvent.type(passwordInput, 'Test123');
      
      expect(passwordInput).toHaveValue('Test123');
    });

    test('toggles password visibility', async () => {
      render(<Login onLogin={() => {}} />);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i);
      const toggleButton = screen.getByRole('button', { name: /Hiện mật khẩu/i });
      
      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click to show password
      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click again to hide password
      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('allows user to check remember me checkbox', async () => {
      render(<Login onLogin={() => {}} />);
      const rememberCheckbox = screen.getByRole('checkbox');
      
      expect(rememberCheckbox).not.toBeChecked();
      
      await userEvent.click(rememberCheckbox);
      expect(rememberCheckbox).toBeChecked();
      
      await userEvent.click(rememberCheckbox);
      expect(rememberCheckbox).not.toBeChecked();
    });

    test('shows alert when forgot password is clicked', async () => {
      // Mock window.alert
      window.alert = jest.fn();
      
      render(<Login onLogin={() => {}} />);
      const forgotButton = screen.getByText(/Quên mật khẩu/i);
      
      await userEvent.click(forgotButton);
      
      expect(window.alert).toHaveBeenCalledWith('Chức năng chưa hỗ trợ');
    });
  });

  // Test form submission và API calls
  describe('Form Submission and API Calls', () => {
    
    test('submits form with valid credentials', async () => {
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

    test('does not submit with empty email', async () => {
      const mockOnLogin = jest.fn();
      
      render(<Login onLogin={mockOnLogin} />);
      
      const passwordInput = screen.getByLabelText(/Mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(passwordInput, 'Admin123');
      await userEvent.click(submitButton);
      
      expect(screen.getByText(/Vui lòng nhập đầy đủ thông tin/i)).toBeInTheDocument();
      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('does not submit with empty password', async () => {
      const mockOnLogin = jest.fn();
      
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.click(submitButton);
      
      expect(screen.getByText(/Vui lòng nhập đầy đủ thông tin/i)).toBeInTheDocument();
      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('handles successful API login', async () => {
      const mockOnLogin = jest.fn();
      
      // Mock successful API response
      axios.post.mockResolvedValueOnce({
        data: {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          token: 'fake-jwt-token'
        }
      });
      
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passwordInput, 'Admin123');
      await userEvent.click(submitButton);
      
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    test('handles failed API login', async () => {
      const mockOnLogin = jest.fn();
      
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'wrong@example.com');
      await userEvent.type(passwordInput, 'WrongPass');
      await userEvent.click(submitButton);
      
      expect(screen.getByText(/Sai tài khoản hoặc mật khẩu/i)).toBeInTheDocument();
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });

  //  Test error handling và success messages
  describe(' Error Handling and Success Messages', () => {
    
    test('shows error message for empty fields', async () => {
      render(<Login onLogin={() => {}} />);
      
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      await userEvent.click(submitButton);
      
      expect(screen.getByText(/Vui lòng nhập đầy đủ thông tin/i)).toBeInTheDocument();
    });

    test('shows error message for invalid credentials', async () => {
      render(<Login onLogin={() => {}} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'wrong@example.com');
      await userEvent.type(passwordInput, 'WrongPassword');
      await userEvent.click(submitButton);
      
      expect(screen.getByText(/Sai tài khoản hoặc mật khẩu/i)).toBeInTheDocument();
    });

    test('clears error message on successful login', async () => {
      const mockOnLogin = jest.fn();
      
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      // First submit with empty fields to trigger error
      await userEvent.click(submitButton);
      expect(screen.getByText(/Vui lòng nhập đầy đủ thông tin/i)).toBeInTheDocument();
      
      // Then submit with valid credentials
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passwordInput, 'Admin123');
      await userEvent.click(submitButton);
      
      expect(screen.queryByText(/Vui lòng nhập đầy đủ thông tin/i)).not.toBeInTheDocument();
      expect(mockOnLogin).toHaveBeenCalled();
    });

    test('handles API error response', async () => {
      // Mock API error
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
      // Mock network error
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
      
      // Submit empty form
      await userEvent.click(submitButton);
      expect(screen.getByText(/Vui lòng nhập đầy đủ thông tin/i)).toBeInTheDocument();
      
      // Fill in credentials
      await userEvent.type(emailInput, 'admin@example.com');
      await userEvent.type(passwordInput, 'Admin123');
      await userEvent.click(submitButton);
      
      // Error should be gone
      expect(screen.queryByText(/Vui lòng nhập đầy đủ thông tin/i)).not.toBeInTheDocument();
    });
  });

  // Additional integration tests
  describe('Additional Integration Tests', () => {
    
    test('form submission prevents default behavior', async () => {
      const mockOnLogin = jest.fn();
      const mockPreventDefault = jest.fn();
      
      render(<Login onLogin={mockOnLogin} />);
      
      const form = screen.getByRole('button', { name: /Đăng nhập/i }).closest('form');
      
      fireEvent.submit(form, { preventDefault: mockPreventDefault });
      
      expect(mockPreventDefault).toHaveBeenCalled();
    });

    test('maintains form state during interaction', async () => {
      render(<Login onLogin={() => {}} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i);
      const rememberCheckbox = screen.getByRole('checkbox');
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'TestPass123');
      await userEvent.click(rememberCheckbox);
      
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('TestPass123');
      expect(rememberCheckbox).toBeChecked();
    });
  });
});
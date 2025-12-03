import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import axios from 'axios';
import Login from '../../components/Login';

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
    
    test('renders all form elements correctly', async () => {
      render(<Login onLogin={() => {}} />);
      const toggleButton = screen.getByRole('button', { name: /hiện mật khẩu/i });
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      const rememberCheckbox = screen.getByRole('checkbox');
      // Check if all elements are rendered
      expect(screen.getByText(/Hệ Thống Quản Lý Sản Phẩm/i)).toBeInTheDocument();
      expect(screen.getByText(/Đăng nhập để quản lý kho hàng của bạn/i)).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
      expect(screen.getByText(/Ghi nhớ đăng nhập/i)).toBeInTheDocument();
      expect(screen.getByText(/Quên mật khẩu/i)).toBeInTheDocument();
      // Interact with remember checkbox
      await act(async () => {
        await userEvent.click(rememberCheckbox);
      });
      expect(rememberCheckbox).toBeChecked();
      await act(async () => {
        await userEvent.click(rememberCheckbox);
      });
      expect(rememberCheckbox).not.toBeChecked();
    });

      // ...existing code...
    });

    test('toggles password visibility', async () => {
      render(<Login onLogin={() => {}} />);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const toggleButton = screen.getByRole('button', { name: /hiện mật khẩu/i });
      expect(passwordInput).toHaveAttribute('type', 'password');
      // Click to show password
      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      // Click again to hide password
      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
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
    
      // ...existing code...

    test('does not submit with empty email', async () => {
      const mockOnLogin = jest.fn();
      
      render(<Login onLogin={mockOnLogin} />);
      
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await act(async () => {
        await userEvent.click(submitButton);
      });
      // ...existing code...
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

      // ...existing code...
    test('handles failed API login', async () => {
      const mockOnLogin = jest.fn();
      
      render(<Login onLogin={mockOnLogin} />);
      
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      // ...existing code...
    });
  });

  //  Test error handling và success messages
  describe(' Error Handling and Success Messages', () => {
    
    test('shows error message for empty fields', async () => {
      render(<Login onLogin={() => {}} />);
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      await act(async () => {
        await userEvent.click(submitButton);
      });
      // ...existing code...
    });

    test('clears error message on successful login', async () => {
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      const emailInput = screen.getByLabelText(/Email/i);
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const rememberCheckbox = screen.getByRole('checkbox');
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      await act(async () => {
        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, 'TestPass123');
        await userEvent.click(rememberCheckbox);
      });
      // First submit with empty fields to trigger error
      await userEvent.click(submitButton);
      expect(screen.getByText(/Sai tài khoản hoặc mật khẩu\./i)).toBeInTheDocument();
      // Then submit with valid credentials
      await act(async () => {
        await userEvent.clear(emailInput);
        await userEvent.clear(passwordInput);
        await userEvent.type(emailInput, 'admin@example.com');
        await userEvent.type(passwordInput, 'Admin123');
        await userEvent.click(submitButton);
      });
      expect(screen.queryByText(/Sai tài khoản hoặc mật khẩu\./i)).not.toBeInTheDocument();
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
      
      const emailInput = screen.getByLabelText(/Email/i, { selector: 'input' });
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'WrongPass');
      await userEvent.click(submitButton);
      
      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('handles network error', async () => {
      const mockOnLogin = jest.fn();
      render(<Login onLogin={mockOnLogin} />);
      const emailInput = screen.getByLabelText(/Email/i, { selector: 'input' });
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const submitButton = screen.getByRole('button', { name: /Đăng nhập/i });
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'Test123');
      await userEvent.click(submitButton);
      expect(mockOnLogin).not.toHaveBeenCalled();
    });

    test('error message disappears after correcting input', async () => {
      render(<Login onLogin={() => {}} />);
      
      const emailInput = screen.getByLabelText(/Email/i, { selector: 'input' });
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
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
      const form = document.querySelector('form');
      form.addEventListener('submit', (e) => e.preventDefault = mockPreventDefault);
      fireEvent.submit(form);
      expect(mockPreventDefault).toHaveBeenCalled();
    });

    test('maintains form state during interaction', async () => {
      render(<Login onLogin={() => {}} />);
      
      const emailInput = screen.getByLabelText(/Email/i, { selector: 'input' });
      const passwordInput = screen.getByLabelText(/Mật khẩu/i, { selector: 'input' });
      const rememberCheckbox = screen.getByRole('checkbox');
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'TestPass123');
      await userEvent.click(rememberCheckbox);
      
      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('TestPass123');
      expect(rememberCheckbox).toBeChecked();
    });
  });
// ...existing code...
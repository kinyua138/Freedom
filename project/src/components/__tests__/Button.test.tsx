import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../Button';

describe('Button Component', () => {
  const defaultProps = {
    children: 'Test Button',
    onClick: jest.fn(),
  };

  it('renders button with correct text', () => {
    render(<Button {...defaultProps} />);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<Button {...defaultProps} />);
    fireEvent.click(screen.getByText('Test Button'));
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary variant styles', () => {
    render(<Button {...defaultProps} variant="primary" />);
    const button = screen.getByText('Test Button');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('applies secondary variant styles', () => {
    render(<Button {...defaultProps} variant="secondary" />);
    const button = screen.getByText('Test Button');
    expect(button).toHaveClass('bg-gray-200');
  });

  it('applies disabled state', () => {
    render(<Button {...defaultProps} disabled />);
    const button = screen.getByText('Test Button');
    expect(button).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Button {...defaultProps} className="custom-class" />);
    const button = screen.getByText('Test Button');
    expect(button).toHaveClass('custom-class');
  });

  it('renders with icon', () => {
    const MockIcon = () => <span data-testid="icon">Icon</span>;
    render(
      <Button {...defaultProps}>
        <MockIcon />
        Test Button
      </Button>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

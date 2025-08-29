import { render, screen } from '@testing-library/react';
import Loader from '../components/Loader.jsx';

test('renders loader with correct accessibility attributes', () => {
  render(<Loader />);
  const loader = screen.getByRole('status');
  expect(loader).toBeInTheDocument();
  expect(loader).toHaveAttribute('aria-label', 'loading');
});

test('applies correct CSS class', () => {
  render(<Loader />);
  const loader = screen.getByRole('status');
  expect(loader).toHaveClass('loader');
});

test('renders as a div element', () => {
  render(<Loader />);
  const loader = screen.getByRole('status');
  expect(loader.tagName).toBe('DIV');
});

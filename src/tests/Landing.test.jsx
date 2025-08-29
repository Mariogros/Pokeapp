import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Landing from '../components/Landing.jsx';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

afterEach(() => {
  vi.clearAllMocks();
});

test('renders main heading', () => {
  render(<Landing />);
  expect(screen.getByText('PokeApp')).toBeInTheDocument();
});

test('renders tagline', () => {
  render(<Landing />);
  expect(screen.getByText("Gotta catch 'em all")).toBeInTheDocument();
});

test('renders start adventure button', () => {
  render(<Landing />);
  expect(screen.getByText('START ADVENTURE')).toBeInTheDocument();
});

test('navigates to grid when button is clicked', () => {
  render(<Landing />);
  const startButton = screen.getByText('START ADVENTURE');
  fireEvent.click(startButton);
  expect(mockNavigate).toHaveBeenCalledWith('/grid');
});

test('button has correct styling attributes', () => {
  render(<Landing />);
  const startButton = screen.getByText('START ADVENTURE');
  expect(startButton.tagName).toBe('BUTTON');
  expect(startButton).toHaveStyle('cursor: pointer');
});

test('renders background Pokemon elements', () => {
  render(<Landing />);
  const container = screen.getByText('PokeApp').closest('div');
  expect(container.parentElement).toHaveStyle('position: relative');
  expect(container.parentElement).toHaveStyle('overflow: hidden');
});

test('main content has glass morphism styling', () => {
  render(<Landing />);
  const mainContent = screen.getByText('PokeApp').closest('div');
  expect(mainContent).toHaveStyle('border-radius: 25px');
  expect(mainContent).toHaveStyle('text-align: center');
});

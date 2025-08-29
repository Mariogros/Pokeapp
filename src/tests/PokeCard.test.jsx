import { render, screen, fireEvent } from '@testing-library/react';
import PokeCard from '../components/PokeCard.jsx';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockData = {
  name: 'piplup',
  id: 393,
  sprites: {
    front_default: 'piplup.png',
    other: { 'official-artwork': { front_default: 'piplup-art.png' } }
  },
  types: [{ type: { name: 'water' } }]
};

afterEach(() => {
  vi.clearAllMocks();
});

test('renders PokeCard with name and image', () => {
  render(<PokeCard data={mockData} favorite={false} onToggleFavorite={() => {}} />);
  expect(screen.getByText(/piplup/i)).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src', 'piplup-art.png');
});

test('calls onToggleFavorite with name when favorite button is clicked', () => {
  const handleToggleFavorite = vi.fn();
  render(<PokeCard data={mockData} favorite={false} onToggleFavorite={handleToggleFavorite} />);
  fireEvent.click(screen.getByRole('button', { name: /favorite/i }));
  expect(handleToggleFavorite).toHaveBeenCalledWith('piplup');
});

test('shows filled star when favorite is true', () => {
  render(<PokeCard data={mockData} favorite={true} onToggleFavorite={() => {}} />);
  expect(screen.getByRole('button', { name: /favorite/i })).toHaveTextContent('★');
});

test('navigates to pokedex page when image is clicked', () => {
  render(<PokeCard data={mockData} favorite={false} onToggleFavorite={() => {}} />);
  fireEvent.click(screen.getByRole('img'));
  expect(mockNavigate).toHaveBeenCalledWith('/pokedex/piplup');
});

test('navigates to pokedex page when name is clicked', () => {
  render(<PokeCard data={mockData} favorite={false} onToggleFavorite={() => {}} />);
  fireEvent.click(screen.getByText(/piplup/i));
  expect(mockNavigate).toHaveBeenCalledWith('/pokedex/piplup');
});

import { render, screen } from '@testing-library/react'
import Pokedex from '../components/Pokedex.jsx'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'

let mockNavigate;
beforeEach(() => {
  mockNavigate = vi.fn();
  global.fetch = vi.fn(url => {
    if (url.includes('/pokemon/')) {
      return Promise.resolve({
        json: () => Promise.resolve({
          name: 'turtwig',
          id: 387,
          height: 10,
          weight: 100,
          types: [{ type: { name: 'grass' } }],
          sprites: { other: { 'official-artwork': { front_default: 'turtwig.png' } } },
          species: { url: 'https://pokeapi.co/api/v2/pokemon-species/387/' }
        })
      })
    }
    return Promise.resolve({
      json: () => Promise.resolve({
        flavor_text_entries: [
          { language: { name: 'en' }, flavor_text: 'Tiny leaf Pokémon' }
        ]
      })
    })
  })
})

afterEach(() => {
  vi.clearAllMocks();
})

test('renders Pokémon details', async () => {
  render(
    <MemoryRouter initialEntries={['/pokemon/turtwig']}>
      <Routes>
        <Route path="/pokemon/:name" element={<Pokedex />} />
      </Routes>
    </MemoryRouter>
  );
  expect(await screen.findByText(/turtwig/i)).toBeInTheDocument();
  expect(await screen.findByText(/Tiny leaf Pokémon/i)).toBeInTheDocument();
});


test('shows Loader while loading', () => {
  render(
    <MemoryRouter initialEntries={['/pokemon/turtwig']}>
      <Routes>
        <Route path="/pokemon/:name" element={<Pokedex />} />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByText((content, node) => node.className === 'container')).toBeInTheDocument();
});


test('Back button navigates correctly', async () => {
  vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate, useParams: () => ({ name: 'turtwig' }) };
  });
  const { default: PokedexLocal } = await import('../components/Pokedex.jsx');
  render(
    <MemoryRouter initialEntries={['/pokemon/turtwig']}>
      <Routes>
        <Route path="/pokemon/:name" element={<PokedexLocal />} />
      </Routes>
    </MemoryRouter>
  );
  const backButton = await screen.findByRole('button', { name: /back/i });
  backButton.click();
  expect(mockNavigate).toHaveBeenCalledWith('/grid');
  vi.resetModules();
});


test('handles missing description gracefully', async () => {
  global.fetch = vi.fn(url => {
    if (url.includes('/pokemon/')) {
      return Promise.resolve({
        json: () => Promise.resolve({
          name: 'turtwig',
          id: 387,
          height: 10,
          weight: 100,
          types: [{ type: { name: 'grass' } }],
          sprites: { other: { 'official-artwork': { front_default: 'turtwig.png' } } },
          species: { url: 'https://pokeapi.co/api/v2/pokemon-species/387/' }
        })
      });
    }
    return Promise.resolve({ json: () => Promise.resolve({ flavor_text_entries: [] }) });
  });
  render(
    <MemoryRouter initialEntries={['/pokemon/turtwig']}>
      <Routes>
        <Route path="/pokemon/:name" element={<Pokedex />} />
      </Routes>
    </MemoryRouter>
  );
  expect(await screen.findByText(/turtwig/i)).toBeInTheDocument();
  expect(screen.queryByText(/Tiny leaf Pokémon/i)).not.toBeInTheDocument();
});


test('handles fetch error gracefully', async () => {
  global.fetch = vi.fn(() => Promise.reject(new Error('API error')));
  render(
    <MemoryRouter initialEntries={['/pokemon/turtwig']}>
      <Routes>
        <Route path="/pokemon/:name" element={<Pokedex />} />
      </Routes>
    </MemoryRouter>
  );
  expect(await screen.findByText(/failed to load pokémon data/i)).toBeInTheDocument();
});

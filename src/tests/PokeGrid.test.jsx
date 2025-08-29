import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import PokeGrid from '../components/PokeGrid'

const mockPokedexResponse = {
  pokemon_entries: [
    { pokemon_species: { name: 'bulbasaur' } },
    { pokemon_species: { name: 'charmander' } },
  ]
}

const mockPokemonData = {
  bulbasaur: {
    id: 1,
    name: 'bulbasaur',
    sprites: {
      front_default: 'bulbasaur.png',
      other: { 'official-artwork': { front_default: 'bulbasaur-art.png' } },
    },
  },
  charmander: {
    id: 2,
    name: 'charmander',
    sprites: {
      front_default: 'charmander.png',
      other: { 'official-artwork': { front_default: 'charmander-art.png' } },
    },
  },
}

global.fetch = vi.fn((url) => {
  if (url.includes('/pokedex/6')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockPokedexResponse),
    })
  } else if (url.includes('/pokemon/bulbasaur')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockPokemonData.bulbasaur),
    })
  } else if (url.includes('/pokemon/charmander')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockPokemonData.charmander),
    })
  }
  return Promise.reject(new Error('Unknown endpoint'))
})

const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('PokeGrid Component', () => {
  const renderWithRouter = (ui) =>
    render(<MemoryRouter>{ui}</MemoryRouter>)

  it('renders loader while fetching data', async () => {
    renderWithRouter(<PokeGrid />)
    const loader = screen.getByLabelText(/loading/i)
    expect(loader).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
    )
  })

  it('displays pokemon cards after loading', async () => {
    renderWithRouter(<PokeGrid />)
    await waitFor(() => screen.getAllByTestId(/^card-/))
    const cards = screen.getAllByTestId(/^card-/)
    expect(cards).toHaveLength(2)
  })

  it('filters pokemons based on search query', async () => {
    renderWithRouter(<PokeGrid />)
    await waitFor(() => screen.getAllByTestId(/^card-/))

    const input = screen.getByPlaceholderText(/🔍 Search Pokemon.../i)
    fireEvent.change(input, { target: { value: 'bulbasaur' } })

    await waitFor(() => {
      const cards = screen.getAllByTestId(/^card-/)
      expect(cards).toHaveLength(1)
      expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument()
    })
  })

  it('toggles favorites view', async () => {
    renderWithRouter(<PokeGrid />)
    await waitFor(() => screen.getAllByTestId(/^card-/))

    const favoritesButton = screen.getByText('⭐ Favorites')
    fireEvent.click(favoritesButton)

    await waitFor(() => {
      expect(screen.getByText(/Your team is empty!/i)).toBeInTheDocument()
      expect(screen.queryAllByTestId(/^card-/)).toHaveLength(0)
    })
  })

  it('resets page and favorites when Home button is clicked', async () => {
    renderWithRouter(<PokeGrid />)
    await waitFor(() => screen.getAllByTestId(/^card-/))

    const favoritesButton = screen.getByText('⭐ Favorites')
    fireEvent.click(favoritesButton)

    await waitFor(() => {
      expect(screen.getByText(/Your team is empty!/i)).toBeInTheDocument()
    })

    const homeButton = screen.getByText('Home')
    fireEvent.click(homeButton)

    await waitFor(() => {
      const cards = screen.getAllByTestId(/^card-/)
      expect(cards).toHaveLength(2)
    })
  })

  it('disables previous button on first page and next button on last page', async () => {
    renderWithRouter(<PokeGrid />)
    await waitFor(() => screen.getAllByTestId(/^card-/))

    const prevButtons = screen.getAllByText('Previous')
    const nextButtons = screen.getAllByText('Next')

    prevButtons.forEach(button => expect(button).toBeDisabled())
    nextButtons.forEach(button => expect(button).toBeDisabled())
  })
})

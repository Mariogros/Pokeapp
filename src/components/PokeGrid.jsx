import React, { useEffect, useMemo, useState } from 'react'
import Loader from './Loader.jsx'
import PokeCard from './PokeCard.jsx'
import useLocalStorage from '../hooks/useLocalStorage.js'

const API = 'https://pokeapi.co/api/v2'

export default function PokeGrid() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFavorites, setShowFavorites] = useState(false)
  const [favoritePokemons, setFavoritePokemons] = useLocalStorage('favorites', [])
  const [allPokemons, setAllPokemons] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [currentPageData, setCurrentPageData] = useState([])

  const pokemonsPerPage = 30

  useEffect(() => {
    let shouldIgnore = false
    async function loadAllPokemons() {
      setIsLoadingList(true)
      try {
        const response = await fetch(`${API}/pokedex/6`)
        const jsonData = await response.json()
        if (!shouldIgnore) setAllPokemons(jsonData.pokemon_entries.map(entry => entry.pokemon_species.name))
      } catch (error) {
        console.error('Error loading Pokemon list:', error)
        if (!shouldIgnore) setAllPokemons([])
      } finally {
        if (!shouldIgnore) setIsLoadingList(false)
      }
    }
    loadAllPokemons()
    return () => { shouldIgnore = true }
  }, [])

  const filteredPokemons = useMemo(() => {
    const basePokemons = showFavorites ? allPokemons.filter(pokemon => favoritePokemons.includes(pokemon)) : allPokemons
    if (!searchQuery) return basePokemons
    return basePokemons.filter(pokemon => pokemon.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [allPokemons, searchQuery, favoritePokemons, showFavorites])

  const totalPages = Math.max(1, Math.ceil(filteredPokemons.length / pokemonsPerPage))

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [totalPages, currentPage])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  useEffect(() => {
    let shouldIgnore = false
    async function loadPokemonDetails() {
      setIsLoadingDetails(true)
      try {
        const startIndex = (currentPage - 1) * pokemonsPerPage
        const pokemonNames = filteredPokemons.slice(startIndex, startIndex + pokemonsPerPage)
        
        const pokemonData = await Promise.all(
          pokemonNames.map(async pokemonName => {
            try {
              let apiPokemonName = pokemonName
              if (pokemonName === 'wormadam') {
                apiPokemonName = 'wormadam-plant'
              } else if (pokemonName === 'giratina') {
                apiPokemonName = 'giratina-altered'
              }
              
              const response = await fetch(`${API}/pokemon/${apiPokemonName}`)
              if (!response.ok) {
                return null
              }
              return await response.json()
            } catch (error) {
              console.error(`Error loading Pokemon ${pokemonName}:`, error)
              return null
            }
          })
        )
        
        const validPokemonData = pokemonData.filter(Boolean)
        
        if (!shouldIgnore) setCurrentPageData(validPokemonData)
      } catch (error) {
        console.error('Error loading Pokemon details:', error)
        if (!shouldIgnore) setCurrentPageData([])
      } finally {
        if (!shouldIgnore) setIsLoadingDetails(false)
      }
    }
    if (filteredPokemons.length) loadPokemonDetails()
    else setCurrentPageData([])
    return () => { shouldIgnore = true }
  }, [filteredPokemons, currentPage])

  function handleToggleFavorite(pokemonName) {
    if (favoritePokemons.includes(pokemonName)) setFavoritePokemons(favoritePokemons.filter(name => name !== pokemonName))
    else setFavoritePokemons([...favoritePokemons, pokemonName])
  }

  return (
    <div className="container">
      <h2 style={{
        marginTop:0, 
        cursor:'pointer',
        backgroundImage: 'url("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left center',
        backgroundSize: '1.2em',
        paddingLeft: '1.5em'
      }} onClick={() => {setCurrentPage(1); setShowFavorites(false)}}>PokeGrid</h2>
      <div className="toolbar">
        <div className="toolbar-search">
          <input className="input" placeholder="🔍 Search Pokemon..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="toolbar-buttons">
          {!showFavorites && (
            <button className="button-secondary" onClick={() => setShowFavorites(true)}>
              ⭐ Favorites
            </button>
          )}
          <button className="button-primary" onClick={() => {setCurrentPage(1); setShowFavorites(false)}}>
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" alt="Home" style={{width: '28px', height: '28px', marginRight: '6px'}} />
            Home
          </button>
          {showFavorites && favoritePokemons.length > 0 && (
            <button className="button-danger" onClick={() => setFavoritePokemons([])} title="Clear favorites">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/568.png" alt="Clear" style={{width: '28px', height: '28px', marginRight: '6px'}} />
              Clear
            </button>
          )}
        </div>
      </div>
      <div style={{display:'flex', gap:8, justifyContent:'center', alignItems:'center', margin:'20px 0'}}>
        <button className="button-navigation" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage===1}>Previous</button>
        <span className="badge">Page {currentPage} / {totalPages}</span>
        <button className="button-navigation" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage===totalPages}>Next</button>
      </div>
      {(isLoadingList || isLoadingDetails) && <Loader />}
      
      {showFavorites && favoritePokemons.length === 0 && !isLoadingList && !isLoadingDetails && (
        <div style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '3em 0',
          textAlign: 'center'
        }}>
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGljNWwwbDBlNTlobmE5YnVkM3FldzNsM2F0OG80cWliaHR5b3ljeiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/dJYoOVAWf2QkU/giphy.gif" 
            alt="No favorites yet" 
            style={{maxWidth: '250px', width: '100%', borderRadius: '10px'}} 
          />
          <div style={{marginTop: '1.5em', maxWidth: '300px'}}>
            <h3 style={{color: '#333', margin: '0 0 0.5em 0'}}>Your team is empty!</h3>
            <p style={{color: '#666', fontSize: '0.9em', lineHeight: '1.4'}}>
              You don't have any favorite Pokemon yet. Explore the Pokedex and tap the ⭐ to add your favorite Pokemon to your team.
            </p>
          </div>
        </div>
      )}

      {!showFavorites && !isLoadingList && filteredPokemons.length === 0 && searchQuery && (
        <div style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '3em 0',
          textAlign: 'center'
        }}>
          <img 
            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXQ2c3dlNmlvMnByYW1vZGJxcTRmZTUxNTA4eHRnanAzano0bWZuaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/42wQXwITfQbDGKqUP7/giphy.gif" 
            alt="No results found" 
            style={{maxWidth: '250px', width: '100%', borderRadius: '10px'}} 
          />
          <div style={{marginTop: '1.5em', maxWidth: '350px'}}>
            <h3 style={{color: '#333', margin: '0 0 0.5em 0'}}>Pokemon not found!</h3>
            <p style={{color: '#666', fontSize: '0.9em', lineHeight: '1.4'}}>
              We couldn't find any Pokemon with the name "<strong>{searchQuery}</strong>". 
              Try with another name or check the spelling.
            </p>
          </div>
        </div>
      )}

      {!(showFavorites && favoritePokemons.length === 0) && !(filteredPokemons.length === 0 && searchQuery) && (
        <div className="grid">
          {currentPageData.map(pokemon => (
            <PokeCard key={pokemon.name} data={pokemon} favorite={favoritePokemons.includes(pokemon.name)} onToggleFavorite={handleToggleFavorite} />
          ))}
        </div>
      )}
      {!(showFavorites && favoritePokemons.length === 0) && !(filteredPokemons.length === 0 && searchQuery) && (
        <div style={{display:'flex', gap:8, justifyContent:'center', alignItems:'center', margin:'20px 0'}}>
          <button className="button-navigation" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage===1}>Previous</button>
          <span className="badge">Page {currentPage} / {totalPages}</span>
          <button className="button-navigation" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage===totalPages}>Next</button>
        </div>
      )}
    </div>
  )
}

import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()
  
  const platinumPokemons = [
    { id: 483, name: 'Dialga', size: '140px', opacity: 0.25 },
    { id: 484, name: 'Palkia', size: '130px', opacity: 0.2 },
    { id: 487, name: 'Giratina', size: '150px', opacity: 0.15 },
    { id: 493, name: 'Arceus', size: '120px', opacity: 0.3 },
    { id: 448, name: 'Lucario', size: '110px', opacity: 0.25 },
    { id: 445, name: 'Garchomp', size: '125px', opacity: 0.2 },
    { id: 395, name: 'Empoleon', size: '115px', opacity: 0.22 },
    { id: 392, name: 'Infernape', size: '110px', opacity: 0.24 },
    { id: 389, name: 'Torterra', size: '135px', opacity: 0.18 },
    { id: 491, name: 'Darkrai', size: '105px', opacity: 0.28 }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #4a90e2 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem'
    }}>
      
      {platinumPokemons.map((pokemon, index) => (
        <div
          key={pokemon.id}
          style={{
            position: 'absolute',
            backgroundImage: `url("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            width: pokemon.size,
            height: pokemon.size,
            opacity: pokemon.opacity,
            animation: `float ${3 + (index % 3)}s ease-in-out infinite ${index % 2 ? 'reverse' : ''}`,
            animationDelay: `${index * 0.5}s`,
            ...getPositionForIndex(index)
          }}
        />
      ))}

      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '50%',
            animation: `sparkle ${4 + (i % 4)}s linear infinite`,
            animationDelay: `${i * 0.2}s`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}
      
      <div style={{
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '3rem 2.5rem',
        borderRadius: '25px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(15px)',
        zIndex: 10,
        maxWidth: '500px',
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
          margin: 0, 
          letterSpacing: -1,
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontWeight: '800'
        }}>PokeApp</h1>
        <p style={{
          color: '#666', 
          fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', 
          margin: '1.5rem 0 2.5rem',
          fontWeight: '500'
        }}>Gotta catch 'em all</p>
        <button 
          onClick={() => navigate('/grid')} 
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            padding: '15px 30px',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            border: 'none',
            color: 'white',
            borderRadius: '30px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }} 
          onMouseOver={e => {
            e.target.style.transform = 'translateY(-3px) scale(1.05)'
            e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.6)'
          }} 
          onMouseOut={e => {
            e.target.style.transform = 'translateY(0px) scale(1)'
            e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)'
          }}>
          START ADVENTURE
        </button>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(5deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

function getPositionForIndex(index) {
  const positions = [
    { top: '5%', left: '5%' },
    { top: '10%', right: '8%' },
    { top: '25%', left: '2%' },
    { top: '30%', right: '3%' },
    { top: '50%', left: '8%' },
    { top: '55%', right: '5%' },
    { bottom: '20%', left: '3%' },
    { bottom: '15%', right: '10%' },
    { bottom: '5%', left: '15%' },
    { bottom: '8%', right: '2%' }
  ]
  return positions[index] || { top: '50%', left: '50%' }
}

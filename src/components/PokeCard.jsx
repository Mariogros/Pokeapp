import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function PokeCard({ data, favorite, onToggleFavorite }) {
  const navigate = useNavigate()
  const image = data.sprites.other['official-artwork'].front_default || data.sprites.front_default
  return (
    <div className="card" data-testid={`card-${data.name}`}>
      <div className="card-header">
        <span className="badge">#{String(data.id).padStart(4, '0')}</span>
        <button className="heart" aria-label="favorite" onClick={() => onToggleFavorite(data.name)}>
          {favorite ? '★' : '☆'}
        </button>
      </div>
      <div style={{display:'grid', placeItems:'center', padding:'8px 0'}} onClick={() => navigate(`/pokedex/${data.name}`)}>
        <img src={image} alt={data.name} width="140" height="140" style={{objectFit:'contain'}} />
      </div>
      <div style={{textTransform:'capitalize', fontWeight:700, fontSize:18}} onClick={() => navigate(`/pokedex/${data.name}`)}>
        {data.name}
      </div>
    </div>
  )
}

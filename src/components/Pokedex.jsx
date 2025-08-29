import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from './Loader.jsx'

const API = 'https://pokeapi.co/api/v2'

function formatHeight(dm) {
  if (dm == null) return ''
  const meters = dm / 10
  return `${meters.toFixed(1)} m`
}
function formatWeight(hg) {
  if (hg == null) return ''
  const kg = hg / 10
  return `${kg.toFixed(1)} kg`
}

export default function Pokedex() {
  const { name } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [species, setSpecies] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API}/pokemon/${name}`)
        const json = await res.json()
        const res2 = await fetch(json.species.url)
        const json2 = await res2.json()
        if (!ignore) {
          setData(json)
          setSpecies(json2)
        }
      } catch (err) {
        if (!ignore) setError('Failed to load Pokémon data.')
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [name])

  const description = useMemo(() => {
    const entries = species?.flavor_text_entries || []
    const en = entries.find(e => e.language.name === 'en')
    return en ? en.flavor_text.replace(/\f|\n|\r/g, ' ') : ''
  }, [species])

  if (loading) {
    return (
      <div className="container">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container">
        <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        <button className="button" onClick={() => navigate('/grid')} style={{marginBottom:16}}>Back</button>
      </div>
    )
  }

  if (!data) return null

  const image = data.sprites.other['official-artwork'].front_default || data.sprites.front_default
  const types = data.types.map(t => t.type.name)

  return (
    <div className="container">
      <button className="button" onClick={() => navigate('/grid')} style={{marginBottom:16}}>Back</button>
      <div className="pokedex">
        <div className="pokedex-top">
          <div>
            <img src={image} alt={data.name} style={{width:'100%', maxWidth: 360, display:'block', margin:'0 auto'}} />
          </div>
          <div>
            <h2 style={{marginTop:0, textTransform:'capitalize'}}>{data.name} <span className="badge">#{String(data.id).padStart(4,'0')}</span></h2>
            <div className="types">
              {types.map(t => <span key={t} className="type">{t}</span>)}
            </div>
            <p style={{color:'var(--muted)'}}>{description}</p>
            <div className="meta">
              <div><strong>HT</strong><div>{formatHeight(data.height)}</div></div>
              <div><strong>WT</strong><div>{formatWeight(data.weight)}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

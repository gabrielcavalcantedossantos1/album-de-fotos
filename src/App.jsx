import { useEffect, useState } from 'react'
import axios from 'axios'

import SearchBar from './components/SearchBar'
import FotoList from './components/FotoList'
import FotoAmpliada from './components/FotoAmpliada'

const App = () => {
  const [query, setQuery] = useState('')
  const [categoria, setCategoria] = useState('')
  const [fotos, setFotos] = useState([])
  const [fotoAmpliada, setFotoAmpliada] = useState(null)
  const [activateSearch, setActivateSearch] = useState(false)
  const [erro, setErro] = useState(false)

  const fetchData = async () => {
    try {
      const apiKey = import.meta.env.VITE_UNSPLASH_API_KEY

      let searchQuery = 'popular'

      if (query && categoria) {
        searchQuery = `${query} ${categoria}`
      } else if (query) {
        searchQuery = query
      } else if (categoria) {
        searchQuery = categoria
      } 

      const response = await axios.get(
        'https://api.unsplash.com/search/photos',
        {
          params: {
            client_id: apiKey,
            query: searchQuery,
            per_page: 24
          }
        }
      )

      setFotos(response.data.results)
      setErro(false)

    } catch (error) {
      console.error(error)
      setErro(true)
    }
  }

  useEffect(() => {
    if (activateSearch) {
      fetchData(query,categoria)
      setActivateSearch(false)
    }
  }, [activateSearch])

  useEffect(() =>{
    fetchData()
  },[])

  return (
    <div className="container">
      {erro ? (
        <p className="erro">
          ⚠️ Erro ao carregar dados das fotos. Tente novamente mais tarde.
        </p>
      ) : (
        <>
          <SearchBar
            setQuery={setQuery}
            setCategoria={setCategoria}
            setActivateSearch={setActivateSearch}
          />

          <FotoList
            fotos={fotos}
            setFotoAmpliada={setFotoAmpliada}
          />

          {fotoAmpliada && (
            <FotoAmpliada
              foto={fotoAmpliada}
              setFotoAmpliada={setFotoAmpliada}
            />
          )}
        </>
      )}
    </div>
  )
}

export default App

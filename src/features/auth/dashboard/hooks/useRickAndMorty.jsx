import { useState, useEffect } from 'react';
import axios from 'axios';

// Hook custom que centraliza la carga de personajes y el cálculo de estadísticas.
export const useRickAndMorty = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, species: 0, alerts: 0 });

  // Carga inicial de datos desde la API pública.
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://rickandmortyapi.com/api/character');
      const results = res.data.results;

      setCharacters(results);

      // Calculamos los KPIs que luego usan las tarjetas del dashboard.
      const uniqueSpecies = [...new Set(results.map((c) => c.species))].length;
      const deadCount = results.filter((c) => c.status === 'Dead').length;

      setStats({
        total: res.data.info.count,
        species: uniqueSpecies,
        alerts: deadCount
      });
      setLoading(false);
    } catch (error) {
      console.error('Error interdimensional', error);
      setLoading(false);
    }
  };

  // Solo cargamos una vez al montar el dashboard.
  useEffect(() => {
    fetchData();
  }, []);

  // Filtro local para el buscador del dashboard.
  const filteredCharacters = characters.filter((char) =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return { filteredCharacters, stats, loading, searchTerm, setSearchTerm };
};

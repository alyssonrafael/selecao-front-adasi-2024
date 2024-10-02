// Importa as dependências necessárias do React e outras bibliotecas
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCrypto } from './CryptoContext'; // Importando o hook do contexto para acessar favoritos
import { Link } from 'react-router-dom';
import { FaHeart, FaSpinner } from 'react-icons/fa';

// Define a interface para o objeto Crypto, que representa uma criptomoeda
interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

// Componente de criptomoedas favoritas
const Favorites = () => {
  // Obtém o estado dos favoritos e a função para remover um favorito do contexto
  const { favorites, removeFavorite } = useCrypto(); 
  const [cryptos, setCryptos] = useState<Crypto[]>([]); // Estado local para armazenar as criptomoedas favoritas
  const [loading, setLoading] = useState(true); // Estado de carregamento para exibir um indicador enquanto os dados são buscados
  const [error, setError] = useState<string | null>(null); // Estado de erro para exibir mensagens de erro, se necessário

  // Efeito que executa a busca das criptomoedas favoritas sempre que a lista de favoritos mudar
  useEffect(() => {
    fetchFavoriteCryptos(); // Função que busca as criptomoedas favoritas
  }, [favorites]); // O efeito é acionado quando o array de favoritos for atualizado

  // Função que faz a requisição à API para buscar as criptomoedas favoritas
  const fetchFavoriteCryptos = () => {
    setLoading(true); 
    axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd', 
        ids: favorites.join(','),
      },
    })
    .then((response) => {
      setCryptos(response.data); // Atualiza o estado com os dados recebidos da API
      localStorage.setItem('favoriteCryptoData', JSON.stringify(response.data)); // Armazena os dados no localStorage
      localStorage.setItem('favoriteCryptoDataTime', Date.now().toString()); // Armazena o tempo em que os dados foram buscados
      setLoading(false); // Define que o carregamento terminou
    })
    .catch((error) => {
      console.error("Erro ao buscar criptomoedas favoritas:", error); // Exibe um erro no console
      setError("Erro ao carregar dados. Por favor, tente novamente mais tarde. Limite de requisiçoes da API atingido"); // Define uma mensagem de erro para exibir ao usuário
      setLoading(false); // Interrompe o estado de carregamento
    });
  };

  // Função chamada quando o usuário quer atualizar a lista de favoritos pelo botao
  const handleRefresh = () => {
    fetchFavoriteCryptos(); // Faz uma nova requisição para atualizar as cotações
  };

  // Função chamada para remover uma criptomoeda favorita
  const handleRemoveFavorite = (cryptoId: string) => {
    removeFavorite(cryptoId); // Remove a criptomoeda do estado global de favoritos usando o contexto
    // Atualiza o estado local para refletir a remoção do favorito
    setCryptos((prevCryptos) => {
      const updatedCryptos = prevCryptos.filter((crypto) => crypto.id !== cryptoId); // Filtra as criptomoedas removendo a que foi desmarcada como favorita
      localStorage.setItem('favoriteCryptoData', JSON.stringify(updatedCryptos)); // Atualiza o localStorage com os novos dados
      return updatedCryptos; // Retorna a lista atualizada
    });
  };

  // Renderiza uma mensagem de carregamento enquanto os dados estão sendo buscados
  if (loading)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <FaSpinner className="text-3xl animate-spin" />
      </div>
    );
  
  // Renderiza a mensagem de erro caso algo dê errado durante a busca
  if (error)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)] text-center">
        <p>{error}</p>
      </div>
    );

  // Caso não haja favoritos, exibe uma mensagem indicando que a lista está vazia
  if (favorites.length === 0) {
    return <h1 className="flex items-center justify-center text-center h-[calc(100vh-100px)] col-span-full">Nenhuma moeda favoritada.</h1>;
  }

  // Renderiza a lista de criptomoedas favoritas
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Criptomoedas Favoritas</h1>
      {/* Botão para atualizar manualmente as cotações */}
      <button
        className="mb-4 p-2 bg-blue-500 dark:bg-slate-600 text-white rounded"
        onClick={handleRefresh}
      >
        Atualizar Cotações
      </button>
      {/* Renderiza a lista de criptomoedas favoritas */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cryptos.map(crypto => (
          <li key={crypto.id} className="p-4 border rounded-lg shadow-md">
            <div className="flex justify-between items-center space-x-4">
            <Link
              to={`/crypto/${crypto.id}`}
              className="flex items-center space-x-4"
            >
              <img src={crypto.image} alt={crypto.name} className="w-10 h-10" /> {/* Exibe a imagem da criptomoeda */}
              <div>
                <h2 className="text-lg font-bold">{crypto.name} ({crypto.symbol.toUpperCase()})</h2> {/* Nome e símbolo da criptomoeda */}
                <p className="text-gray-600">Valor: ${crypto.current_price.toFixed(2)}</p> {/* Valor atual da criptomoeda */}
                {/* Variação do preço nas últimas 24h, colorido de acordo com se foi positiva ou negativa */}
                <p className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  Variação 24h: {crypto.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
              </Link>
              {/* Botão para remover a criptomoeda dos favoritos */}
              <button
                className="ml-auto p-2 rounded  text-white"
                onClick={() => handleRemoveFavorite(crypto.id)} 
              >
                <FaHeart className="text-red-500 h-6 w-6" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;

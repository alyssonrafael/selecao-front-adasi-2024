import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCrypto } from "./CryptoContext";
import { FaHeart, FaRegHeart, FaSpinner } from "react-icons/fa";

// Definição da interface 'Crypto' que representa os dados de uma criptomoeda
interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const CryptoList: React.FC = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtros e busca
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByChange, setFilterByChange] = useState<"all" | "up" | "down">(
    "all"
  ); // Estado para controlar o filtro de variação

  const { favorites, addFavorite, removeFavorite } = useCrypto();

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = (useCache = true) => {
    if (useCache) {
      const cachedData = localStorage.getItem("cryptoData");
      const cachedTime = localStorage.getItem("cryptoDataTime");

      if (
        cachedData &&
        cachedTime &&
        Date.now() - parseInt(cachedTime) < 60 * 1000
      ) {
        setCryptos(JSON.parse(cachedData));
        setLoading(false);
        return;
      }
    }

    axios
      .get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 15,
          page: 1,
          price_change_percentage: "24h",
        },
      })
      .then((response) => {
        setCryptos(response.data);
        localStorage.setItem("cryptoData", JSON.stringify(response.data));
        localStorage.setItem("cryptoDataTime", Date.now().toString());
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar criptomoedas:", error);
        setError(
          "Erro ao carregar dados. Por favor, tente novamente. A API bloqueou por motivo de muitas requisições."
        );
        setLoading(false);
      });
  };

  const handleRefresh = () => {
    setLoadingRefresh(true);
    setError(null);

    // Limpa o cache para garantir que os novos dados sejam buscados
    localStorage.removeItem("cryptoData");
    localStorage.removeItem("cryptoDataTime");

    setTimeout(() => {
      fetchCryptos(false); // Busca os dados sem usar o cache
      setLoadingRefresh(false);
    }, 2000);
  };

  const toggleFavorite = (crypto: Crypto) => {
    if (favorites.includes(crypto.id)) {
      removeFavorite(crypto.id);
    } else {
      addFavorite(crypto);
    }
  };

  // Função para filtrar criptomoedas pelo nome ou símbolo
  const filteredCryptos = cryptos
    .filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((crypto) => {
      if (filterByChange === "up") {
        return crypto.price_change_percentage_24h > 0;
      } else if (filterByChange === "down") {
        return crypto.price_change_percentage_24h < 0;
      }
      return true;
    });

  if (loading)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <FaSpinner className="text-3xl animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)] text-center">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cotações de Criptomoedas</h1>

      {/* Campo de busca */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar por nome ou símbolo"
        className="mb-4 p-2 border rounded w-full dark:bg-black dark:text-white transition-colors duration-300"
      />

      {/* Filtros de variação */}
      <div className="my-4">
        <label className="mr-4">Filtrar por variação (24h):</label>
        <select
          value={filterByChange}
          onChange={(e) =>
            setFilterByChange(e.target.value as "all" | "up" | "down")
          }
          className="p-2 border rounded dark:bg-black dark:text-white transition-colors duration-300"
        >
          <option value="all">Todos</option>
          <option value="up">Somente em alta</option>
          <option value="down">Somente em baixa</option>
        </select>
      </div>
      <div className="mb-4">
      <p>
        As cotações são atualizadas sempre que o botão e pressionado ou se
        houver troca de página com 1min de intervalo
      </p>
      <p>
        A API publica tem limite de requisições etãao e comun ocorrer o erro de
        resposta recusada se isso ocorrer e só esperar cerca de 1mim e atualizar
        a página
      </p>
      </div>

      {/* Botão para atualizar as cotações */}
      <button
        className={`mb-4 p-2 ${
          loadingRefresh ? "bg-gray-500" : "bg-blue-500 dark:bg-slate-600"
        } text-white rounded`}
        onClick={handleRefresh}
        disabled={loadingRefresh}
      >
        {loadingRefresh ? "Atualizando" : "Atualizar Cotações"}
      </button>

      {/* Lista das criptomoedas */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCryptos.map((crypto) => (
          <li
            key={crypto.id}
            className="p-4 border rounded-lg shadow-md flex justify-between"
          >
            <Link
              to={`/crypto/${crypto.id}`}
              className="flex items-center space-x-4"
            >
              <img src={crypto.image} alt={crypto.name} className="w-10 h-10" />
              <div>
                <h2 className="text-lg font-bold">
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </h2>
                <p className="text-gray-600">
                  Valor: ${crypto.current_price.toFixed(2)}
                </p>
                <p
                  className={`text-sm ${
                    crypto.price_change_percentage_24h >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  Variação 24h: {crypto.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
            </Link>

            <button
              className="mt-2 p-2 rounded text-white"
              onClick={() => toggleFavorite(crypto)}
            >
              {favorites.includes(crypto.id) ? (
                <FaHeart className="text-red-500 h-6 w-6" />
              ) : (
                <FaRegHeart className="text-gray-500 h-6 w-6" />
              )}
            </button>
          </li>
        ))}
        {filteredCryptos.length === 0 && (
          <h1 className="flex items-center justify-center text-center col-span-full">
            Nenhuma Crypto encontrada com os filtros aplicados
          </h1>
        )}
      </ul>
    </div>
  );
};

export default CryptoList;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FaSpinner } from "react-icons/fa";

Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const CryptoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [cryptoDetail, setCryptoDetail] = useState<any>(null);
  const [comparisonData, setComparisonData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const priceResponse = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
          {
            params: {
              vs_currency: "usd",
              days: "7",
              interval: "daily",
            },
          }
        );

        const detailResponse = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}`
        );

        setData(priceResponse.data);
        setCryptoDetail(detailResponse.data);

        const comparisonRequests = [
          axios.get(
            `https://api.coingecko.com/api/v3/coins/dogecoin/market_chart`,
            {
              params: {
                vs_currency: "usd",
                days: "7",
                interval: "daily",
              },
            }
          ),
          axios.get(
            `https://api.coingecko.com/api/v3/coins/ethereum/market_chart`,
            {
              params: {
                vs_currency: "usd",
                days: "7",
                interval: "daily",
              },
            }
          ),
          axios.get(
            `https://api.coingecko.com/api/v3/coins/binancecoin/market_chart`,
            {
              params: {
                vs_currency: "usd",
                days: "7",
                interval: "daily",
              },
            }
          ),
        ];

        const comparisonResponses = await Promise.all(comparisonRequests);
        setComparisonData(comparisonResponses.map((res) => res.data.prices));

        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError(
          "Erro ao carregar dados. Por favor, tente novamente. A API bloqueou por motivo de muitas requisições."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  const labels = data.prices.map((price: [number, number]) =>
    new Date(price[0]).toLocaleDateString()
  );
  const prices = data.prices.map((price: [number, number]) => price[1]);
  const volumes = data.total_volumes.map(
    (volume: [number, number]) => volume[1]
  );

  const comparisonPricesDOGE =
    comparisonData[0]?.map((price: [number, number]) => price[1]) || [];
  const comparisonPricesETH =
    comparisonData[1]?.map((price: [number, number]) => price[1]) || [];
  const comparisonPricesBNB =
    comparisonData[2]?.map((price: [number, number]) => price[1]) || [];

  const priceChartData = {
    labels,
    datasets: [
      {
        label: `Preço de ${cryptoDetail?.name}`,
        data: prices,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const volumeChartData = {
    labels,
    datasets: [
      {
        label: "Volume Negociado em USD",
        data: volumes,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };

  const comparisonChartData = {
    labels,
    datasets: [
      {
        label: `Preço de ${cryptoDetail?.name}`,
        data: prices,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Preço de Dogecoin (DOGE)",
        data: comparisonPricesDOGE,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
      {
        label: "Preço de Ethereum (ETH)",
        data: comparisonPricesETH,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
      {
        label: "Preço de Binance Coin (BNB)",
        data: comparisonPricesBNB,
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      {cryptoDetail && (
        <div className="mb-6 flex items-center space-x-4">
          <img
            src={cryptoDetail.image.small}
            alt={cryptoDetail.name}
            className="w-10 h-10"
          />
          <h1 className="text-3xl font-bold">
            {cryptoDetail.name} ({cryptoDetail.symbol.toUpperCase()})
          </h1>
        </div>
      )}

      {cryptoDetail && (
        <p className="text-xl mb-6">
          Cotação atual: ${" "}
          {cryptoDetail.market_data.current_price.usd.toFixed(2)}
        </p>
      )}

      <h1>Valor de cotação da moeda nos últimos 7 dias</h1>
      <div className="max-w-3xl mx-auto mt-6">
        <Line
          data={priceChartData}
          height={400} // Altura padrão
          options={{
            responsive: true,
            maintainAspectRatio: false, 
          }}
          className="sm:h-[300px] md:h-[400px]"
        />{" "}
        {/* Gráfico de preço */}
      </div>

      <h1>Volume negociado nos últimos 7 dias</h1>
      <div className="max-w-3xl mx-auto mt-6">
        <Line
          data={volumeChartData}
          height={400} // Altura padrão
          options={{
            responsive: true,
            maintainAspectRatio: false, 
          }}
          className="sm:h-[300px] md:h-[400px]"
        />
        {/* Gráfico de volume */}
      </div>

      <h1>Comparação com outras criptomoedas</h1>
      <div className="max-w-3xl mx-auto mt-6">
        <Line
          data={comparisonChartData}
          height={400}
          options={{
            responsive: true,
            maintainAspectRatio: false, 
          }}
          className="sm:h-[300px] md:h-[400px]" 
        />{" "}
        {/* Gráfico de comparação */}
      </div>
    </div>
  );
};

export default CryptoDetail;

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Definição da interface 'Crypto' que representa uma criptomoeda
interface Crypto {
    id: string; 
    name: string; 
    symbol: string; 
    current_price: number; 
    price_change_percentage_24h: number; 
    image: string; 
}

// Definição da interface do contexto, que inclui favoritos e funções para adicionar, remover e atualizar favoritos
interface CryptoContextType {
    favorites: string[]; // Lista de IDs das criptomoedas favoritas
    addFavorite: (crypto: Crypto) => void; // Função para adicionar uma criptomoeda aos favoritos
    removeFavorite: (cryptoId: string) => void; // Função para remover uma criptomoeda dos favoritos
}

// Criação do contexto inicial, com valor padrão 'undefined'
const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

// Componente que provê o contexto para os componentes filhos
export const CryptoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Estado local para armazenar a lista de favoritos
    const [favorites, setFavorites] = useState<string[]>(() => {
        // Tenta carregar os favoritos salvos no localStorage (caso existam)
        const savedFavorites = localStorage.getItem('favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : []; // Se houver favoritos salvos, eles são carregados
    });

    // Função para adicionar uma criptomoeda aos favoritos
    const addFavorite = (crypto: Crypto) => {
        setFavorites((prevFavorites) => {
            // Adiciona o ID da criptomoeda à lista de favoritos
            const updatedFavorites = [...prevFavorites, crypto.id];
            // Salva os favoritos atualizados no localStorage
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };

    // Função para remover uma criptomoeda dos favoritos
    const removeFavorite = (cryptoId: string) => {
        setFavorites((prevFavorites) => {
            // Remove o ID da criptomoeda da lista de favoritos
            const updatedFavorites = prevFavorites.filter((id) => id !== cryptoId);
            // Atualiza os favoritos no localStorage
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };

    // Retorno do contexto para os componentes filhos
    return (
        <CryptoContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </CryptoContext.Provider>
    );
};

// Hook customizado para facilitar o uso do contexto 'CryptoContext'
export const useCrypto = (): CryptoContextType => {
    const context = useContext(CryptoContext);
    // Verifica se o contexto está definido (caso contrário, lança um erro)
    if (!context) {
        throw new Error('Erro ao definir o contexto.');
    }
    return context;
};

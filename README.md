# Crypto Tracker

Este projeto é uma aplicação web que permite aos usuários visualizar detalhes e gráficos de cotações de criptomoedas. A aplicação exibe os preços e volumes negociados nos últimos 7 dias, além de permitir a comparação de preços entre diferentes criptomoedas.

## Funcionalidades

* **Cotação de Criptomoedas** : Exibe a cotação de uma criptomoeda específica nos últimos 7 dias.
* **Volume de Negociação** : Mostra o volume de negociação diário da criptomoeda nos últimos 7 dias.
* **Comparação entre Criptomoedas** : Permite comparar o preço da moeda selecionada com Ethereum, Dogecoin e Binance Coin.
* **Gráficos Interativos** : Gráficos gerados com `react-chartjs-2` para visualização de dados históricos.
* **Favoritos** : Gerenciamento de criptomoedas favoritas utilizando Context API.
* **Modo Escuro** : Alternância entre modo claro e escuro com persistência no localStorage.

## Tecnologias Utilizadas

* **React** : Biblioteca JavaScript para a construção da interface.
* **TypeScript** : Tipagem estática para JavaScript, proporcionando uma melhor experiência de desenvolvimento.
* **Tailwind CSS** : Framework CSS para o design da interface.
* **Context API** : Gerenciamento de estado dos favoritos das criptomoedas.
* **Chart.js** : Biblioteca de gráficos utilizada para renderizar as cotações e volumes.
* **Axios** : Utilizado para fazer requisições HTTP à API do CoinGecko.

## Instalação

### Pré-requisitos

* **Node.js** e **npm** instalados.

### Passos

1. Clone este repositório:

   ```
   git clone https://github.com/alyssonrafael/selecao-front-adasi-2024
   ```
2. Navegue até o diretório do projeto:

   ```
   cd selecao-front-adasi-2024
   ```
3. Instale as dependências:

   ```
   npm install
   ```
4. Inicie o servidor de desenvolvimento:

   ```
   npm start
   ```
5. Acesse a aplicação em [http://localhost:3000]().

## API Utilizada

A aplicação consome dados da API pública do  **[CoinGecko]()** , que oferece informações sobre preços, volumes, e outros detalhes de criptomoedas.

### Limitações de Requisições

A API do CoinGecko permite poucas requisiçoes por vez . Se o limite for excedido, a aplicação pode retornar um erro de requisição. Para evitar isso, a aplicação faz uso de caching na pagina inicial e outras otimizações para gerenciar o número de requisições.

## Estrutura do Projeto

### Principais Componentes

* **CryptoDetail** : Componente responsável por exibir os detalhes de uma criptomoeda específica, incluindo os gráficos de cotação e volume de negociação, bem como a comparação com outras moedas pre definidas.
* **CryptoContext:** um contexto React que utiliza a Context API para gerenciar o estado global da aplicação, especialmente relacionado ao gerenciamento das criptomoedas favoritas. Ele centraliza a lógica de adicionar, remover e armazenar as moedas favoritas, facilitando o compartilhamento desse estado entre diferentes componentes sem a necessidade de passar props manualmente.
* **CryptoList** : Exibe uma lista das 15 principais criptomoedas e permite ao usuário marcar as suas favoritas.

## Como Usar

1. **Visualizar Criptomoedas** : Na página inicial, selecione uma criptomoeda para ver seus detalhes, como preços e volume de negociação nos últimos 7 dias.
2. **Comparação de Preços** : Na página de detalhes, veja a comparação do preço da criptomoeda selecionada com Ethereum, Dogecoin e Binance Coin.
3. **Favoritar Moedas** : Marque suas criptomoedas favoritas clicando no ícone de coração. As moedas favoritas serão salvas e exibidas em uma lista separada que pode ser acessada na barra de navegação no canto superior da tela.
4. **Alternar Modo Escuro** : Use o botão no canto superior direito para alternar entre os modos claro e escuro. Sua escolha será armazenada no localStorage para manter a configuração entre sessões.
5. **Busca e filtros:** na pagina inicial há a possibilidade de realizar pesquisas entre as 15 moedas principais por nome e por simbolo da moeda. Há também a possibilidade de filtro com as moedas apenas em alta eapenas em queda.

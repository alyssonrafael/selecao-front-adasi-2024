import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import CryptoList from "./components/CryptoList";
import Favorites from "./components/Favorites";
import CryptoDetail from "./components/CryptoDetail";
import { CryptoProvider } from "./components/CryptoContext";
import { FaSun, FaMoon } from "react-icons/fa";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  // Carregar o tema do localStorage ao montar o componente
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Alternar o tema entre claro e escuro
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };
  return (
    <CryptoProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white transition-colors duration-300 ">
          <nav className="p-4 bg-blue-600 dark:bg-slate-600 text-white fixed w-full ">
            <div className="container mx-auto flex items-center justify-between px-6 py-2">
              <div>
                <Link className="mr-4" to="/">
                  Página Inicial
                </Link>
                <Link to="/favorites">Favoritos</Link>
              </div>
              {/* Botão de alternância para dark mode */}
              <button onClick={toggleDarkMode}>
                {darkMode ? (
                  <FaSun className="h-6 w-6 text-yellow-500" /> // Ícone de Sol para o modo claro
                ) : (
                  <FaMoon className="h-6 w-6 text-gray-700" /> // Ícone de Lua para o modo escuro
                )}
              </button>
            </div>
          </nav>

          <div className="pt-24">
            <Routes>
              <Route path="/" element={<CryptoList />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/crypto/:id" element={<CryptoDetail />} />{" "}
              {/* Rota para detalhes da criptomoeda */}
            </Routes>
          </div>
        </div>
      </Router>
    </CryptoProvider>
  );
}

export default App;

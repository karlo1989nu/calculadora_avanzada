import React from "react"; // Asegúrate de importar React
import { useState } from "react";

import "./App.css";
import Calculadora from "./components/Calculadora";
import Historial from "./components/Historial";
import RegistroUsuario from "./components/RegistroUsuario";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Calculadora />
      <Historial />
      <RegistroUsuario />
    </>
  );
}

export default App;

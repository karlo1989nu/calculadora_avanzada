import React, { useState } from "react";
import axios from "axios";

function Calculadora() {
  const [numero1, setNumero1] = useState("");
  const [numero2, setNumero2] = useState("");
  const [operacion, setOperacion] = useState("sumar");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const handleCalcular = async () => {
    setResultado(null);
    setError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/calcular", {
        operacion,
        a: parseFloat(numero1),
        b: parseFloat(numero2),
      });
      setResultado(response.data.resultado);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Error desconocido");
      } else {
        setError("Error de red: No se pudo conectar con el servidor");
      }
    }
  };

  const isDisabled = !numero1 || !numero2;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Calculadora</h1>
      <div className="mb-4">
        <label className="block mb-2">Número 1</label>
        <input
          type="number"
          value={numero1}
          onChange={(e) => setNumero1(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Número 2</label>
        <input
          type="number"
          value={numero2}
          onChange={(e) => setNumero2(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Operación</label>
        <select
          value={operacion}
          onChange={(e) => setOperacion(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="sumar">Sumar</option>
          <option value="restar">Restar</option>
          <option value="multiplicar">Multiplicar</option>
          <option value="dividir">Dividir</option>
        </select>
      </div>
      <button
        onClick={handleCalcular}
        disabled={isDisabled}
        className={`w-full p-2 rounded ${
          isDisabled
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        Calcular
      </button>
      <div className="mt-4">
        {resultado !== null && (
          <div className="p-4 bg-green-100 text-green-800 rounded">
            Resultado: {resultado}
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculadora;

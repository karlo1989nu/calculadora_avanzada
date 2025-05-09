import React, { useState, useEffect } from "react";
import axios from "axios";

function Historial() {
  const [historial, setHistorial] = useState([]); // Asegúrate de inicializar como un array
  const [operacionFiltro, setOperacionFiltro] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const registrosPorPagina = 10;

  const cargarHistorial = async () => {
    try {
      const response = await axios.get("/historial", {
        params: operacionFiltro ? { operacion: operacionFiltro } : {},
      });
      const data = Array.isArray(response.data) ? response.data : []; // Asegúrate de que sea un array
      setHistorial(data);
      setPagina(1); // Reinicia a la primera página al recargar
      setTotalPaginas(Math.ceil(data.length / registrosPorPagina));
    } catch (err) {
      console.error("Error al cargar el historial:", err);
      setHistorial([]); // En caso de error, asegúrate de que sea un array vacío
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, [operacionFiltro]);

  const historialPaginado = historial.slice(
    (pagina - 1) * registrosPorPagina,
    pagina * registrosPorPagina
  );

  const siguientePagina = () => {
    if (pagina < totalPaginas) setPagina(pagina + 1);
  };

  const paginaAnterior = () => {
    if (pagina > 1) setPagina(pagina - 1);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Historial de Operaciones</h1>
      <div className="mb-4 flex items-center gap-4">
        <select
          value={operacionFiltro}
          onChange={(e) => setOperacionFiltro(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Todas las operaciones</option>
          <option value="sumar">Sumar</option>
          <option value="restar">Restar</option>
          <option value="multiplicar">Multiplicar</option>
          <option value="dividir">Dividir</option>
        </select>
        <button
          onClick={cargarHistorial}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Recargar
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Fecha</th>
            <th className="border border-gray-300 p-2">Operación</th>
            <th className="border border-gray-300 p-2">Parámetros</th>
            <th className="border border-gray-300 p-2">Resultado</th>
          </tr>
        </thead>
        <tbody>
          {historialPaginado.length > 0 ? (
            historialPaginado.map((registro) => (
              <tr key={registro.id}>
                <td className="border border-gray-300 p-2">
                  {registro.timestamp}
                </td>
                <td className="border border-gray-300 p-2">
                  {registro.operacion}
                </td>
                <td className="border border-gray-300 p-2">
                  {JSON.stringify(registro.parametros)}
                </td>
                <td className="border border-gray-300 p-2">
                  {registro.resultado}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="border border-gray-300 p-2 text-center text-gray-500"
              >
                No hay registros para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={paginaAnterior}
          disabled={pagina === 1}
          className={`p-2 rounded ${
            pagina === 1
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Anterior
        </button>
        <span>
          Página {pagina} de {totalPaginas}
        </span>
        <button
          onClick={siguientePagina}
          disabled={pagina === totalPaginas}
          className={`p-2 rounded ${
            pagina === totalPaginas
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Historial;

import React, { useState } from "react";
import axios from "axios";

function RegistroUsuario() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [saldo, setSaldo] = useState("");
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState(null);

  const validarEmail = (email) => {
    return email.includes("@") && email.indexOf(".") > email.indexOf("@");
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }
    if (!email.trim()) {
      nuevosErrores.email = "El email es obligatorio.";
    } else if (!validarEmail(email)) {
      nuevosErrores.email = "El email no tiene un formato válido.";
    }
    if (saldo === "" || saldo < 0) {
      nuevosErrores.saldo = "El saldo debe ser un número mayor o igual a 0.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleRegistrar = async () => {
    if (!validarFormulario()) return;

    try {
      const response = await axios.post("/usuarios/registro", {
        nombre,
        email,
        saldo: parseFloat(saldo),
      });
      setMensaje({ tipo: "exito", texto: response.data.mensaje });
      setNombre("");
      setEmail("");
      setSaldo("");
      setErrores({});
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto: err.response?.data?.error || "Error al registrar el usuario.",
      });
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registro de Usuario</h1>
      {mensaje && (
        <div
          className={`p-4 rounded mb-4 ${
            mensaje.tipo === "exito"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {mensaje.texto}
        </div>
      )}
      <div className="mb-4">
        <label className="block mb-2">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {errores.nombre && (
          <p className="text-red-600 text-sm mt-1">{errores.nombre}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {errores.email && (
          <p className="text-red-600 text-sm mt-1">{errores.email}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block mb-2">Saldo</label>
        <input
          type="number"
          value={saldo}
          onChange={(e) => setSaldo(e.target.value)}
          className="w-full p-2 border rounded"
          min="0"
        />
        {errores.saldo && (
          <p className="text-red-600 text-sm mt-1">{errores.saldo}</p>
        )}
      </div>
      <button
        onClick={handleRegistrar}
        disabled={
          Object.keys(errores).length > 0 || !nombre || !email || saldo === ""
        }
        className={`w-full p-2 rounded ${
          Object.keys(errores).length > 0 || !nombre || !email || saldo === ""
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        Registrar
      </button>
    </div>
  );
}

export default RegistroUsuario;

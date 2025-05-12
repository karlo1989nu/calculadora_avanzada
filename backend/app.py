from calculos import sumar, restar, multiplicar, dividir, ErrorCalculo
from calculos import registrar_operacion
from usuarios import registrar_usuario, cargar_usuarios
import traceback
from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
import json

app = Flask(__name__)
app.config['DEBUG'] = True
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Configuración CORS

# Resto del código...

@app.errorhandler(Exception)
def handle_global_error(error):
    """
    Maneja errores globales y devuelve una respuesta estandarizada.
    """
    response = {
        "error": str(error),
        "detalle": traceback.format_exc()
    }
    return jsonify(response), 500

@app.errorhandler(ErrorCalculo)
def handle_error_calculo(error):
    """
    Maneja la excepción ErrorCalculo y devuelve un JSON con el mensaje de error.
    """
    response = {
        "error": str(error)
    }
    return jsonify(response), 400

@app.route("/calcular", methods=["POST"])
def calcular():
    """
    Realiza una operación matemática basada en la entrada del usuario.
    """
    data = request.json
    operacion = data.get("operacion")
    a = data.get("a")
    b = data.get("b")

    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        return jsonify({"error": "Los parámetros 'a' y 'b' deben ser números"}), 422

    operaciones = {
        "sumar": sumar,
        "restar": restar,
        "multiplicar": multiplicar,
        "dividir": dividir
    }

    if operacion not in operaciones:
        return jsonify({"error": f"La operación '{operacion}' no está permitida"}), 422

    try:
        resultado = operaciones[operacion](a, b)
        registrar_operacion(operacion, {"a": a, "b": b}, resultado)
        return jsonify({"resultado": resultado})
    except ErrorCalculo as e:
        raise e

@app.route("/historial", methods=["GET"])
def historial():
    """
    ""
    Devuelve las últimas 10 operaciones, con opción de filtrar por tipo de operación.
    ""
    operacion_filtro = request.args.get("operacion")
    historial = cargar_usuarios()  # Reutilizando cargar_usuarios para cargar historial

    if operacion_filtro:
        historial = [h for h in historial if h["operacion"] == operacion_filtro]

    historial = sorted(historial, key=lambda x: x["timestamp"], reverse=True)[:10]
    return jsonify(historial)*/
    """

 
    try:
        with open("historial.json", "r", encoding="utf-8") as file:
            data = json.load(file)
        print("Historial cargado correctamente:", data)  # Depuración
        return jsonify(data), 200
    except Exception as e:
        print("Error al cargar el historial:", str(e))  # Depuración
        return jsonify({"error": "Error al cargar el historial", "detalle": str(e)}), 500

@app.route("/usuarios/registro", methods=["POST"])
def registrar_usuario_endpoint():
    """
    Registra un nuevo usuario.
    """
    data = request.json
    nombre = data.get("nombre")
    email = data.get("email")
    saldo = data.get("saldo")

    try:
        registrar_usuario(nombre, email, saldo)
        return jsonify({"mensaje": "Usuario registrado"}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 422

if __name__ == "__main__":
    app.run(debug=True)
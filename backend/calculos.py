import json
import uuid
from datetime import datetime
from threading import Lock

from flask import Flask, request, jsonify
from calculos import *

app = Flask(__name__)

class ErrorCalculo(Exception):
    """Excepción personalizada para errores de cálculo."""
    pass

def sumar(a, b):
    """
    Retorna la suma de a y b.
    
    :param a: Primer número.
    :param b: Segundo número.
    :return: La suma de a y b.
    """
    return a + b

def restar(a, b):
    """
    Retorna la resta de a menos b.
    
    :param a: Primer número.
    :param b: Segundo número.
    :return: La resta de a menos b.
    """
    return a - b

def multiplicar(a, b):
    """
    Retorna el producto de a y b.
    
    :param a: Primer número.
    :param b: Segundo número.
    :return: El producto de a y b.
    """
    return a * b

def dividir(a, b):
    """
    Retorna la división de a entre b.
    
    :param a: Dividendo.
    :param b: Divisor.
    :return: El cociente de a entre b.
    :raises ErrorCalculo: Si b es 0.
    """
    if b == 0:
        raise ErrorCalculo("División por cero no permitida")
    return a / b

# Bloqueo para manejar concurrencia
lock = Lock()

HISTORIAL_FILE = "historial.json"

def registrar_operacion(operacion, parametros, resultado):
    """
    Registra una operación en el archivo historial.json.

    :param operacion: Nombre de la operación (ej: "sumar").
    :param parametros: Diccionario con los parámetros de la operación.
    :param resultado: Resultado de la operación.
    """
    entrada = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "operacion": operacion,
        "parametros": parametros,
        "resultado": resultado
    }

    with lock:
        try:
            # Leer el historial existente
            try:
                with open(HISTORIAL_FILE, "r", encoding="utf-8") as file:
                    historial = json.load(file)
            except FileNotFoundError:
                historial = []

            # Agregar la nueva entrada
            historial.append(entrada)

            # Escribir el historial actualizado
            with open(HISTORIAL_FILE, "w", encoding="utf-8") as file:
                json.dump(historial, file, indent=4, ensure_ascii=False)
        except Exception as e:
            print(f"Error al registrar la operación: {e}")




@app.errorhandler(ErrorCalculo)
def handle_error_calculo(error):
    """
    Maneja la excepción ErrorCalculo y devuelve un JSON con el mensaje de error.
    """
    response = {
        "error": str(error)
    }
    return jsonify(response), 400

@app.route("/sumar", methods=["POST"])
def route_sumar():
    data = request.json
    try:
        resultado = sumar(data["a"], data["b"])
        return jsonify({"resultado": resultado})
    except ErrorCalculo as e:
        raise e
    except Exception as e:
        return jsonify({"error": "Error interno del servidor"}), 500

@app.route("/restar", methods=["POST"])
def route_restar():
    data = request.json
    try:
        resultado = restar(data["a"], data["b"])
        return jsonify({"resultado": resultado})
    except ErrorCalculo as e:
        raise e
    except Exception as e:
        return jsonify({"error": "Error interno del servidor"}), 500

@app.route("/multiplicar", methods=["POST"])
def route_multiplicar():
    data = request.json
    try:
        resultado = multiplicar(data["a"], data["b"])
        return jsonify({"resultado": resultado})
    except ErrorCalculo as e:
        raise e
    except Exception as e:
        return jsonify({"error": "Error interno del servidor"}), 500

@app.route("/dividir", methods=["POST"])
def route_dividir():
    data = request.json
    try:
        resultado = dividir(data["a"], data["b"])
        return jsonify({"resultado": resultado})
    except ErrorCalculo as e:
        raise e
    except Exception as e:
        return jsonify({"error": "Error interno del servidor"}), 500

if __name__ == "__main__":
    app.run(debug=True)
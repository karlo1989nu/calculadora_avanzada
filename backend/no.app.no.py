from flask import Flask, jsonify, request  
app = Flask(__name__)  

# Ruta de prueba para verificar que el servidor funciona  
@app.route('/health', methods=['GET'])  
def health_check():  
    return jsonify({"status": "ok", "message": "Servidor activo"}), 200  

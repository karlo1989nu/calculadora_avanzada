import json
import uuid
from threading import Lock

USUARIOS_FILE = "usuarios.json"
lock = Lock()

def cargar_usuarios():
    """
    Carga la lista de usuarios desde el archivo usuarios.json.
    Si el archivo no existe, retorna una lista vacía.
    """
    try:
        with open(USUARIOS_FILE, "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def guardar_usuarios(usuarios):
    """
    Guarda la lista de usuarios en el archivo usuarios.json.
    """
    with lock:
        with open(USUARIOS_FILE, "w", encoding="utf-8") as file:
            json.dump(usuarios, file, indent=4, ensure_ascii=False)

def registrar_usuario(nombre, email, saldo):
    """
    Registra un nuevo usuario si el email no existe y es válido.

    :param nombre: Nombre del usuario.
    :param email: Email del usuario.
    :param saldo: Saldo inicial del usuario.
    :raises ValueError: Si el email tiene un formato incorrecto o ya existe.
    """
    if "@" not in email or "." not in email:
        raise ValueError("Formato de email incorrecto")

    usuarios = cargar_usuarios()
    if any(u["email"] == email for u in usuarios):
        raise ValueError("El email ya está registrado")

    nuevo_usuario = {
        "id": str(uuid.uuid4()),
        "nombre": nombre,
        "email": email,
        "saldo": saldo
    }
    usuarios.append(nuevo_usuario)
    guardar_usuarios(usuarios)

def actualizar_saldo(usuario_id, nuevo_saldo):
    """
    Actualiza el saldo de un usuario específico.

    :param usuario_id: ID del usuario.
    :param nuevo_saldo: Nuevo saldo a asignar.
    """
    usuarios = cargar_usuarios()
    usuarios_actualizados = list(map(
        lambda u: {**u, "saldo": nuevo_saldo} if u["id"] == usuario_id else u,
        usuarios
    ))
    guardar_usuarios(usuarios_actualizados)

def aplicar_descuento_general(porcentaje):
    """
    Aplica un descuento general a todos los usuarios.

    :param porcentaje: Porcentaje de descuento a aplicar.
    """
    if porcentaje < 0 or porcentaje > 100:
        raise ValueError("El porcentaje debe estar entre 0 y 100")

    usuarios = cargar_usuarios()
    usuarios_actualizados = list(map(
        lambda u: {**u, "saldo": round(u["saldo"] * (1 - porcentaje / 100), 2)},
        usuarios
    ))
    guardar_usuarios(usuarios_actualizados)
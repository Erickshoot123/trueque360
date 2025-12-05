import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './ChatPage.css'; // Crearemos este archivo para los estilos
import { API_BASE } from '../../api';

function ChatPage() {
  // --- Estados del Componente ---
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]); // Lista de todos los usuarios
  const [selectedUser, setSelectedUser] = useState(null); // El usuario con quien chateamos
  const [messages, setMessages] = useState([]); // Mensajes del chat seleccionado
  const [newMessage, setNewMessage] = useState(''); // El texto en el input
  
  // Obtenemos el token y el ID del usuario actual del login
  const token = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');
  
  // Ref para el final de la lista de mensajes (para auto-scroll)
  const messagesEndRef = useRef(null);

  // --- 1. Efecto: Conexión a Socket.IO ---
  useEffect(() => {
    if (!token) {
      // Si no hay token, no podemos conectarnos
      console.error('No token found. User is not authenticated.');
      return;
    }

    // Conectarse al servidor de Socket.IO (http://localhost:3000)
    // y enviar el token para autenticación
    const newSocket = io(API_BASE, {
      auth: {
        token: token
      }
    });

    // Guardar el socket en el estado
    setSocket(newSocket);

    // --- Configurar Listeners (Escuchadores) ---

    // Listener para el evento 'connect'
    newSocket.on('connect', () => {
      console.log('Conectado al servidor de Socket.IO con ID:', newSocket.id);
    });

    // Listener para 'receiveMessage' (cuando nos llega un mensaje)
    newSocket.on('receiveMessage', (message) => {
      // Solo actualizamos si el mensaje es de/para el usuario seleccionado
      if (selectedUser && (message.sender === selectedUser._id || message.receiver === selectedUser._id)) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    });

    // Listener para errores de conexión
    newSocket.on('connect_error', (err) => {
      console.error('Error de conexión de Socket.IO:', err.message);
      // Si el error es de autenticación, podríamos redirigir al login
      if (err.message === 'Authentication error: Invalid token') {
        // (Opcional: manejar deslogueo)
      }
    });

    // --- Limpieza ---
    // Se ejecuta cuando el componente se desmonta
    return () => {
      console.log('Desconectando socket...');
      newSocket.disconnect();
    };
  }, [token, selectedUser]); // 'selectedUser' está aquí para re-subscribir el listener


  // --- 2. Efecto: Cargar la lista de Usuarios (HTTP) ---
  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/users`, {
          headers: {
            // Enviamos el token en la cabecera HTTP
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de usuarios');
        }

        const data = await response.json();
        setUsers(data); // Guardamos los usuarios en el estado
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [token]); // Se ejecuta solo una vez al cargar


  // --- 3. Efecto: Auto-scroll al final ---
  useEffect(() => {
    // Cada vez que 'messages' cambia, hacemos scroll al fondo
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // --- Función: Cargar Historial de Chat (HTTP) ---
  const handleUserSelect = async (user) => {
    setSelectedUser(user); // Marcamos al usuario como seleccionado
    setMessages([]); // Limpiamos mensajes anteriores

    try {
      // Pedimos el historial de mensajes para este usuario
      const response = await fetch(`${API_BASE}/api/messages/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('No se pudo cargar el historial de mensajes');
      }
      const data = await response.json();
      setMessages(data); // Guardamos el historial en el estado
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };


  // --- Función: Enviar Mensaje (Socket.IO) ---
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!socket || !selectedUser || !newMessage.trim()) {
      return; // No hacer nada si no hay socket, usuario o mensaje
    }

    // Creamos el objeto del mensaje
    const messageData = {
      receiverId: selectedUser._id,
      content: newMessage.trim()
    };

    // Emitimos el evento 'sendMessage' al servidor
    socket.emit('sendMessage', messageData);

    // El servidor nos devolverá este mensaje a través de 'receiveMessage'
    // (junto con el _id, sender, etc.).
    // ¡No lo agregamos al estado aquí! Esperamos la confirmación del servidor.

    setNewMessage(''); // Limpiar el input
  };

  // --- Renderizado del JSX ---
  return (
    <div className="chat-page-container">
      
      {/* --- 1. Barra Lateral de Usuarios --- */}
      <div className="sidebar">
        <h3 className="sidebar-title">Contactos</h3>
        <ul className="user-list">
          {users.map(user => (
            <li 
              key={user._id} 
              className={`user-list-item ${selectedUser?._id === user._id ? 'selected' : ''}`}
              onClick={() => handleUserSelect(user)}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

      {/* --- 2. Ventana Principal del Chat --- */}
      <div className="chat-window">
        {selectedUser ? (
          <>
            {/* Cabecera del Chat */}
            <div className="chat-header">
              <h3>Chateando con: {selectedUser.username}</h3>
            </div>

            {/* Lista de Mensajes */}
            <div className="message-list">
              {messages.map((msg) => {
                // Comprobamos si el mensaje es nuestro o del otro
                const isMyMessage = msg.sender === currentUserId;
                return (
                  <div key={msg._id} className={`message-bubble ${isMyMessage ? 'my-message' : 'other-message'}`}>
                    <p className="message-content">{msg.content}</p>
                    <span className="message-timestamp">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              {/* Elemento invisible para el auto-scroll */}
              <div ref={messagesEndRef} />
            </div>

            {/* Formulario de Envío */}
            <form className="message-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="message-input"
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="send-button">Enviar</button>
            </form>
          </>
        ) : (
          // Pantalla de bienvenida si no hay chat seleccionado
          <div className="welcome-screen">
            <h3>Bienvenido a tu Chat</h3>
            <p>Selecciona un usuario de la lista para comenzar a chatear.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
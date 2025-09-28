// ChatInterface.jsx (Componente Principal)
import React, { useState } from 'react';

// Se asume que el componente maneja el estado de los mensajes...

const ChatInterface = () => {
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([]); // Array de mensajes

    // Simulación del envío de mensaje a la API (debe conectarse a tu backend real)
    const handleSend = async () => {
        if (!inputMessage.trim()) return;

        // Añadir el mensaje del usuario (Soporte Humano) [cite: 8]
        setMessages(prev => [...prev, { sender: 'user', text: inputMessage }]);
        
        // Simular la llamada al backend y obtener la respuesta JSON simulada
        // En la implementación real, esta función llama a la API REST.
        const mockResponse = await fetch('/api/chat', { 
             method: 'POST', body: JSON.stringify({ message: inputMessage }) 
        });
        const data = await mockResponse.json(); 
        
        // Añadir respuesta de la IA
        setMessages(prev => [...prev, { sender: 'ai', payload: data }]); 
        setInputMessage('');
    };

    // --------------------------------------------------------------------
    // COMPONENTES CLAVE DE FLOWSTATE UX (Basado en el diseño propuesto)
    // --------------------------------------------------------------------

    // Renderiza el fondo animado (Inteligencia Conectada / Dinamismo) [cite: 7, 10]
    const FlowBackground = () => (
        <div className="absolute inset-0 z-0 overflow-hidden bg-azul-oscuro-nodo">
            {/* Animación de red neuronal y nodos (simulación con degradados) */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 blur-3xl animate-pulse" 
                 style={{ backgroundImage: 'radial-gradient(circle at 10% 50%, rgba(121, 40, 202, 0.5), transparent 70%)' }} /> {/* Nodo Púrpura */}
            <div className="absolute bottom-0 right-0 w-full h-full opacity-30 blur-3xl animate-pulse delay-500" 
                 style={{ backgroundImage: 'radial-gradient(circle at 90% 50%, rgba(0, 112, 243, 0.5), transparent 70%)' }} /> {/* Nodo Azul */}
            {/* Las líneas de conexión se añaden con SVGs o librerías de partículas en una implementación completa */}
        </div>
    );

    // Componente de burbuja de mensaje de la IA
    const AIChatBubble = ({ payload }) => {
        const isCreativeOutput = payload.type === 'creative_output';

        return (
            <div className="max-w-xl my-3 p-4 rounded-lg shadow-xl relative z-10"
                 [cite_start]// Degradado Púrpura-Magenta (Innovación) [cite: 35]
                 style={{ backgroundImage: isCreativeOutput ? 'var(--flow-gradient-1)' : 'white' }}>
                 
                {/* Título y Contexto */}
                {isCreativeOutput && (
                    <>
                        <h3 className="font-bold text-lg mb-2 text-white">{payload.title}</h3>
                        <p className="text-sm text-gray-200 mb-4">{payload.context}</p>
                    </>
                )}

                {/* Ítems Generados - Aplicando énfasis Rojo AI [cite: 55] */}
                {isCreativeOutput ? (
                    <ul className="list-none space-y-3">
                        {payload.items.map(item => (
                            <li key={item.id} className={`text-base font-regular text-white ${item.color_accent === 'Rojo AI' ? 'font-bold' : ''}`}>
                                🔹 <span className={item.color_accent === 'Rojo AI' ? 'text-rojo-ai' : 'text-white'}>
                                    {item.text}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    // Output de texto simple (ej. Fallback o ideas de post)
                    <p className="text-azul-oscuro-nodo" dangerouslySetInnerHTML={{ __html: payload.reply }} />
                )}
                
                {/* Elemento Humano: Simulación del isotipo junto al texto de la IA */}
                <span className="absolute bottom-0 right-0 m-2 text-white opacity-50" title="Soporte Humano">
                    {/* Icono de Manos y Red Neuronal */}
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">...</svg>
                </span>
            </div>
        );
    };

    // Componente de la caja de Input (Elemento Humano/Accesibilidad) [cite: 11]
    const InputArea = () => (
        <div className="p-4 border-t border-gray-700 bg-azul-oscuro-nodo relative z-10">
            <div className="flex rounded-full overflow-hidden shadow-2xl" 
                 // Aplicación del degradado de conexión (Púrpura/Azul/Cian)
                 style={{ backgroundImage: 'var(--flow-gradient-2)' }}>
                <input
                    type="text"
                    className="flex-grow p-4 bg-white bg-opacity-90 text-gray-800 focus:outline-none placeholder-gray-500 font-sans text-base"
                    placeholder="Escribe tu mensaje..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    [cite_start]// Degradado Rojo-Escarlata (Poder y Acción) [cite: 37]
                    className="px-6 bg-flow-gradient-3 text-white font-bold hover:opacity-90 transition-opacity transform hover:scale-105 active:scale-95 shadow-rojo-ai shadow-lg"
                >
                    Enviar
                </button>
            </div>
        </div>
    );

    return (
        <div className="relative w-full h-screen flex flex-col font-sans">
            <FlowBackground />
            
            <div className="flex-grow overflow-y-auto p-6 space-y-4 relative z-10">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' ? (
                            <AIChatBubble payload={msg.payload} />
                        ) : (
                            // Burbuja del usuario (Nodo Humano)
                            <div className="max-w-xl bg-azul-oscuro-nodo text-white p-3 rounded-lg shadow-md font-regular">
                                {msg.text}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <InputArea />
        </div>
    );
};

export default ChatInterface;
import React, { useState, useRef, useEffect } from 'react';
import "./index.css"

// 🚨 PASO REQUERIDO: Asegúrate de que tus archivos PNG estén en estas rutas
// (Necesitas ajustar estas rutas de importación si la ubicación real es diferente)
import BotAvatarImg from './styles/img/bot_avatar.png'; 
import UserAvatarImg from './styles/img/user_avatar.png'; 
// Si estás usando Create React App/Vite, las rutas podrían ser diferentes (ej: '@/assets/bot_avatar.png')

// --- Definiciones de Marca FlowState AI ---
const COLOR_ROJO_AI = '#FF0055'; 
// El azul y el púrpura ya no se necesitan para el avatar, pero se mantienen para el fondo
// --- Fin Definiciones de Marca ---


// --- Configuración de Idiomas TTS (Mantenida) ---
const TTS_LANGUAGES = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'Inglés', flag: '🇬🇧' }, 
    { code: 'fr', name: 'Francés', flag: '🇫🇷' },
    { code: 'pt', name: 'Portugués', flag: '🇵🇹' },
    { code: 'zh', name: 'Chino', flag: '🇨🇳' },
    { code: 'ru', name: 'Ruso', flag: '🇷🇺' },
];

// Lógica de Session ID (Mantenida)
const getSessionId = () => {
  let sessionId = localStorage.getItem('adgenie_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now().toString().slice(-6); 
    localStorage.setItem('adgenie_session_id', sessionId);
  }
  return sessionId;
};
const SESSION_ID = getSessionId(); 
// --- Fin de Lógica de Session ID ---


// 🚨 NUEVO COMPONENTE: AVATAR DE IMAGEN 🚨
const ImageAvatar = ({ src, alt, isSpeaking, isLoading }) => {
    
    // Aplicamos el efecto de 'ping' (ondas de sonido) solo al bot cuando está hablando (TTS)
    const speakingRingClass = isSpeaking 
        ? 'ring-2 ring-offset-2 ring-offset-blue-700 animate-ping-once' 
        : '';
        
    // Creamos un efecto de carga (pulse) para la UX del bot
    const loadingClass = isLoading ? 'opacity-50 animate-pulse' : 'opacity-100';

    return (
        <div className={`relative w-10 h-10 flex-shrink-0 transition-opacity duration-300 ${loadingClass}`}>
            
            {/* Si está hablando, se muestra el efecto de onda (ping) */}
            {isSpeaking && (
                <span 
                    className="absolute inset-0 inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                    style={{ backgroundColor: COLOR_ROJO_AI }}
                ></span>
            )}
            
            {/* La imagen del avatar */}
            <img 
                src={src} 
                alt={alt} 
                className={`w-full h-full rounded-full object-cover transition-all duration-300 shadow-lg relative z-10 ${speakingRingClass}`}
                style={{ borderColor: isSpeaking ? COLOR_ROJO_AI : 'transparent' }}
            />
        </div>
    );
};
// 🚨 FIN COMPONENTE AVATAR DE IMAGEN 🚨


function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '¡Hola! Soy AdGenie, tu asistente de campañas publicitarias. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [ttsStatus, setTtsStatus] = useState({ isSpeaking: false, messageId: null });
  const [selectedTtsLang, setSelectedTtsLang] = useState('es'); 
  const [showLangSelectorFor, setShowLangSelectorFor] = useState(null); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // --- Handlers (Mantenidos) ---
  const handleFeedback = (id, type) => {
    console.log(`[DEBUG] Feedback para mensaje ${id}: ${type}`);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('✅ ¡Copiado al portapapeles!'))
      .catch(err => console.error('Error al copiar:', err));
  };

  const handleShare = (text) => {
    if (navigator.share) {
      navigator.share({
        title: 'Respuesta de AdGenie',
        text: text,
      }).catch(error => console.error('Error al compartir:', error));
    } else {
      alert('El navegador no soporta la función Compartir. Copia el texto directamente.');
      handleCopy(text);
    }
  };
  
  const handleLangSelect = (langCode, messageId, messageText) => {
    setSelectedTtsLang(langCode);
    setShowLangSelectorFor(null); 
    handleTTS(messageId, messageText, langCode); 
  };

  const handleTTS = (id, text, targetLang = selectedTtsLang) => {
    const synth = window.speechSynthesis;

    if (ttsStatus.isSpeaking && ttsStatus.messageId === id) {
      synth.cancel(); 
      setTtsStatus({ isSpeaking: false, messageId: null });
      return;
    }
    
    if (ttsStatus.isSpeaking) {
      synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    const allVoices = synth.getVoices();
    const selectedVoice = allVoices.find(voice => voice.lang.startsWith(targetLang));

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setTtsStatus({ isSpeaking: true, messageId: id });
    };
    utterance.onend = () => {
      setTtsStatus({ isSpeaking: false, messageId: null });
    };

    synth.speak(utterance);
  };


  // --- LÓGICA DE ENVÍO (Mantenida) ---
  const handleSend = async () => {
    if (!input.trim() || isLoading) {
        return;
    }

    const userMessage = { sender: 'user', text: input };
    const currentInput = input;
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const payload = { 
        message: currentInput,
        session_id: SESSION_ID 
    };
    const API_URL = "https://adgenie-enducngjbdbqhze5.westus2-01.azurewebsites.net/chat/message";
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.reply }; 
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("[ERROR: Frontend] Error en el bloque try/catch:", error);
      const errorMessage = { sender: 'bot', text: "Lo siento, hubo un error de conexión con AdGenie. Por favor, verifica el backend." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsLoading(false); 
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };
  
  
  // --- Componente Selector de Idioma (Mantenido) ---
  const LanguageSelector = ({ messageId, messageText }) => (
    <div className="absolute bottom-full right-0 mb-2 p-2 bg-blue-800 rounded-lg shadow-xl flex space-x-2 border border-blue-600 z-50">
      {TTS_LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLangSelect(lang.code, messageId, messageText)}
          title={`Escuchar en ${lang.name}`}
          className={`text-xl p-1 rounded-full transform hover:scale-125 transition-transform ${selectedTtsLang === lang.code ? 'ring-2 ring-red-300' : 'opacity-80'}`}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
  // --- Fin Componente Selector ---


  // --- COMPONENTE DE BARRA DE ACCIONES (Mantenido) ---
  const BotActionsBar = ({ messageId, messageText }) => {
    const isCurrentlyReading = ttsStatus.isSpeaking && ttsStatus.messageId === messageId;
    const isSelectorOpen = showLangSelectorFor === messageId;
    const currentLang = TTS_LANGUAGES.find(l => l.code === selectedTtsLang);
    const currentFlag = currentLang ? currentLang.flag : '🔊';


    return (
        <div className="flex justify-end space-x-3 pt-3 mt-2 border-t border-blue-600/50 relative">
            
            <button className="text-sm opacity-80 hover:opacity-100 transition-opacity transform hover:scale-110" onClick={() => handleFeedback(messageId, 'like')} title="Me gusta esta respuesta">👍</button>
            <button className="text-sm opacity-80 hover:opacity-100 transition-opacity transform hover:scale-110" onClick={() => handleFeedback(messageId, 'dislike')} title="No me gusta esta respuesta">👎</button>
            <button className="text-sm opacity-80 hover:opacity-100 transition-opacity transform hover:scale-110" onClick={() => handleCopy(messageText)} title="Copiar al portapapeles">📋</button>
            <button className="text-sm opacity-80 hover:opacity-100 transition-opacity transform hover:scale-110" onClick={() => handleShare(messageText)} title="Compartir respuesta">🔗</button>
            
            <button 
                className={`text-xl transition-colors transform hover:scale-110 ${isSelectorOpen ? 'ring-2 ring-red-300' : 'opacity-80'}`} 
                onClick={() => setShowLangSelectorFor(isSelectorOpen ? null : messageId)}
                title={`Idioma de voz: ${currentLang.name}. Clic para cambiar.`}
            >
                {currentFlag} 
            </button>

            <button 
                className={`text-sm transition-colors transform hover:scale-110 ${isCurrentlyReading ? 'text-red-300' : 'opacity-80'}`} 
                onClick={() => handleTTS(messageId, messageText)}
                title={isCurrentlyReading ? 'Detener lectura' : 'Escuchar respuesta'}
            >
                {isCurrentlyReading ? '🔊' : '🔈'} 
            </button>

            {isSelectorOpen && (
                <LanguageSelector messageId={messageId} messageText={messageText} />
            )}
        </div>
    );
  };
  // --- FIN COMPONENTE DE BARRA DE ACCIONES ---


  // --- Función de Utilidad para Markdown (Mantenida) ---
  const formatMessageText = (text) => {
    const applyEmphasis = (t) => {
        const parts = t.split(/(\*\*.*?\*\*)/); 
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const key = part.replace(/\*\*/g, '');
                return (
                    <span 
                        key={`e-${index}`} 
                        className="font-extrabold" 
                        style={{ color: COLOR_ROJO_AI }}
                    >
                        {key}
                    </span>
                );
            }
            return <span key={`t-${index}`}>{part}</span>;
        });
    };

    const listMatch = text.match(/\s*1\.\s*/);
    if (!listMatch) {
        return <p>{applyEmphasis(text.trim())}</p>;
    }
    
    const [match] = listMatch;
    const listIndex = text.indexOf(match);
    const introText = text.substring(0, listIndex).trim();
    const contentText = text.substring(listIndex).trim();

    const itemsAndConclusion = contentText.split(/([0-9]+\.\s*)/).filter(s => s.trim() !== '');

    let currentItems = [];
    let conclusionText = '';
    let isConclusionPhase = false;

    for (let i = 0; i < itemsAndConclusion.length; i++) {
        const part = itemsAndConclusion[i];
        
        if (part.match(/^[0-9]+\.\s*$/)) {
            isConclusionPhase = false; 
        } else if (!isConclusionPhase && itemsAndConclusion[i-1] && itemsAndConclusion[i-1].match(/^[0-9]+\.\s*$/)) {
            currentItems.push(part.trim());
        } else {
            isConclusionPhase = true;
            conclusionText += part;
        }
    }

    return (
        <>
            {introText && <p>{applyEmphasis(introText)}</p>}
            {currentItems.length > 0 && (
                <ol className="list-decimal pl-6 mt-2 space-y-2"> 
                    {currentItems.map((item, i) => (
                        <li key={`li-${i}`}>
                            {applyEmphasis(item.trim())}
                        </li>
                    ))}
                </ol>
            )}
            {conclusionText.trim() && <p className="pt-2">{applyEmphasis(conclusionText.trim())}</p>}
        </>
    );
  };
  // --- Fin Función de Utilidad ---


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-purple-600 via-blue-500 to-red-500 font-sans text-white">

      {/* Fondo animado (Mantenido) */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
        <div className="absolute top-0 left-0 w-full h-full blur-3xl animate-pulse" 
             style={{ background: 'radial-gradient(circle at 10% 50%, rgba(121, 40, 202, 0.4), transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-full h-full blur-3xl animate-pulse delay-500" 
             style={{ background: 'radial-gradient(circle at 90% 50%, rgba(0, 112, 243, 0.4), transparent 70%)' }} />
      </div>

      <header className="p-6 shadow-md bg-opacity-50 backdrop-blur-md relative z-20 sticky top-0 w-full">
        <h1 className="text-4xl font-bold">AdGenie</h1>
        <p className="text-lg mt-1">Chatbot para atención de campañas publicitarias</p>
      </header>

      <main className="flex-1 p-6 overflow-y-auto relative z-10">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-start`}
            >
                {/* 🚨 AVATAR DEL BOT 🚨 */}
                {msg.sender === 'bot' && (
                    <div className="mr-3 mt-1">
                        <ImageAvatar 
                            src={BotAvatarImg} 
                            alt="AdGenie Avatar"
                            isSpeaking={ttsStatus.isSpeaking && ttsStatus.messageId === idx}
                            isLoading={false} 
                        />
                    </div>
                )}
                
                {/* 🚨 AVATAR DEL USUARIO 🚨 */}
                {msg.sender === 'user' && (
                    <div className="ml-3 mt-1 order-2">
                        <ImageAvatar 
                            src={UserAvatarImg} 
                            alt="User Avatar"
                            isSpeaking={false} // El usuario no tiene estado de 'hablando' ni 'cargando'
                            isLoading={false}
                        />
                    </div>
                )}
                
                {/* Contenedor del Mensaje */}
              <div
                className={`p-4 rounded-xl break-words max-w-md ${ 
                  msg.sender === 'user' ? 'bg-red-600 text-white order-1' : 'bg-blue-700 text-white'
                }`}
              >
                {msg.sender === 'bot' ? formatMessageText(msg.text) : msg.text}

                {msg.sender === 'bot' && (
                    <BotActionsBar messageId={idx} messageText={msg.text} />
                )}
              </div>
            </div>
          ))}
          {/* 🚨 INDICADOR DE CARGA CON AVATAR DE IMAGEN 🚨 */}
          {isLoading && (
            <div className="flex justify-start items-center">
                <div className="mr-3 mt-1">
                    <ImageAvatar 
                        src={BotAvatarImg} 
                        alt="AdGenie Avatar Loading"
                        isSpeaking={false}
                        isLoading={true} 
                    />
                </div>
                <div className="px-4 py-2 rounded-xl bg-blue-700 text-white">
                    AdGenie procesando...
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 bg-opacity-50 backdrop-blur-md flex relative z-20">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje..."
          className="flex-1 p-3 rounded-l-2xl text-black bg-white focus:ring-4 focus:ring-blue-700 focus:border-blue-700 transition-all shadow-xl"
          disabled={isLoading} 
        />
        <button
          onClick={handleSend}
          className={`px-6 rounded-r-2xl font-bold transition-colors text-white ${isLoading ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'}`}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Enviar'}
        </button>
      </footer>
    </div>
  );
}

export default App;
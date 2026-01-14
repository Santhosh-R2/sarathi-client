import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import axiosInstance from './baseUrl';
// IMPORT THE PACKAGE
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function AiChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  // Ref to store text present before speaking started
  const baseTextRef = useRef('');
  // Ref to track if the user clicked the "X" button (to prevent auto-send)
  const isCancelledRef = useRef(false);

  const user = JSON.parse(localStorage.getItem('sarathiUser')) || { _id: "guest", fullName: "User", language: "English" };

  // Destructure values from the package hook
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // --- 1. DATA LOADING ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const langMap = { "Malayalam": "ml", "Tamil": "ta", "Hindi": "hi", "English": "en" };
        const langCode = langMap[user.language] || "en";

        const tutRes = await axiosInstance.get(`tutorials?lang=${langCode}`);
        setSuggestions(tutRes.data);
        const historyRes = await axiosInstance.get(`users/history/${user._id}`);

        if (historyRes.data.history && historyRes.data.history.length > 0) {
          const oldMessages = [];
          historyRes.data.history.reverse().forEach(chat => {
            oldMessages.push({ sender: 'user', text: chat.originalText });
            oldMessages.push({ sender: 'ai', text: chat.translatedResponse });
          });
          setMessages(oldMessages);
        } else {
          setMessages([{ sender: 'ai', text: `Namaskaram ${user.fullName}! I am Digital Sarathi. How can I guide you today?` }]);
        }
      } catch (err) {
        console.error("Initialization Error:", err);
      }
    };
    fetchData();
  }, [user._id, user.fullName, user.language]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 2. SYNC SPEECH TO INPUT ---
  useEffect(() => {
    if (transcript) {
      // Combine base text + new speech
      const prefix = baseTextRef.current ? baseTextRef.current + ' ' : '';
      setInputText(prefix + transcript);
    }
  }, [transcript]);

  // --- 3. AUTO-SEND LOGIC (NEW) ---
  // This runs whenever the 'listening' state changes
  useEffect(() => {
    // If recording just stopped AND it wasn't cancelled AND we have text...
    if (!listening && inputText.trim() && !isCancelledRef.current) {
        // Wait a tiny bit to ensure transcript is fully merged, then send
        sendMessage(inputText);
    }
  }, [listening]); // Only runs when start/stop happens

  // --- 4. HANDLE CONTROLS ---
  const handleMicToggle = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }

    if (listening) {
      // STOPPING -> This will trigger the useEffect above to Send
      SpeechRecognition.stopListening();
    } else {
      // STARTING
      isCancelledRef.current = false; // Reset cancel flag
      baseTextRef.current = inputText; // Snapshot current text
      resetTranscript();
      
      const langMap = { "Malayalam": "ml-IN", "Tamil": "ta-IN", "Hindi": "hi-IN", "English": "en-US" };
      const code = langMap[user.language] || "en-US";

      SpeechRecognition.startListening({ continuous: true, language: code });
    }
  };

  const handleCancel = () => {
    // Mark as cancelled so the useEffect doesn't send it
    isCancelledRef.current = true;
    
    if (listening) {
      SpeechRecognition.stopListening();
    }
    resetTranscript();
    setInputText('');
    baseTextRef.current = '';
  };

  const clearHistory = async () => {
    if (window.confirm("Delete chat history?")) {
      try {
        await axiosInstance.delete(`users/history/${user._id}`);
        setMessages([{ sender: 'ai', text: "History cleared." }]);
      } catch (err) {
        alert("Failed.");
      }
    }
  };

  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;
    
    // Safety: ensure mic is stopped
    if (listening) {
      isCancelledRef.current = true; // prevent double send loop
      SpeechRecognition.stopListening();
    }

    resetTranscript();
    setMessages(prev => [...prev, { sender: 'user', text: text }]);
    setLoading(true);
    setInputText('');
    baseTextRef.current = ''; 
    
    try {
      const res = await axiosInstance.post('users/voice-chat', {
        userId: user._id,
        textInput: text
      });

      setMessages(prev => [...prev, {
        sender: 'ai',
        text: res.data.aiSaid,
        steps: res.data.steps
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Connection error." }]);
    } finally { setLoading(false); }
  };

  // --- STYLES ---
  const colors = { primary: '#2563EB', bg: '#F3F4F6', aiBubble: '#FFFFFF', userBubble: '#2563EB', text: '#1F2937', red: '#EF4444' };

  const styles = {
    wrapper: { display: 'flex', justifyContent: 'center', height: '100vh', backgroundColor: colors.bg, fontFamily: "'Inter', 'Segoe UI', sans-serif" },
    container: { width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', backgroundColor: '#fff', boxShadow: '0 0 20px rgba(0,0,0,0.05)' },
    header: { padding: '16px 20px', background: `linear-gradient(135deg, ${colors.primary}, #1E40AF)`, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    chatWindow: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px', backgroundColor: '#F9FAFB' },
    aiBubble: { alignSelf: 'flex-start', backgroundColor: colors.aiBubble, color: colors.text, padding: '14px 18px', borderRadius: '20px 20px 20px 4px', maxWidth: '85%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB', lineHeight: '1.5' },
    userBubble: { alignSelf: 'flex-end', backgroundColor: colors.userBubble, color: 'white', padding: '14px 18px', borderRadius: '20px 20px 4px 20px', maxWidth: '80%', boxShadow: '0 2px 5px rgba(37, 99, 235, 0.2)', lineHeight: '1.5' },
    stepBox: { marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #E5E7EB' },
    stepItem: { marginBottom: '8px', fontSize: '14px', color: '#4B5563' },
    suggestionBar: { display: 'flex', gap: '10px', padding: '12px 15px', overflowX: 'auto', backgroundColor: '#fff', borderTop: '1px solid #F3F4F6' },
    suggestionChip: { backgroundColor: '#EFF6FF', color: colors.primary, border: '1px solid #BFDBFE', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: '500' },
    inputArea: { padding: '15px 20px', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #E5E7EB' },
    inputBox: { flex: 1, padding: '14px 20px', borderRadius: '30px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '15px', backgroundColor: '#F9FAFB' },
    micBtn: { width: '50px', height: '50px', borderRadius: '50%', border: 'none', backgroundColor: listening ? colors.red : colors.primary, color: 'white', cursor: 'pointer', fontSize: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.3s', boxShadow: listening ? '0 0 0 4px rgba(239, 68, 68, 0.2)' : 'none', animation: listening ? 'pulse 1.5s infinite' : 'none' },
    cancelBtn: { width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: '#E5E7EB', color: '#6B7280', cursor: 'pointer', fontWeight: 'bold', marginRight: '5px' },
    sendBtn: { backgroundColor: 'transparent', border: 'none', color: colors.primary, fontWeight: '700', cursor: 'pointer', fontSize: '15px' },
    deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', filter: 'brightness(0) invert(1)', opacity: 0.8 }
  };

  return (
    <div style={styles.wrapper}>
      <style>
        {`@keyframes pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
          .hide-scrollbar::-webkit-scrollbar { display: none; }`}
      </style>

      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '18px' }}>Digital Sarathi</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>{user.language} Mode</div>
          </div>
          <button style={styles.deleteBtn} onClick={clearHistory} title="Clear History">🗑️</button>
        </div>

        <div style={styles.chatWindow}>
          {messages.map((m, i) => (
            <div key={i} style={m.sender === 'user' ? styles.userBubble : styles.aiBubble}>
              <div style={{ fontWeight: m.steps ? '600' : '400' }}>{m.text}</div>
              {m.steps && m.steps.length > 0 && (
                <div style={styles.stepBox}>
                  {m.steps.map((step, idx) => (
                    <div key={idx} style={styles.stepItem}>• {step}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && <div style={{ fontSize: '13px', color: '#9CA3AF', paddingLeft: '10px' }}>AI is thinking...</div>}
          <div ref={chatEndRef} />
        </div>

        {!listening && suggestions.length > 0 && (
          <div style={styles.suggestionBar} className="hide-scrollbar">
            {suggestions.slice(0, 10).map((tut, idx) => (
              <button key={idx} style={styles.suggestionChip} onClick={() => sendMessage(tut.title)}>
                {tut.title}
              </button>
            ))}
          </div>
        )}

        <form style={styles.inputArea} onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); }}>
          
          <button type="button" style={styles.micBtn} onClick={handleMicToggle} title={listening ? "Stop & Send" : "Start Recording"}>
            {listening ? '■' : '🎤'}
          </button>

          <input
            style={{
              ...styles.inputBox,
              ...( (!isMicrophoneAvailable && !browserSupportsSpeechRecognition) ? { borderColor: '#EF4444', color: '#EF4444' } : {})
            }}
            placeholder={listening ? "Listening..." : "Type or speak..."}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              // Update baseText if user types manually to keep sync
              if(!listening) baseTextRef.current = e.target.value; 
            }}
          />

          {inputText && (
            <button type="button" style={styles.cancelBtn} onClick={handleCancel} title="Cancel & Clear">
              ✕
            </button>
          )}

          <button type="submit" style={{...styles.sendBtn, opacity: inputText.trim() ? 1 : 0.5}} disabled={!inputText.trim()}>
            SEND
          </button>
        </form>
      </div>
    </div>
  );
}

export default AiChat;
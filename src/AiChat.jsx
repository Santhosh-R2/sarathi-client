import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import axiosInstance from './baseUrl';
function AiChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const user = JSON.parse(localStorage.getItem('sarathiUser')) || { _id: "guest", fullName: "User", language: "English" };

useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Map the user's language string to an ISO code for the API
        const langMap = {
            "Malayalam": "ml",
            "Tamil": "ta",
            "Hindi": "hi",
            "English": "en"
        };
        const langCode = langMap[user.language] || "en";

        // 2. Fetch Tutorials with the language query parameter
        // This will now return suggestions in the native language
        const tutRes = await axiosInstance.get(`tutorials?lang=${langCode}`);
        setSuggestions(tutRes.data);

        // 3. Fetch History
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
  }, [user._id, user.fullName, user.language]); // Added user.language to dependencies

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMicClick = () => { isRecording ? stopRecording() : startRecording(); };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.current.push(e.data); };
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => sendVoiceToAI(reader.result);
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) { alert("Mic access denied."); }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  const clearHistory = async () => {
    if (window.confirm("Do you want to delete all chat history?")) {
      try {
        await axiosInstance.delete(`users/history/${user._id}`);
        setMessages([{ sender: 'ai', text: "History cleared. How can I help you now?" }]);
      } catch (err) {
        alert("Failed to clear history.");
      }
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: text }]);
    setLoading(true);
    try {
      const res = await axiosInstance.post('users/voice-chat', {
        userId: user._id,
        textInput: text
      });
      console.log(res);
      
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: res.data.aiSaid, 
        steps: res.data.steps 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Connection error." }]);
    } finally { setLoading(false); }
  };

  const sendVoiceToAI = async (base64Audio) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post('users/voice-chat', {
        userId: user._id,
        audioBase64: base64Audio
      });
      if (res.data.success) {
        setMessages(prev => [
            ...prev, 
            { sender: 'user', text: res.data.userSaid }, 
            { sender: 'ai', text: res.data.aiSaid, steps: res.data.steps }
        ]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Could not process voice." }]);
    } finally { setLoading(false); }
  };

  const colors = { primary: '#1a73e8', bg: '#f8f9fa', aiMsg: '#ffffff', userMsg: '#1a73e8', text: '#3c4043' };

  const styles = {
    wrapper: { display: 'flex', justifyContent: 'center', height: '100vh', backgroundColor: colors.bg, fontFamily: "'Segoe UI', Roboto, sans-serif" },
    container: { width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', backgroundColor: colors.bg, borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd' },
    header: { padding: '15px 20px', backgroundColor: colors.primary, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    chatWindow: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
    aiBubble: { alignSelf: 'flex-start', backgroundColor: colors.aiMsg, color: colors.text, padding: '12px 16px', borderRadius: '18px 18px 18px 4px', maxWidth: '85%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #eee' },
    userBubble: { alignSelf: 'flex-end', backgroundColor: colors.userMsg, color: 'white', padding: '12px 16px', borderRadius: '18px 18px 4px 18px', maxWidth: '80%' },
    stepBox: { marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #ccc' },
    stepItem: { marginBottom: '6px', fontSize: '14px', color: '#555', listStyleType: 'none' },
    suggestionBar: { display: 'flex', gap: '8px', padding: '10px', overflowX: 'auto', backgroundColor: '#eee' },
    suggestionChip: { backgroundColor: 'white', color: colors.primary, border: `1px solid ${colors.primary}`, padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px' },
    inputArea: { padding: '15px', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid #eee' },
    inputBox: { flex: 1, padding: '12px 18px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none' },
    micBtn: { width: '45px', height: '45px', borderRadius: '50%', border: 'none', backgroundColor: isRecording ? '#ea4335' : colors.primary, color: 'white', cursor: 'pointer', fontSize: '20px' },
    deleteBtn: { backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px', opacity: 0.8 }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={{fontWeight: 'bold'}}>Digital Sarathi</div>
            <div style={{fontSize: '11px'}}>{user.language} Mode</div>
          </div>
          <button style={styles.deleteBtn} onClick={clearHistory} title="Clear History">🗑️</button>
        </div>

        <div style={styles.chatWindow}>
          {messages.map((m, i) => (
            <div key={i} style={m.sender === 'user' ? styles.userBubble : styles.aiBubble}>
              <div style={{fontWeight: m.steps ? '600' : '400'}}>{m.text}</div>
              {/* RENDER STEPS ARRAY IF EXISTS */}
              {m.steps && m.steps.length > 0 && (
                <div style={styles.stepBox}>
                  {m.steps.map((step, idx) => (
                    <div key={idx} style={styles.stepItem}>{step}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && <div style={{fontSize: '12px', color: '#888'}}>Thinking...</div>}
          <div ref={chatEndRef} />
        </div>

        {!isRecording && suggestions.length > 0 && (
          <div style={styles.suggestionBar} className="hide-scrollbar">
            {suggestions.slice(0, 10).map((tut, idx) => (
              <button key={idx} style={styles.suggestionChip} onClick={() => sendMessage(tut.title)}>
                {tut.title}
              </button>
            ))}
          </div>
        )}

        <form style={styles.inputArea} onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); setInputText(''); }}>
          <button type="button" style={styles.micBtn} onClick={handleMicClick}>{isRecording ? '⏹' : '🎤'}</button>
          <input style={styles.inputBox} placeholder={isRecording ? "Listening..." : "How can I help?"} value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={isRecording} />
          <button type="submit" style={{...styles.deleteBtn, color: colors.primary, fontWeight: 'bold'}} disabled={isRecording || !inputText.trim()}>SEND</button>
        </form>
      </div>
    </div>
  );
}

export default AiChat;
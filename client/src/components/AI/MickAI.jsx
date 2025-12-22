import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, MessageSquare, Volume2, X } from 'lucide-react';
import API_BASE_URL from '../../utils/api';

const MickAI = () => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [reply, setReply] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [textInput, setTextInput] = useState('');

    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            setIsSupported(true);

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                setTranscript('');
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onresult = (event) => {
                const text = event.results[0][0].transcript;
                setTranscript(text);
                processCommand(text);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
                if (event.error === 'not-allowed') {
                    alert('Microphone access denied. Please allow microphone permissions in your browser settings.');
                } else if (event.error === 'no-speech') {
                    // Ignore no-speech, just stop listening or retry
                } else {
                    alert(`Microphone Error: ${event.error}`);
                }
            };
        } else {
            console.warn('Web Speech API not supported in this browser.');
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            if (synthRef.current) synthRef.current.cancel();
        };
    }, []);

    const processCommand = async (text) => {
        setIsProcessing(true);
        setIsOpen(true); // Open panel to show text
        try {
            const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await res.json();

            if (data.reply) {
                setReply(data.reply);
                speakResponse(data.reply);
            }
        } catch (error) {
            console.error('AI Error:', error);
            setReply("Sorry, I couldn't connect to my brain.");
            speakResponse("Sorry, I couldn't connect to my brain.");
        } finally {
            setIsProcessing(false);
        }
    };

    const speakResponse = (text) => {
        if (synthRef.current) {
            // Cancel any current speech
            synthRef.current.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);

            // Optional: Select a specific voice preference
            const voices = synthRef.current.getVoices();
            const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha'));
            if (preferredVoice) utterance.voice = preferredVoice;

            synthRef.current.speak(utterance);
        }
    };

    const toggleListening = async () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setReply('');
            setTranscript('');

            try {
                // Explicitly request permission first to ensure it's granted and find out why if not
                await navigator.mediaDevices.getUserMedia({ audio: true });
                recognitionRef.current?.start();
            } catch (err) {
                console.error('Microphone permission check failed:', err);
                setIsOpen(true); // Open the chat box anyway so user can use text input
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    alert('Microphone blocked. You can type your query in the box above.');
                } else if (err.name === 'NotFoundError') {
                    alert('No microphone found. You can type your query in the box above.');
                } else {
                    alert(`Microphone Issue. Using text mode.`);
                }
            }
        }
    };

    const handleTextSubmit = (e) => {
        e.preventDefault();
        if (textInput.trim()) {
            setTranscript(textInput);
            processCommand(textInput);
            setTextInput('');
        }
    };

    if (!isSupported) return null; // Don't render if not supported

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '1rem'
        }}>
            {/* Chat Bubble */}
            {(isOpen || isListening || isProcessing || isSpeaking) && (
                <div className="glass" style={{
                    width: '300px',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    marginBottom: '1rem',
                    transformOrigin: 'bottom right',
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageSquare size={16} color="var(--accent-primary)" />
                            Mick AI
                        </h4>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <X size={16} />
                        </button>
                    </div>

                    {transcript && (
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            marginBottom: '1rem',
                            borderLeft: '2px solid var(--accent-primary)'
                        }}>
                            "{transcript}"
                        </div>
                    )}


                    {isProcessing && (
                        <div style={{ display: 'flex', gap: '0.25rem', padding: '0.5rem' }}>
                            <div className="dot-pulse"></div>
                            <div className="dot-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="dot-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    )}

                    {reply && !isProcessing && (
                        <div style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                            {reply}
                        </div>
                    )}

                    {/* Text Input Area */}
                    <form onSubmit={handleTextSubmit} style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Type a message..."
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '20px',
                                padding: '0.5rem 1rem',
                                color: 'white',
                                fontSize: '0.9rem',
                                outline: 'none'
                            }}
                        />
                        <button type="submit" disabled={!textInput.trim() || isProcessing} style={{
                            background: 'var(--accent-primary)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white'
                        }}>
                            <MessageSquare size={14} />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={toggleListening}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: isListening
                        ? 'linear-gradient(135deg, #ef4444, #f87171)'
                        : (isSpeaking ? 'linear-gradient(135deg, #10b981, #34d399)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)'),
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: isListening ? 'scale(1.1)' : 'scale(1)'
                }}
            >
                {isListening ? (
                    <MicOff size={24} />
                ) : isSpeaking ? (
                    <Volume2 size={24} className="animate-pulse" />
                ) : (
                    <Mic size={24} />
                )}
            </button>

            {/* Styles for pulsing animation */}
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.9); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .dot-pulse {
                    width: 8px;
                    height: 8px;
                    background: var(--text-muted);
                    borderRadius: 50%;
                    animation: pulse 1s infinite alternate;
                }
                @keyframes pulse {
                    from { opacity: 0.3; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1.1); }
                }
                .animate-pulse {
                    animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
                }
            `}</style>
        </div>
    );
};

export default MickAI;

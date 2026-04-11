import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const ResearchAssistant = () => {
    const { t } = useTranslation();
    const [userQuestion, setUserQuestion] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);

    const API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userQuestion.trim()) return;

        if (!API_KEY) {
            setError(t('assistant.error_key'));
            return;
        }

        const currentQuestion = userQuestion;
        setUserQuestion('');
        setMessages(prev => [...prev, { role: 'user', content: currentQuestion }]);
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("https://api.perplexity.ai/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    model: "sonar-pro",
                    messages: [
                        { role: "system", content: t('assistant.system_prompt') },
                        ...messages.slice(-4), // Context window
                        { role: "user", content: currentQuestion }
                    ]
                })
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();
            const answer = data.choices?.[0]?.message?.content;

            setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
        } catch (err) {
            console.error("Research Assistant Error:", err);
            setError(t('assistant.error_conn'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="research-assistant glass-card">
            <div className="assistant-header">
                <div className="assistant-badge">{t('assistant.badge')}</div>
                <h3>{t('assistant.title')}</h3>
                <p>{t('assistant.subtitle')}</p>
            </div>

            <div className="chat-window" ref={scrollRef}>
                <AnimatePresence>
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="empty-state"
                        >
                            <p>{t('assistant.empty_state')}</p>
                        </motion.div>
                    )}
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`message-bubble ${msg.role}`}
                        >
                            <div className="bubble-content">{msg.content}</div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div
                            className="message-bubble assistant loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="loading-dots">
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {error && <div className="error-notice">{error}</div>}
            </div>

            <form onSubmit={handleSubmit} className="chat-input-area">
                <input
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder={t('assistant.placeholder')}
                    disabled={isLoading}
                />
                <button type="submit" className="btn btn-plum" disabled={isLoading || !userQuestion.trim()}>
                    {isLoading ? '...' : t('assistant.ask_btn')}
                </button>
            </form>

            <style>{`
                .research-assistant {
                    display: flex;
                    flex-direction: column;
                    height: 500px;
                    overflow: hidden;
                    border: 1px solid rgba(150, 120, 196, 0.2);
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                }

                .assistant-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    text-align: center;
                }

                .assistant-badge {
                    display: inline-block;
                    padding: 0.2rem 0.8rem;
                    background: linear-gradient(135deg, var(--color-purple), var(--color-plum));
                    color: white;
                    font-size: 0.65rem;
                    font-weight: 800;
                    border-radius: 100px;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.5rem;
                }

                .assistant-header h3 {
                    margin: 0;
                    font-size: 1.2rem;
                    color: var(--color-text-primary);
                }

                .assistant-header p {
                    font-size: 0.85rem;
                    color: var(--color-text-muted);
                    margin: 0.25rem 0 0 0;
                }

                .chat-window {
                    flex: 1;
                    padding: 1.5rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    background: rgba(0,0,0,0.02);
                }

                .empty-state {
                    margin: auto;
                    text-align: center;
                    color: var(--color-text-muted);
                    font-style: italic;
                    font-size: 0.9rem;
                    max-width: 250px;
                }

                .message-bubble {
                    max-width: 85%;
                    padding: 0.8rem 1.2rem;
                    border-radius: 1.2rem;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .message-bubble.user {
                    align-self: flex-end;
                    background: var(--color-plum);
                    color: white;
                    border-bottom-right-radius: 0.2rem;
                }

                .message-bubble.assistant {
                    align-self: flex-start;
                    background: rgba(255,255,255,0.1);
                    color: var(--color-text-primary);
                    border-bottom-left-radius: 0.2rem;
                    border: 1px solid rgba(255,255,255,0.05);
                }

                .chat-input-area {
                    padding: 1.2rem;
                    display: flex;
                    gap: 0.8rem;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }

                .chat-input-area input {
                    flex: 1;
                    background: rgba(0,0,0,0.1);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 0.8rem;
                    padding: 0.8rem 1.2rem;
                    color: white;
                    font-family: inherit;
                }

                .chat-input-area input:focus {
                    outline: none;
                    border-color: var(--color-plum);
                }

                .error-notice {
                    font-size: 0.8rem;
                    color: #ff6b6b;
                    text-align: center;
                    padding: 0.5rem;
                    background: rgba(255, 107, 107, 0.1);
                    border-radius: 0.5rem;
                }

                .loading-dots span {
                    display: inline-block;
                    animation: dash 1.4s infinite;
                    font-size: 1.5rem;
                    line-height: 0;
                }

                @keyframes dash {
                    0% { opacity: 0.2; transform: translateY(0); }
                    50% { opacity: 1; transform: translateY(-5px); }
                    100% { opacity: 0.2; transform: translateY(0); }
                }

                .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
                .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
            `}</style>
        </div>
    );
};

export default ResearchAssistant;

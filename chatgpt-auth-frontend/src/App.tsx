import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeToggle } from '@/components/theme-toggle';
import { LandingPage } from '@/components/LandingPage';
import { 
  Search, 
  Plus, 
  Send, 
  User, 
  Bot,
  Menu,
  LogOut,
  Trash2,
  Palette,
  Code,
  Zap,
  ArrowLeft
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  created_at: string;
  last_message: string;
}

interface User {
  email: string;
}

function App() {
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setShowLandingPage(false);
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      loadConversations();
    }

    (window as any).copyCode = async (buttonId: string, text: string) => {
      try {
        const cleanText = text
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/\\n/g, '\n')
          .replace(/\\`/g, '`')
          .replace(/\\\$/g, '$');
        
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(cleanText);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = cleanText;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }
        
        const button = document.getElementById(buttonId);
        if (button) {
          const icon = button.querySelector('.copy-icon');
          const text = button.querySelector('.copy-text');
          if (icon && text) {
            icon.textContent = '✅';
            text.textContent = 'Copiado!';
            button.classList.remove('bg-[#EB6625]', 'hover:bg-[#EA6323]', 'bg-orange-500', 'hover:bg-orange-600');
            button.classList.add('bg-green-500', 'hover:bg-green-600');
            
            setTimeout(() => {
              icon.textContent = '📋';
              text.textContent = 'Copiar';
              button.classList.remove('bg-green-500', 'hover:bg-green-600');
              button.classList.add('bg-[#EB6625]', 'hover:bg-[#EA6323]');
            }, 2000);
          }
        }
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [inputMessage]);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversation = async (conversationId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setCurrentConversationId(conversationId);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setAuthMode('login');
        setError('Token enviado para seu email! Verifique sua caixa de entrada.');
        if (data.debug_token) {
          setError(`Token enviado! Para desenvolvimento, use: ${data.debug_token}`);
          setToken(data.debug_token);
        }
      } else {
        setError(data.detail || 'Erro no registro');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsAuthenticated(true);
        setUser(data.user);
        loadConversations();
      } else {
        const data = await response.json();
        setError(data.detail || 'Erro no login');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || chatLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setChatLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputMessage,
          conversation_id: currentConversationId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: data.timestamp
        };
        setMessages(prev => [...prev, aiMessage]);
        setCurrentConversationId(data.conversation_id);
        loadConversations();
      } else {
        setError('Erro ao enviar mensagem');
      }
    } catch (error) {
      setError('Erro de conexão');
    } finally {
      setChatLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setMessages([]);
    setConversations([]);
    setCurrentConversationId(null);
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        if (currentConversationId === conversationId) {
          startNewChat();
        }
        loadConversations();
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };



  const addCopyButtons = (content: string, isAssistant: boolean = false) => {
    let buttonCounter = 0;
    
    content = content.replace(
      /<pre><code class="language-(\w+)">(.*?)<\/code><\/pre>/gs,
      (_match, language, code) => {
        const buttonId = `copy-code-${buttonCounter++}`;
        const decodedCode = code
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/&amp;/g, '&');
        
        return `
          <div class="relative code-block-container">
            <div class="flex justify-between items-center bg-[#1e1e1e] dark:bg-[#1e1e1e] px-4 py-2 rounded-t-lg border-b border-gray-600">
              <span class="text-sm text-gray-300 font-medium">${language}</span>
              <button 
                onclick="window.copyCode('${buttonId}', \`${decodedCode.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)"
                class="copy-button flex items-center space-x-1 px-3 py-1 bg-[#EB6625] hover:bg-[#EA6323] text-white text-xs rounded transition-colors"
                id="${buttonId}"
              >
                <span class="copy-icon">📋</span>
                <span class="copy-text">Copiar</span>
              </button>
            </div>
            <pre class="!mt-0 !rounded-t-none !bg-[#1e1e1e] dark:!bg-[#1e1e1e]"><code class="language-${language} !text-gray-100">${code}</code></pre>
          </div>
        `;
      }
    );
    
    if (isAssistant) {
      const copyButtonId = `copy-response-${buttonCounter++}`;
      const textContent = content.replace(/<[^>]*>/g, '').trim();
      
      content = `
        <div class="response-container">
          ${content}
          <div class="mt-3 flex justify-end">
            <button 
              onclick="window.copyCode('${copyButtonId}', \`${textContent.replace(/`/g, '\\`').replace(/\$/g, '\\$').replace(/\n/g, '\\n')}\`)"
              class="copy-button flex items-center space-x-1 px-3 py-1 bg-[#EB6625] hover:bg-[#EA6323] text-white text-xs rounded-lg shadow-sm transition-colors"
              id="${copyButtonId}"
            >
              <span class="copy-icon">📋</span>
              <span class="copy-text">Copiar</span>
            </button>
          </div>
        </div>
      `;
    }
    
    return content;
  };

  if (showLandingPage) {
    return <LandingPage onGetStarted={() => setShowLandingPage(false)} />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden animate-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-r from-[#EB6625]/10 via-transparent to-[#EA6323]/10 dark:from-[#EB6625]/20 dark:via-transparent dark:to-[#EA6323]/20"></div>
        
        <div className="floating-shapes">
          <div className="shape shape-1 bg-gradient-to-br from-[#EB6625]/20 to-[#EA6323]/20"></div>
          <div className="shape shape-2 bg-gradient-to-br from-[#EA6323]/15 to-[#EB6625]/15"></div>
          <div className="shape shape-3 bg-gradient-to-br from-[#EB6625]/10 to-[#EA6323]/10"></div>
          <div className="shape shape-4 bg-gradient-to-br from-[#EA6323]/25 to-[#EB6625]/25"></div>
          <div className="shape shape-5 bg-gradient-to-br from-[#EB6625]/30 to-[#EA6323]/30"></div>
        </div>

        <div className="geometric-lines">
          <div className="line line-1"></div>
          <div className="line line-2"></div>
          <div className="line line-3"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-2xl animate-text-reveal">
            <CardHeader className="text-center relative">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 left-0 text-gray-600 dark:text-gray-400 hover:text-[#EB6625] dark:hover:text-[#EB6625] hover:bg-white/50 dark:hover:bg-gray-700/50 backdrop-blur-sm transition-all duration-300 p-2"
                onClick={() => setShowLandingPage(true)}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="logo-glow absolute inset-0 bg-gradient-to-r from-[#EB6625] to-[#EA6323] rounded-lg blur-xl opacity-30 animate-pulse-slow"></div>
                  <img src="/sam-logo.png" alt="SAM AI" className="w-16 h-16 rounded-lg relative z-10 object-contain" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#EB6625] to-[#EA6323] bg-clip-text text-transparent">
                {authMode === 'register' ? 'Criar Conta' : 'Fazer Login'}
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                {authMode === 'register' 
                  ? 'Digite seu email @teddydigital.io para receber um token' 
                  : 'Digite seu email e o token recebido por email'
                }
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={authMode === 'register' ? handleRegister : handleLogin}>
                <div className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="seu.email@teddydigital.io"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50 dark:text-white focus:border-[#EB6625] focus:ring-[#EB6625]"
                    />
                  </div>
                  
                  {authMode === 'login' && (
                    <div>
                      <Input
                        type="text"
                        placeholder="Token recebido por email"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        required
                        className="h-12 font-mono bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-200/50 dark:border-gray-600/50 dark:text-white focus:border-[#EB6625] focus:ring-[#EB6625]"
                      />
                    </div>
                  )}
                  
                  {error && (
                    <div className={`text-sm p-3 rounded-lg backdrop-blur-sm ${
                      error.includes('enviado') || error.includes('desenvolvimento') 
                        ? 'text-green-700 bg-green-50/80 border border-green-200/50' 
                        : 'text-red-700 bg-red-50/80 border border-red-200/50'
                    }`}>
                      {error}
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-[#EB6625] to-[#EA6323] hover:from-[#EA6323] hover:to-[#EB6625] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
                    disabled={loading}
                  >
                    {loading ? 'Carregando...' : (authMode === 'register' ? 'Enviar Token' : 'Entrar')}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-gray-600 dark:text-gray-400 hover:text-[#EB6625] dark:hover:text-[#EB6625] hover:bg-white/50 dark:hover:bg-gray-700/50 backdrop-blur-sm transition-all duration-300"
                    onClick={() => {
                      setAuthMode(authMode === 'register' ? 'login' : 'register');
                      setError('');
                    }}
                  >
                    {authMode === 'register' ? 'Já tenho um token' : 'Preciso de um token'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Footer positioned at bottom of page */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-6">
          <div className="flex flex-col items-center justify-center animate-bounce-slow">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Desenvolvido pela Teddy Digital
            </div>
            <div className="w-6 h-6 border-2 border-[#EB6625] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-[#EB6625] text-white flex flex-col overflow-hidden border-r border-[#EA6323] transition-all duration-300`}>
        <div className="p-4">
          <Button
            onClick={startNewChat}
            className="w-full bg-white/10 hover:bg-white/20 text-white border-0 h-12 justify-start rounded-lg font-medium transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-3" />
            Novo chat
          </Button>
        </div>
        
        <div className="px-4 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-white/60" />
            <Input
              placeholder="Buscar em chats"
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 h-11 rounded-lg focus:bg-white/15 focus:border-white/30 transition-all duration-200"
            />
          </div>
        </div>

        <div className="px-4 mb-4">
          <div className="text-xs text-white/60 uppercase tracking-wider mb-2 px-2 font-semibold">Conversas Recentes</div>
        </div>
        
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`group p-3 rounded-xl cursor-pointer relative transition-all duration-200 ${
                  currentConversationId === conv.id ? 'bg-white/20 shadow-lg' : 'hover:bg-white/10'
                }`}
              >
                <div className="text-sm font-medium truncate pr-8 text-white/90">
                  {conv.last_message}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 h-7 w-7 text-white/50 hover:text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200"
                  onClick={(e) => deleteConversation(conv.id, e)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-white/10">
          <div className="p-4 space-y-1">
            <div className="flex items-center space-x-3 px-3 py-3 rounded-lg cursor-pointer text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 group">
              <Palette className="w-5 h-5 group-hover:text-white transition-colors" />
              <span className="text-sm font-medium group-hover:text-white transition-colors">Galeria</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-3 rounded-lg cursor-pointer text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 group">
              <Code className="w-5 h-5 group-hover:text-white transition-colors" />
              <span className="text-sm font-medium group-hover:text-white transition-colors">Codex</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-3 rounded-lg cursor-pointer text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 group">
              <Zap className="w-5 h-5 group-hover:text-white transition-colors" />
              <span className="text-sm font-medium group-hover:text-white transition-colors">Sora</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-3 rounded-lg cursor-pointer text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200 group">
              <Bot className="w-5 h-5 group-hover:text-white transition-colors" />
              <span className="text-sm font-medium group-hover:text-white transition-colors">GPTs</span>
            </div>
          </div>
          
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm truncate font-medium text-white/90">{user?.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 h-8 w-8 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-[#EB6625] text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-white"
            >
              <Menu className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <img src="/sam-logo.png" alt="SAM AI" className="w-20 h-20 rounded-lg object-contain" />
            </div>
          </div>
          <ThemeToggle />
        </div>

        <ScrollArea className="flex-1">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center max-w-2xl">
                <h2 className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white">O que tem na agenda de hoje?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card 
                    className="p-4 cursor-pointer border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                    onClick={() => setInputMessage("Crie um plano de estudos personalizado")}
                  >
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Criar um plano de estudos</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">personalizado para seus objetivos</div>
                  </Card>
                  <Card 
                    className="p-4 cursor-pointer border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                    onClick={() => setInputMessage("Ajude-me a escrever um email profissional")}
                  >
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Escrever um email profissional</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">com tom adequado e estrutura</div>
                  </Card>
                  <Card 
                    className="p-4 cursor-pointer border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                    onClick={() => setInputMessage("Explique um conceito complexo de forma simples")}
                  >
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Explicar um conceito complexo</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">de forma clara e didática</div>
                  </Card>
                  <Card 
                    className="p-4 cursor-pointer border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
                    onClick={() => setInputMessage("Preciso de ajuda com programação")}
                  >
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Ajudar com código</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">debug, otimização e boas práticas</div>
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-4 space-y-6">
              {messages.map((message, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    {message.role === 'user' ? (
                      <div className="w-8 h-8 bg-[#EB6625] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-[#EA6323] rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div 
                      className="prose max-w-none text-gray-800 dark:text-gray-200 leading-relaxed formatted-content"
                      dangerouslySetInnerHTML={{ __html: addCopyButtons(message.content, message.role === 'assistant') }}
                    />
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex space-x-4">
                  <div className="w-8 h-8 bg-[#EA6323] rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="text-gray-600">Digitando...</div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
            <div className="relative bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Pergunte alguma coisa"
                className="min-h-[60px] max-h-[200px] resize-none border-0 focus:ring-0 rounded-xl pr-12 py-4 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg bg-[#EB6625]"
                  disabled={!inputMessage.trim() || chatLoading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {error && (
              <div className="text-red-600 text-sm mt-2 text-center">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;

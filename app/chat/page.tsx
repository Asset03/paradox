'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input, Button, Card, Avatar, Typography, message, Space, Flex } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { Message } from '../types/chat';

const { TextArea } = Input;
const { Text } = Typography;

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Привет! Я ваш ассистент. Чем могу помочь?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const connectWebSocket = useCallback(() => {
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        return;
      }
      const websocket = new WebSocket('wss://echo.websocket.org');
      
      websocket.onopen = () => {
        setIsConnected(true);
        message.success('Подключено к WebSocket');
      };
      
      websocket.onmessage = (event) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: event.data,
          sender: 'assistant',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, newMessage]);
      };
      
      websocket.onerror = (error) => {
        console.error(error);
        message.error('Ошибка WebSocket соединения');
      };
      
      websocket.onclose = () => {
        setIsConnected(false);
        message.warning('WebSocket соединение закрыто');
      };
      
      wsRef.current = websocket;
    } catch (error) {
      console.error(error);
      message.error('Не удалось подключиться к WebSocket');
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connectWebSocket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      if (!isConnected) {
        message.warning('Нет соединения с сервером');
      }
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    wsRef.current.send(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const reconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    connectWebSocket();
  };

  return (
      <Card
        title={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RobotOutlined />
              <span>Чат с ассистентом</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-500">
                  {isConnected ? 'Подключено' : 'Не подключено'}
                </span>
              </div>
              {!isConnected && (
                <Button size="small" onClick={reconnect}>
                  Переподключиться
                </Button>
              )}
            </div>
          </div>
        }
        className="shadow-lg"
      >
        <div className="h-[500px] flex flex-col">
          <div 
            className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg"
          >
            <Space orientation="vertical" size="middle" className="w-full">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'user'
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                      }`}
                  >
                    <Flex align="center" gap="small" className="mb-1">
                      {msg.sender === 'assistant' ? (
                        <Avatar size="small" icon={<RobotOutlined />} className="bg-blue-500" />
                      ) : (
                        <Avatar size="small" icon={<UserOutlined />} className="bg-green-500" />
                      )}
                      <Text strong>
                        {msg.sender === 'assistant' ? 'Ассистент' : 'Вы'}
                      </Text>
                      <Text type="secondary" className="text-xs">
                        {msg.timestamp.toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </Flex>
                    <Text>{msg.text}</Text>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </Space>
          </div>

          <div className="border-t pt-4">
            <div className="flex gap-2">
              <TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите ваше сообщение..."
                autoSize={{ minRows: 2, maxRows: 4 }}
                className="flex-1"
                disabled={!isConnected}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={sendMessage}
                disabled={!inputValue.trim() || !isConnected}
                className="h-auto"
              >
                Отправить
              </Button>
            </div>
          </div>
        </div>
      </Card>
  );
};

export default ChatPage;
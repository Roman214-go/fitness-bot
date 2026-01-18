import React, { useEffect, useRef, useState } from 'react';
import { BsCheck2 } from 'react-icons/bs';
import { BsCheck2All } from 'react-icons/bs';

import styles from './ChatPage.module.scss';

// Типы данных
interface Message {
  id: string;
  text?: string;
  image?: string;
  sender: 'user' | 'other';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

export const ChatPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Integer eget tellus ultricies, feugiat mi vitae, viverra neque.',
      sender: 'other',
      timestamp: new Date(),
    },
    {
      id: '2',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      sender: 'other',
      timestamp: new Date(),
    },
    {
      id: '3',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      sender: 'user',
      timestamp: new Date(),
      status: 'read',
    },
    {
      id: '4',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nulla mauris, pharetra et nibh, consectetur fringilla ligula.',
      sender: 'other',
      timestamp: new Date(),
    },
    {
      id: '5',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec molestie, lacus eu lacinia interdum.',
      sender: 'other',
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    const newMessage: Message = {
      id: Date.now().toString(),
      image: imageUrl,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => [...prev, newMessage]);

    // чтобы можно было загрузить то же изображение повторно
    e.target.value = '';
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages]);

  return (
    <div className={styles.chat_container}>
      <div className={styles.header}>Чат</div>

      <div className={styles.messages_container}>
        {messages.map(msg => (
          <div key={msg.id} className={`${styles.message_wrapper} ${msg.sender === 'user' ? styles.user : ''}`}>
            {msg.sender === 'other' && <div className={styles.avatar} />}

            <div className={`${styles.message} ${msg.sender === 'user' ? styles.user : styles.other}`}>
              {msg.text && <span>{msg.text}</span>}

              {msg.image && <img src={msg.image} alt='uploaded' className={styles.message_image} />}

              {msg.sender === 'user' && msg.status && (
                <span className={`${styles.message_status} ${msg.status === 'read' ? styles.read : styles.sent}`}>
                  {msg.status === 'read' ? <BsCheck2All fontSize={16} /> : <BsCheck2 fontSize={16} />}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.input_container}>
        <button className={styles.add_button} onClick={() => fileInputRef.current?.click()}>
          +
        </button>

        <input ref={fileInputRef} type='file' accept='image/*' hidden onChange={handleAddImage} />
        <input
          type='text'
          placeholder='Сообщение'
          className={styles.input}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <button className={styles.send_button} onClick={handleSendMessage}>
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
            <path
              d='M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

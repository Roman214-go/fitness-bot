import React, { useEffect, useRef, useState } from 'react';
import { BsX } from 'react-icons/bs';
import styles from './ChatPage.module.scss';
import { useAppSelector } from '../../common/store/hooks';
import { process } from '../../common/constants/process';

interface Message {
  id: string;
  text?: string;
  image?: string;
  sender: 'user' | 'other';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

export const ChatPage: React.FC = () => {
  const { userData } = useAppSelector(state => state.auth);
  const [loading, setLoading] = useState(true);

  const currentUser = {
    telegram_id: userData?.telegram_id,
    first_name: 'Test User',
    username: null,
    last_name: null,
    photo_url: null,
    language_code: 'ru',
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [myUserId, setMyUserId] = useState<number | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);

  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const loadHistory = async (chatId: string, userId: number) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_EMPTY_URL}/api/v1/realtime-chat/${chatId}/messages`, {
        headers: {
          'X-Telegram-Auth': JSON.stringify(currentUser),
        },
      });

      if (!res.ok) {
        console.error('Ошибка загрузки истории');
        return;
      }

      const data = await res.json();

      const mapped: Message[] = data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((m: { sender_id: number; id: any; content: any; photo_url: any; created_at: string | number | Date }) => {
          const isOwn = m.sender_id === userId;

          return {
            id: String(m.id),
            text: m.content ?? undefined,
            image: m.photo_url ? `${process.env.REACT_APP_BASE_EMPTY_URL}${m.photo_url}` : undefined,
            sender: isOwn ? 'user' : 'other',
            timestamp: new Date(m.created_at),
            status: 'read',
          };
        })
        .sort(
          (a: { timestamp: { getTime: () => number } }, b: { timestamp: { getTime: () => number } }) =>
            a.timestamp.getTime() - b.timestamp.getTime(),
        );

      setMessages(mapped);
      setLoading(false);
    } catch (e) {
      console.error('loadHistory error', e);
      setLoading(false);
    }
  };

  /* =======================
     Инициализация чата
  ======================= */
  useEffect(() => {
    // if (!userData?.subscription) return;
    const initChat = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_EMPTY_URL}/api/v1/realtime-chat/my`, {
          headers: {
            'X-Telegram-Auth': JSON.stringify(currentUser),
          },
        });

        if (!res.ok) {
          console.error('Ошибка получения чата');
          return;
        }

        const chat = await res.json();
        setChatId(chat.id);
        setMyUserId(chat.user_id);

        await loadHistory(chat.id, chat.user_id);
        setLoading(false);
      } catch (e) {
        console.error('initChat error', e);
        setLoading(false);
      }
    };

    initChat();
  }, []);

  /* =======================
     SSE подключение
  ======================= */
  useEffect(() => {
    if (!chatId || !userData?.subscription) return;

    const token = encodeURIComponent(JSON.stringify(currentUser));
    const es = new EventSource(
      `${process.env.REACT_APP_BASE_EMPTY_URL}/api/v1/realtime-chat/${chatId}/stream?token=${token}`,
    );

    eventSourceRef.current = es;

    es.onmessage = event => {
      try {
        let raw = event.data;

        if (raw.startsWith('data: ')) {
          raw = raw.slice(6);
        }

        const data = JSON.parse(raw);

        if (data.type === 'new_message') {
          const m = data.message;

          const isOwn = m.sender.id === myUserId;

          setMessages(prev => {
            const exists = prev.some(msg => msg.id === String(m.id));
            if (exists) return prev;

            return [
              ...prev,
              {
                id: String(m.id),
                text: m.content ?? undefined,
                image: m.photo_url ? `${process.env.REACT_APP_BASE_EMPTY_URL}${m.photo_url}` : undefined,
                sender: isOwn ? 'user' : 'other',
                timestamp: new Date(m.created_at),
                status: isOwn ? 'delivered' : undefined,
              },
            ];
          });
        }
      } catch (e) {
        console.error('SSE parse error:', e, event.data);
      }
    };

    es.onerror = () => {
      console.error('SSE disconnected');
    };

    return () => {
      es.close();
    };
  }, [chatId]);

  /* =======================
     Автоскролл
  ======================= */
  const firstLoadRef = useRef(true);

  useEffect(() => {
    if (!messagesEndRef.current || messages.length === 0) return;

    if (firstLoadRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ block: 'end' });
        firstLoadRef.current = false;
      }, 0);
      return;
    }

    messagesEndRef.current.scrollIntoView({ block: 'end' });
  }, [messages]);

  /* =======================
     Отправка текста
  ======================= */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatId) return;

    const text = inputValue;
    setInputValue('');

    try {
      await fetch(`${process.env.REACT_APP_BASE_EMPTY_URL}/api/v1/realtime-chat/${chatId}/send/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Auth': JSON.stringify(currentUser),
        },
        body: JSON.stringify({ content: text }),
      });
    } catch (e) {
      console.error('sendMessage error', e);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /* =======================
     Загрузка и отправка изображения
  ======================= */
  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatId) return;

    const imageUrl = URL.createObjectURL(file);
    const tempId = Date.now().toString();

    setMessages(prev => [
      ...prev,
      {
        id: tempId,
        image: imageUrl,
        sender: 'user',
        timestamp: new Date(),
        status: 'sent',
      },
    ]);

    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('content', '');

      const res = await fetch(`${process.env.REACT_APP_BASE_EMPTY_URL}/api/v1/realtime-chat/${chatId}/send/photo`, {
        method: 'POST',
        headers: {
          'X-Telegram-Auth': JSON.stringify(currentUser),
        },
        body: formData,
      });

      if (!res.ok) {
        console.error('Ошибка отправки фото');
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
      } else {
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
      }
    } catch (e) {
      console.error('handleAddImage error', e);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }

    e.target.value = '';
  };

  /* =======================
     Открытие фото в полном размере
  ======================= */
  const handleImageClick = (imageUrl: string) => {
    setFullscreenImage(imageUrl);
  };

  const closeFullscreenImage = () => {
    setFullscreenImage(null);
  };

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = () => {
      if (fullscreenImage) {
        closeFullscreenImage();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [fullscreenImage]);

  /* =======================
     JSX
  ======================= */
  if (loading) {
    return (
      <div className={styles.chat_container}>
        <div className={styles.header}>Чат</div>
        <div className={styles.loading}>Загрузка пользователя...</div>
      </div>
    );
  }

  return (
    <div className={styles.chat_container}>
      <div className={styles.header}>Чат</div>

      <div className={styles.messages_container}>
        {messages.map(msg => (
          <div key={msg.id} className={`${styles.message_wrapper} ${msg.sender === 'user' ? styles.user : ''}`}>
            {msg.sender === 'other' && <div className={styles.avatar} />}

            <div className={`${styles.message} ${msg.sender === 'user' ? styles.user : styles.other}`}>
              {msg.text ? <span>{msg.text}</span> : null}

              {msg.image ? (
                <img
                  src={msg.image}
                  alt='uploaded'
                  className={styles.message_image}
                  onClick={() => handleImageClick(msg.image!)}
                  style={{ cursor: 'pointer' }}
                />
              ) : null}
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

      {/* Модальное окно для просмотра фото */}
      {fullscreenImage && (
        <div className={styles.fullscreen_overlay} onClick={closeFullscreenImage}>
          <button className={styles.close_button} onClick={closeFullscreenImage}>
            <BsX size={32} />
          </button>
          <img
            src={fullscreenImage}
            alt='fullscreen'
            className={styles.fullscreen_image}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { BsX } from 'react-icons/bs';
import styles from './ChatPage.module.scss';
import { useAppSelector } from '../../common/store/hooks';
import { process } from '../../common/constants/process';
import heic2any from 'heic2any';

interface Message {
  id: string;
  text?: string;
  image?: string;
  sender: 'user' | 'other';
  sender_id?: number;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

interface Chat {
  id: number;
  user_id: number;
  title: string;
  last_message_content?: string;
  last_message_at?: string;
  unread_count?: number;
}

const convertToJpeg = (file: File): Promise<File> => {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = e => {
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            // Если canvas не работает, возвращаем оригинальный файл
            resolve(file);
            return;
          }

          // Ограничиваем максимальный размер изображения (меньше для уменьшения размера файла)
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          let width = img.width;
          let height = img.height;

          // Масштабируем если слишком большое
          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          // Рисуем изображение
          ctx.drawImage(img, 0, 0, width, height);

          // Конвертируем canvas в blob с более низким качеством
          canvas.toBlob(
            blob => {
              if (blob) {
                // Проверяем размер файла
                const maxSize = 2 * 1024 * 1024; // 2MB

                if (blob.size > maxSize) {
                  // Если файл все еще большой, пробуем еще больше сжать
                  canvas.toBlob(
                    secondBlob => {
                      if (secondBlob) {
                        const newFile = new File([secondBlob], 'photo.jpg', {
                          type: 'image/jpeg',
                          lastModified: Date.now(),
                        });
                        resolve(newFile);
                      } else {
                        resolve(file);
                      }
                    },
                    'image/jpeg',
                    0.6, // Еще меньше качество
                  );
                } else {
                  const newFile = new File([blob], 'photo.jpg', {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                  });
                  resolve(newFile);
                }
              } else {
                // Если не удалось создать blob, возвращаем оригинал
                resolve(file);
              }
            },
            'image/jpeg',
            0.75, // Снижаем качество для уменьшения размера
          );
        } catch (error) {
          // При любой ошибке возвращаем оригинальный файл
          console.warn('Canvas processing failed, using original file:', error);
          resolve(file);
        }
      };

      img.onerror = () => {
        // Если изображение не загрузилось, возвращаем оригинал
        console.warn('Image loading failed, using original file');
        resolve(file);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      // Если FileReader не сработал, возвращаем оригинал
      console.warn('FileReader failed, using original file');
      resolve(file);
    };

    reader.readAsDataURL(file);
  });
};

export const AdminChatPage: React.FC = () => {
  const { userData } = useAppSelector(state => state.auth);
  const [loading, setLoading] = useState(true);
  const [loadingChats, setLoadingChats] = useState(false);
  const [chatsPage, setChatsPage] = useState(1);
  const [chatsPerPage] = useState(20);
  const [hasMoreChats, setHasMoreChats] = useState(true);

  const currentUser = {
    telegram_id: userData?.telegram_id,
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Состояние для списка чатов
  const [chatsList, setChatsList] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  // Состояние для текущего чата
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  /* =======================
     Загрузка списка чатов
  ======================= */
  const loadChats = async (page = 1) => {
    if (!hasMoreChats && page !== 1) return;

    setLoadingChats(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_EMPTY_URL}/api/v1/realtime-chat/list?page=${page}&per_page=${chatsPerPage}`,
        {
          headers: {
            'X-Telegram-Auth': JSON.stringify(currentUser),
          },
        },
      );

      if (!res.ok) {
        console.error('Ошибка загрузки чатов');
        return;
      }

      const data = await res.json();

      if (page === 1) {
        setChatsList(data.chats || []);
      } else {
        setChatsList(prev => [...prev, ...(data.chats || [])]);
      }

      setHasMoreChats(data.chats?.length === chatsPerPage); // если меньше чем per_page, значит больше нет
      setChatsPage(page);
    } catch (e) {
      console.error('loadChats error', e);
    } finally {
      setLoadingChats(false);
    }
  };

  const handleRefreshChats = () => {
    setChatsPage(1);
    setHasMoreChats(true);
    loadChats(1);
  };

  /* =======================
     Загрузка истории сообщений
  ======================= */
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
          const isOwn = m.sender_id !== userId;

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
    } catch (e) {
      console.error('loadHistory error', e);
    }
  };

  /* =======================
     Выбор чата
  ======================= */
  const handleSelectChat = async (chat: Chat) => {
    // Закрываем предыдущее SSE соединение
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }

    setSelectedChat(chat);
    setChatId(String(chat.id));
    setMessages([]);

    // Загружаем историю
    await loadHistory(String(chat.id), chat.user_id);

    // Подключаемся к SSE
    connectToChat(String(chat.id));
  };

  /* =======================
     SSE подключение
  ======================= */
  const connectToChat = (chatId: string) => {
    const token = encodeURIComponent(JSON.stringify(currentUser));
    const es = new EventSource(
      `${process.env.REACT_APP_BASE_EMPTY_URL}/api/v1/realtime-chat/${chatId}/stream?token=${token}`,
    );

    eventSourceRef.current = es;

    es.onopen = () => {
      setIsConnected(true);
    };

    es.onmessage = event => {
      try {
        let raw = event.data;

        if (raw.startsWith('data: ')) {
          raw = raw.slice(6);
        }

        const data = JSON.parse(raw);

        if (data.type === 'new_message') {
          const m = data.message;

          const isOwn = m.sender?.telegram_id === currentUser.telegram_id;

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
                sender_id: m.sender_id,
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
      setIsConnected(false);
    };
  };

  /* =======================
     Инициализация
  ======================= */
  useEffect(() => {
    loadChats();
    setLoading(false);
  }, []);

  /* =======================
     Cleanup при размонтировании
  ======================= */
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  /* =======================
     Автоскролл
  ======================= */
  const firstLoadRef = useRef(true);

  useEffect(() => {
    if (!messagesEndRef.current || messages.length === 0) return;

    if (firstLoadRef.current && selectedChat) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ block: 'end' });
        firstLoadRef.current = false;
      }, 0);
      return;
    }

    messagesEndRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
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
    let file = e.target.files?.[0];
    if (!file || !chatId) return;

    if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.7, // Снижаем качество для уменьшения размера
        });

        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        file = new File([blob], 'photo.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
      } catch (heicError) {
        console.warn('HEIC conversion failed:', heicError);
        // Продолжаем с оригинальным файлом
      }
    }

    // Конвертация/оптимизация изображения
    const processedFile = await convertToJpeg(file);

    // Создаем preview URL для отображения
    const previewUrl = URL.createObjectURL(processedFile);
    const tempId = Date.now().toString();

    setMessages(prev => [
      ...prev,
      {
        id: tempId,
        image: previewUrl,
        sender: 'user',
        timestamp: new Date(),
        status: 'sent',
      },
    ]);

    try {
      const formData = new FormData();
      formData.append('photo', processedFile, processedFile.name);
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
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenImage) {
        closeFullscreenImage();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [fullscreenImage]);

  /* =======================
     Закрыть чат
  ======================= */
  const handleCloseChat = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setSelectedChat(null);
    setChatId(null);
    setMessages([]);
    setIsConnected(false);
    firstLoadRef.current = true;
  };

  /* =======================
     JSX
  ======================= */
  if (loading) {
    return (
      <div className={styles.chat_container}>
        <div className={styles.header}>Админ чат</div>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.admin_chat_wrapper}>
      {/* Боковая панель со списком чатов */}
      <div className={styles.chats_sidebar}>
        <div className={styles.sidebar_header}>
          <h3>Чаты пользователей</h3>
          <button className={styles.refresh_button} onClick={handleRefreshChats} disabled={loadingChats}>
            {loadingChats ? '⟳' : '↻'}
          </button>
        </div>

        <div className={styles.chats_list}>
          {chatsList.length === 0 ? (
            <div className={styles.no_chats}>Нет активных чатов</div>
          ) : (
            chatsList.map(chat => (
              <div
                key={chat.id}
                className={`${styles.chat_item} ${selectedChat?.id === chat.id ? styles.active : ''}`}
                onClick={() => handleSelectChat(chat)}
              >
                <div className={styles.chat_title}>{chat.title}</div>
                <div className={styles.chat_info}>
                  <small>
                    ID: {chat.id} • User: {chat.user_id}
                  </small>
                </div>
                {chat.last_message_content && <div className={styles.chat_preview}>{chat.last_message_content}</div>}
                {chat.unread_count && chat.unread_count > 0 && (
                  <div className={styles.unread_badge}>{chat.unread_count}</div>
                )}
              </div>
            ))
          )}
          {hasMoreChats && (
            <button
              className={styles.load_more_button}
              onClick={() => loadChats(chatsPage + 1)}
              disabled={loadingChats}
            >
              {loadingChats ? '⟳' : 'Загрузить ещё'}
            </button>
          )}
        </div>
      </div>

      {/* Основная область чата */}
      <div className={styles.chat_main}>
        {!selectedChat ? (
          <div className={styles.no_chat_selected}>
            <div className={styles.placeholder_icon}>💬</div>
            <p>Выберите чат из списка</p>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <div className={styles.header_content}>
                <div>
                  <span>{selectedChat.title}</span>
                  <div className={styles.connection_status}>
                    <span className={`${styles.status_indicator} ${isConnected ? styles.connected : ''}`} />
                    {isConnected ? 'Подключен' : 'Не подключен'}
                  </div>
                </div>
                <button className={styles.close_chat_button} onClick={handleCloseChat}>
                  ✕
                </button>
              </div>
            </div>

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
                placeholder='Ответ пользователю...'
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
          </>
        )}
      </div>

      {/* Модальное окно для просмотра фото */}
      {fullscreenImage && (
        <div className={styles.fullscreen_overlay} onClick={closeFullscreenImage}>
          <div className={styles.imageModal}>
            <img
              src={fullscreenImage}
              alt='fullscreen'
              className={styles.fullscreen_image}
              onClick={e => e.stopPropagation()}
            />
            <button className={styles.close_button} onClick={closeFullscreenImage}>
              <BsX size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

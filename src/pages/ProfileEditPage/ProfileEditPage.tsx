import React, { useEffect, useRef, useState } from 'react';
import styles from './ProfileEditPage.module.scss';
import { useNavigate } from 'react-router-dom';
import { MdArrowBackIos } from 'react-icons/md';
import { MdAddAPhoto } from 'react-icons/md';
import { axiosInstance } from '../../common/utils/axiosInstance';
import Button from '../../common/components/Button';
import { useAppDispatch, useAppSelector } from '../../common/store/hooks';
import { setUserData } from '../../common/auth/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { process } from '../../common/constants/process';
import heic2any from 'heic2any';

const validationSchema = Yup.object({
  age: Yup.number()
    .typeError('Введите число')
    .required('Обязательно')
    .min(10, 'Минимум 10 лет')
    .max(100, 'Максимум 100 лет'),

  height: Yup.number()
    .typeError('Введите число')
    .required('Обязательно')
    .min(100, 'Минимум 100 см')
    .max(230, 'Максимум 230 см'),

  weight: Yup.number()
    .typeError('Введите число')
    .required('Обязательно')
    .min(30, 'Минимум 30 кг')
    .max(250, 'Максимум 250 кг'),
});

// Функция для конвертации изображения в JPEG через canvas (сжатие и стандартизация)
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

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const goalOptions = [
    { value: 'muscle_gain', label: 'Набор мышечной массы' },
    { value: 'maintain_form', label: 'Поддержание формы' },
    { value: 'weight_loss', label: 'Похудение' },
  ];

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0];
    if (!file || !userData?.telegram_id) {
      return;
    }

    setIsUploading(true);

    try {
      // Обработка HEIC формата
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

      // Очищаем старый preview
      if (photoUrl && photoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoUrl);
      }

      // Показываем preview
      setPhotoUrl(previewUrl);

      // Отправляем на сервер
      const formData = new FormData();
      formData.append('photo', processedFile, processedFile.name);

      await axiosInstance.put('profile/me/photo', formData, {
        headers: {
          'X-Telegram-Auth': JSON.stringify({
            telegram_id: userData.telegram_id,
          }),
        },
      });

      // Получаем обновленные данные пользователя
      const res = await axiosInstance.get(`/users/telegram/${userData.telegram_id}`, {
        params: { include_relations: true },
      });

      dispatch(setUserData(res.data));

      // Очищаем preview blob и устанавливаем URL с сервера
      URL.revokeObjectURL(previewUrl);

      // Добавляем timestamp чтобы избежать кеширования
      const serverPhotoUrl = `${process.env.REACT_APP_BASE_EMPTY_URL}/static/${res.data.photo_url}?t=${Date.now()}`;
      setPhotoUrl(serverPhotoUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Photo upload error:', err);

      // Очищаем preview в случае ошибки
      if (photoUrl && photoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoUrl);
      }

      // Возвращаемся к старому фото
      if (userData?.photo_url) {
        setPhotoUrl(`${process.env.REACT_APP_BASE_EMPTY_URL}/static/${userData.photo_url}`);
      } else {
        setPhotoUrl(null);
      }

      // Показываем пользователю более понятное сообщение об ошибке
      const errorMsg = err.response?.data?.message || err.message;
      if (errorMsg) {
        alert(`Ошибка: ${errorMsg}`);
      } else {
        alert('Не удалось загрузить фото. Проверьте подключение к интернету.');
      }
    } finally {
      setIsUploading(false);
      // Сбрасываем input для возможности загрузить то же фото снова
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    // Устанавливаем начальное фото
    if (userData?.photo_url && !photoUrl) {
      setPhotoUrl(`${process.env.REACT_APP_BASE_EMPTY_URL}/static/${userData.photo_url}`);
    }
  }, [userData?.photo_url]);

  useEffect(() => {
    // Cleanup function для очистки blob URLs
    return () => {
      if (photoUrl && photoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <MdArrowBackIos />
        </button>
        <button className={styles.uploadAvatar} onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          {isUploading ? '...' : <MdAddAPhoto />}
        </button>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*,image/heic,image/heif'
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
        {(photoUrl || userData?.photo_url) && (
          <img
            src={photoUrl || `${process.env.REACT_APP_BASE_EMPTY_URL}/static/${userData?.photo_url}`}
            alt='Profile'
            style={{ opacity: isUploading ? 0.5 : 1 }}
          />
        )}
      </div>

      <Formik
        enableReinitialize
        initialValues={{
          age: userData?.anthropometric_data?.age || '',
          height: userData?.anthropometric_data?.height || '',
          weight: userData?.anthropometric_data?.weight || '',
          goal: userData?.fitness_goals?.goal || '',
        }}
        validationSchema={validationSchema}
        onSubmit={async values => {
          try {
            if (
              values.age !== userData?.anthropometric_data.age ||
              values.height !== userData?.anthropometric_data.height ||
              values.weight !== userData?.anthropometric_data.weight
            ) {
              await axiosInstance.put(
                'profile/me/anthropometric',
                {
                  age: Number(values.age),
                  height: Number(values.height),
                  weight: Number(values.weight),
                  goal: values.goal,
                },
                {
                  headers: {
                    'X-Telegram-Auth': JSON.stringify({ telegram_id: userData?.telegram_id }),
                  },
                },
              );
            }

            if (userData?.fitness_goals.goal !== values.goal) {
              await axiosInstance.put(
                'profile/me/fitness-goals',
                {
                  goal: values.goal,
                },
                {
                  headers: {
                    'X-Telegram-Auth': JSON.stringify({ telegram_id: userData?.telegram_id }),
                  },
                },
              );
              await axiosInstance.get('profile/me/nutrition/calculate', {
                headers: {
                  'X-Telegram-Auth': JSON.stringify({ telegram_id: userData?.telegram_id }),
                },
              });
            }

            const res = await axiosInstance.get(`/users/telegram/${userData?.telegram_id}`, {
              params: { include_relations: true },
            });

            dispatch(setUserData(res.data));

            navigate(-1);
          } catch (e) {
            console.error(e);
          }
        }}
      >
        {({ isValid, isSubmitting }) => (
          <Form className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Возраст</label>

              <Field name='age' type='number' className={styles.input} min={10} max={100} />

              <ErrorMessage name='age' component='span' className={styles.error} />
            </div>

            <div className={styles.inputGroup}>
              <label>Вес (кг)</label>

              <Field name='weight' type='number' className={styles.input} min={30} max={250} />

              <ErrorMessage name='weight' component='span' className={styles.error} />
            </div>
            <div className={styles.inputGroup}>
              <label>Рост (см)</label>

              <Field name='height' type='number' className={styles.input} min={100} max={230} />

              <ErrorMessage name='height' component='span' className={styles.error} />
            </div>
            <div className={styles.inputGroup}>
              <label>Цель тренировок</label>

              <Field as='select' name='goal' className={styles.input}>
                {goalOptions.map(goal => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
              </Field>
            </div>
            <Button type='submit' disabled={!isValid || isSubmitting}>
              Сохранить
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileEditPage;

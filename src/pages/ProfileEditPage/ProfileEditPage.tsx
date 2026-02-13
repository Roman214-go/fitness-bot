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

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { userData } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const goalOptions = [
    { value: 'muscle_gain', label: 'Набор мышечной массы' },
    { value: 'maintain_form', label: 'Поддержание формы' },
    { value: 'weight_loss', label: 'Похудение' },
  ];

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('photo', file);

      await axiosInstance.put('profile/me/photo', formData, {
        headers: {
          'X-Telegram-Auth': JSON.stringify({
            telegram_id: userData?.telegram_id,
          }),
          'Content-Type': 'multipart/form-data',
        },
      });

      const res = await axiosInstance.get(`/users/telegram/${userData?.telegram_id}`, {
        params: { include_relations: true },
      });

      dispatch(setUserData(res.data));

      setPhotoUrl(`${process.env.REACT_APP_BASE_EMPTY_URL}/static/${res.data.photo_url}`);
    } catch (e) {
      console.error('Ошибка загрузки фото:', e);
      setPhotoUrl(null);
    }
  };

  useEffect(() => {
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
        <button className={styles.uploadAvatar} onClick={() => fileInputRef.current?.click()}>
          <MdAddAPhoto />
        </button>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
        {userData?.photo_url ? (
          <img
            src={
              photoUrl ||
              `${process.env.REACT_APP_BASE_EMPTY_URL}/static/${userData?.photo_url}` ||
              'https://i.pravatar.cc/150?img=8'
            }
          />
        ) : null}
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

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './MainFormPage.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/components/Button';
import { postPhysicalData } from './api/postPhysicalData';
import { setUserData } from '../../common/auth/authSlice';
import { axiosInstance } from '../../common/utils/axiosInstance';
import { useAppDispatch, useAppSelector } from '../../common/store/hooks';
import { useEffect, useState } from 'react';
import { PrivacyModal } from '../PrivacyModal/PrivacyModal';
import front from '../../assets/bodyPhotos/front.jpg';
import back from '../../assets/bodyPhotos/back.jpg';
import incline from '../../assets/bodyPhotos/incline.jpg';
import side from '../../assets/bodyPhotos/side.jpg';
import heic2any from 'heic2any';

export type Gender = 'M' | 'F';

export type DailyStepsLevel = 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'ACTIVE' | 'VERY_ACTIVE';

export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export type Goal = 'weight_loss' | 'muscle_gain' | 'maintain_form' | 'posture_correction' | 'back_pain_relief';

export type WorkoutFormat = 'home' | 'gym';

type PhotoKey = keyof MainFormValues['photos'];

export interface MainFormValues {
  height: string | number;
  weight: string | number;
  age: string | number;

  gender: Gender | '';

  daily_steps_level: DailyStepsLevel | '';
  experience_level: ExperienceLevel | '';
  goal: Goal | '';
  healthy_goal: string[];
  workout_format: WorkoutFormat | '';

  workouts_per_week: string;

  photos: {
    front_photo: File | null;
    back_photo: File | null;
    left_front_photo: File | null;
    left_incline_photo: File | null;
  };
  agreePrivacy: boolean;
}

const FILE_SIZE = 5 * 1024 * 1024;
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

const photoValidation = Yup.mixed<File>()
  .required('Фото обязательно')
  .test('fileSize', 'Размер файла не более 5MB', file => !file || file.size <= FILE_SIZE)
  .test('fileFormat', 'Поддерживаются только JPG, PNG, WEBP', file => !file || SUPPORTED_FORMATS.includes(file.type));

// eslint-disable-next-line react-refresh/only-export-components
export const goalsArray = [
  {
    value: 'weight_loss',
    title: 'Похудение',
  },
  {
    value: 'muscle_gain',
    title: 'Набор мышечной массы',
  },
  {
    value: 'maintain_form',
    title: 'Поддержание формы',
  },
];

export const MainFormPage = () => {
  const navigate = useNavigate();
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const { userData } = useAppSelector(state => state.auth);

  const dispatch = useAppDispatch();
  const [photoPreviews, setPhotoPreviews] = useState<Record<PhotoKey, string | null>>({
    front_photo: null,
    back_photo: null,
    left_front_photo: null,
    left_incline_photo: null,
  });

  const photosConfig: {
    key: PhotoKey;
    label: string;
    code: React.ReactNode;
  }[] = [
    { key: 'front_photo', label: 'спереди', code: <img className={styles.photoPreview} src={front} /> },
    { key: 'back_photo', label: 'сзади', code: <img className={styles.photoPreview} src={back} /> },
    { key: 'left_front_photo', label: 'левый бок', code: <img className={styles.photoPreview} src={side} /> },
    {
      key: 'left_incline_photo',
      label: 'левый бок в наклоне',
      code: <img className={styles.photoPreview} src={incline} />,
    },
  ];

  const initialValues: MainFormValues = {
    gender: '',
    height: '',
    weight: '',
    age: '',
    goal: '',
    healthy_goal: [],
    workout_format: '',
    workouts_per_week: '',
    experience_level: '',
    daily_steps_level: '',
    agreePrivacy: false,

    photos: {
      front_photo: null,
      back_photo: null,
      left_incline_photo: null,
      left_front_photo: null,
    },
  };

  const validationSchema = Yup.object({
    gender: Yup.string().required('Выберите пол'),
    height: Yup.string()
      .required('Введите рост')
      .matches(/^\d+$/, 'Рост должен содержать только цифры')
      .test('min', 'Рост должен быть больше 100 см', val => !val || parseInt(val) >= 100)
      .test('max', 'Рост должен быть меньше 250 см', val => !val || parseInt(val) <= 250),
    weight: Yup.string()
      .required('Введите вес')
      .matches(/^\d+$/, 'Вес должен содержать только цифры')
      .test('min', 'Вес должен быть больше 30 кг', val => !val || parseInt(val) >= 30)
      .test('max', 'Вес должен быть меньше 300 кг', val => !val || parseInt(val) <= 300),
    age: Yup.string()
      .required('Введите возраст')
      .matches(/^\d+$/, 'Возраст должен содержать только цифры')
      .test('min', 'Возраст должен быть больше 14 лет', val => !val || parseInt(val) >= 14)
      .test('max', 'Возраст должен быть меньше 100 лет', val => !val || parseInt(val) <= 100),
    goal: Yup.string().required('Выберите цель тренировок'),
    workout_format: Yup.string().required('Выберите формат тренировок'),
    workouts_per_week: Yup.string().required('Выберите количество тренировок'),
    experience_level: Yup.string().required('Выберите опыт тренировок'),
    daily_steps_level: Yup.string().required('Выберите уровень активности'),
    agreePrivacy: Yup.boolean().oneOf([true], 'Необходимо принять политику конфиденциальности').required(),
    photos: Yup.object({
      front_photo: photoValidation,
      back_photo: photoValidation,
      left_front_photo: photoValidation,
      left_incline_photo: photoValidation,
    }),
  });

  useEffect(() => {
    return () => {
      Object.values(photoPreviews).forEach(url => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [photoPreviews]);

  const handleSubmit = async (values: MainFormValues) => {
    if (userData?.telegram_id) {
      await postPhysicalData(values, userData?.telegram_id);
    }

    const res = await axiosInstance.get(`/users/telegram/${userData?.telegram_id}`, {
      params: { include_relations: true },
    });

    dispatch(setUserData(res.data));

    navigate('/anamnesis-form');
  };

  const handlePhotoUpload = async (
    photoType: keyof MainFormValues['photos'],
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void,
    setFieldError: (field: string, message: string) => void,
  ) => {
    let file = event.target.files?.[0];
    if (!file) return;

    try {
      // 🔹 HEIC → JPEG (iPhone)
      if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.9,
        });

        // heic2any может вернуть массив или один blob
        const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
        file = new File([blob], 'photo.jpg', {
          type: 'image/jpeg',
        });
      }

      if (file.size > 10 * 1024 * 1024) {
        setFieldError(`photos.${photoType}`, 'Размер файла не более 10MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setFieldError(`photos.${photoType}`, 'Можно загружать только изображения');
        return;
      }

      // Освобождаем старый preview если он есть
      const oldPreview = photoPreviews[photoType];
      if (oldPreview && oldPreview.startsWith('blob:')) {
        URL.revokeObjectURL(oldPreview);
      }

      const previewUrl = URL.createObjectURL(file);

      setPhotoPreviews(prev => ({
        ...prev,
        [photoType]: previewUrl,
      }));

      setFieldValue(`photos.${photoType}`, file);
    } catch (e) {
      console.error('Ошибка обработки фото:', e);
      setFieldError(`photos.${photoType}`, 'Не удалось обработать фото');
    }
  };

  const getPhotoPreview = (photoKey: PhotoKey): string | null => {
    return photoPreviews[photoKey];
  };

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ setFieldValue, setFieldError, errors, touched }) => (
          <Form className={styles.trainingForm}>
            {/* Пол */}
            <div className={`${styles.formSection} ${errors.gender && touched.gender ? styles.hasError : ''}`}>
              <label className={styles.formLabel}>Пол</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='gender' value='M' />
                  <span>Мужской</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='gender' value='F' />
                  <span>Женский</span>
                </label>
              </div>
              <ErrorMessage name='gender' component='div' className={styles.error} />
            </div>

            {/* Рост */}
            <div className={`${styles.formSection} ${errors.height && touched.height ? styles.hasError : ''}`}>
              <label className={styles.formLabel}>Рост (см)</label>
              <Field
                type='text'
                name='height'
                placeholder='180'
                className={`${styles.inputField} ${errors.height && touched.height ? styles.hasError : ''}`}
              />
              <ErrorMessage name='height' component='div' className={styles.error} />
            </div>

            {/* Масса тела */}
            <div className={`${styles.formSection} ${errors.weight && touched.weight ? styles.hasError : ''}`}>
              <label className={styles.formLabel}>Масса тела (кг)</label>
              <Field
                type='text'
                name='weight'
                placeholder='70'
                className={`${styles.inputField} ${errors.weight && touched.weight ? styles.hasError : ''}`}
              />
              <ErrorMessage name='weight' component='div' className={styles.error} />
            </div>

            {/* Возраст */}
            <div className={`${styles.formSection} ${errors.age && touched.age ? styles.hasError : ''}`}>
              <label className={styles.formLabel}>Возраст (лет)</label>
              <Field
                type='text'
                name='age'
                placeholder='25'
                className={`${styles.inputField} ${errors.age && touched.age ? styles.hasError : ''}`}
              />
              <ErrorMessage name='age' component='div' className={styles.error} />
            </div>

            {/* Цель тренировок */}
            <div className={`${styles.formSection} ${errors.goal && touched.goal ? styles.hasError : ''}`}>
              <label className={styles.formLabel}>Цель тренировок</label>
              <div className={styles.radioGroup}>
                {goalsArray.map((item, index) => (
                  <label key={index} className={styles.radioLabel}>
                    <Field type='radio' name='goal' value={item.value} />
                    <span>{item.title}</span>
                  </label>
                ))}
              </div>

              <ErrorMessage name='goal' component='div' className={styles.error} />
            </div>

            {/* Оздоровительные цели  */}
            <div className={`${styles.formSection} ${errors.goal && touched.goal ? styles.hasError : ''}`}>
              <label className={styles.formLabel}>Дополнительные задачи</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='checkbox' name='healthy_goal' value={'posture_correction'} />
                  <span>Исправление осанки</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='checkbox' name='healthy_goal' value={'back_pain_relief'} />
                  <span>Снятие боли в спине (устранение миофасциального синдрома)</span>
                </label>
              </div>

              <ErrorMessage name='goal' component='div' className={styles.error} />
            </div>

            {/* Формат тренировок */}
            <div
              className={`${styles.formSection} ${errors.workout_format && touched.workout_format ? styles.hasError : ''}`}
            >
              <label className={styles.formLabel}>Формат тренировок</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='workout_format' value='home' />
                  <span>Тренировка дома</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='workout_format' value='gym' />
                  <span>Тренировка в спортзале</span>
                </label>
              </div>
              <ErrorMessage name='workout_format' component='div' className={styles.error} />
            </div>

            {/* Количество тренировок в неделю */}
            <div
              className={`${styles.formSection} ${errors.workouts_per_week && touched.workouts_per_week ? styles.hasError : ''}`}
            >
              <label className={styles.formLabel}>Количество тренировок в неделю</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='workouts_per_week' value='4' />
                  <span>2</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='workouts_per_week' value='6' />
                  <span>3</span>
                </label>
              </div>
              <ErrorMessage name='workouts_per_week' component='div' className={styles.error} />
            </div>

            {/* Опыт тренировок */}
            <div
              className={`${styles.formSection} ${errors.experience_level && touched.experience_level ? styles.hasError : ''}`}
            >
              <label className={styles.formLabel}>Опыт тренировок</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='experience_level' value='BEGINNER' />
                  <span>до года</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='experience_level' value='INTERMEDIATE' />
                  <span>от 1 года до 2-х</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='experience_level' value='ADVANCED' />
                  <span>от 2-х до 3-ех лет</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='experience_level' value='EXPERT' />
                  <span>более 3-ех лет</span>
                </label>
              </div>
              <ErrorMessage name='experience_level' component='div' className={styles.error} />
            </div>

            {/* Физическая активность */}
            <div
              className={`${styles.formSection} ${errors.daily_steps_level && touched.daily_steps_level ? styles.hasError : ''}`}
            >
              <label className={styles.formLabel}>Двигательная активность</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='daily_steps_level' value='SEDENTARY' />
                  <span>До 5000 шагов</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='daily_steps_level' value='LIGHT' />
                  <span>5000–8000 шагов</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='daily_steps_level' value='MODERATE' />
                  <span>8000–12000 шагов</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='daily_steps_level' value='VERY_ACTIVE' />
                  <span>12000 шагов и более</span>
                </label>
              </div>
              <ErrorMessage name='daily_steps_level' component='div' className={styles.error} />
            </div>

            {/* Вставить фото */}
            <div
              className={`${styles.formSection} ${errors.daily_steps_level && touched.photos ? styles.hasError : ''}`}
            >
              <label className={styles.formLabel}>Вставить фото</label>
              <div className={styles.photoGrid}>
                {photosConfig.map(item => {
                  const photoKey = item.key as keyof MainFormValues['photos'];
                  const preview = getPhotoPreview(photoKey);

                  return (
                    <div key={item.key}>
                      <div className={styles.photoPlaceholder}>
                        <input
                          type='file'
                          id={`photo-${item.key}`}
                          accept='image/*'
                          style={{ display: 'none' }}
                          capture='environment'
                          onChange={e => handlePhotoUpload(photoKey, e, setFieldValue, setFieldError)}
                        />
                        <label htmlFor={`photo-${item.key}`} className={styles.photoLabel}>
                          {preview ? (
                            <img src={preview} alt={item.label} className={styles.photoPreview} />
                          ) : (
                            <>{item.code}</>
                          )}
                        </label>
                      </div>
                      <span className={styles.photoLabelText}>{item.label}</span>
                      {errors.photos?.[item.key] && touched.photos?.[photoKey] && (
                        <div className={styles.error}>{errors.photos[item.key]}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Согласие с политикой конфиденциальности */}
            <div
              className={`${styles.formSection} ${errors.agreePrivacy && touched.agreePrivacy ? styles.hasError : ''}`}
            >
              <label className={styles.radioLabel} style={{ background: '#1e1e1e', boxShadow: 'none' }}>
                <Field type='checkbox' name='agreePrivacy' />
                <span>
                  Я даю согласие на обработку моих персональных данных в соответствии с{' '}
                  <span style={{ textDecoration: 'underline' }} onClick={() => setIsPrivacyOpen(true)}>
                    Политикой конфиденциальности
                  </span>
                </span>
              </label>

              <ErrorMessage name='agreePrivacy' component='div' className={styles.error} />
            </div>

            <Button type='submit'>Далее</Button>
          </Form>
        )}
      </Formik>
      {isPrivacyOpen && <PrivacyModal id={1} onClose={() => setIsPrivacyOpen(false)} />}
    </>
  );
};

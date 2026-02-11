import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { CreatePaymentRequest } from './api/paymentApi';
import { toast, ToastContainer } from 'react-toastify';
import Button from '../Button';
import styles from './PaymentModal.module.scss';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { SubscriptionPlan } from './api/subscriptionApi';
import { createPayment } from './api/paymentSlice';
import { process } from '../../constants/process';

interface PaymentModalProps {
  plan: SubscriptionPlan;
  currency: 'BYN' | 'RUB';
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ plan, currency, onClose }) => {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector(state => state.auth);

  const initialValues = {
    email: userData?.username || '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    card_number: '',
    cardHolder: `${userData?.first_name || ''} ${userData?.last_name || ''}`,
    firstName: userData?.first_name || '',
    lastName: userData?.last_name || '',
    country: '',
    city: '',
    address: '',
    zipCode: '',
    phone: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Неверный email').required('Обязательное поле'),
    cardNumber: Yup.string()
      .matches(/^\d{16}$/, 'Неверный номер карты')
      .required('Обязательное поле'),
    expMonth: Yup.string()
      .matches(/^(0[1-9]|1[0-2])$/, 'Неверный месяц')
      .required('Обязательное поле'),
    expYear: Yup.string()
      .matches(/^\d{4}$/, 'Неверный год')
      .required('Обязательное поле'),
    cvc: Yup.string()
      .matches(/^\d{3,4}$/, 'Неверный CVC')
      .required('Обязательное поле'),
    cardHolder: Yup.string().required('Обязательное поле'),
    firstName: Yup.string().required('Обязательное поле'),
    lastName: Yup.string().required('Обязательное поле'),
    country: Yup.string().required('Обязательное поле'),
    city: Yup.string().required('Обязательное поле'),
    address: Yup.string().required('Обязательное поле'),
    zipCode: Yup.string().required('Обязательное поле'),
    phone: Yup.string().required('Обязательное поле'),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    if (!userData?.id) return;

    const paymentData: CreatePaymentRequest = {
      subscription_type: String(plan.subscription_type),
      currency,
      user_email: values.email,

      billing_info: {
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone,
        country: values.country,
        city: values.city,
        address: values.address,
        zip_code: values.zipCode,
      },

      return_url: process.env.APP_URL,
      language: 'ru',

      credit_card: {
        number: values.cardNumber,
        verification_value: values.cvc,
        holder: values.cardHolder,
        exp_month: values.expMonth,
        exp_year: values.expYear,
      },

      card_holder: values.cardHolder,
    };

    try {
      const result = await dispatch(
        createPayment({
          userId: userData.id,
          paymentData,
        }),
      ).unwrap();

      if (result.success && result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        toast.error('Ошибка при создании платежа');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      toast.error('Ошибка при создании платежа');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Оплата подписки: {plan.name}</h2>

        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <div className={styles.section}>
                <h3>Информация для счёта</h3>
                <Field name='email' placeholder='Email' />
                <ErrorMessage name='email' component='div' className={styles.error} />

                <Field name='firstName' placeholder='Имя' />
                <ErrorMessage name='firstName' component='div' className={styles.error} />

                <Field name='lastName' placeholder='Фамилия' />
                <ErrorMessage name='lastName' component='div' className={styles.error} />

                <Field name='country' placeholder='Страна' />
                <ErrorMessage name='country' component='div' className={styles.error} />

                <Field name='city' placeholder='Город' />
                <ErrorMessage name='city' component='div' className={styles.error} />

                <Field name='address' placeholder='Адрес' />
                <ErrorMessage name='address' component='div' className={styles.error} />

                <Field name='zipCode' placeholder='Индекс' />
                <ErrorMessage name='zipCode' component='div' className={styles.error} />

                <Field name='phone' placeholder='Телефон' />
                <ErrorMessage name='phone' component='div' className={styles.error} />
              </div>

              <div className={styles.section}>
                <h3>Данные карты</h3>
                <Field name='cardNumber' placeholder='Номер карты' />
                <ErrorMessage name='cardNumber' component='div' className={styles.error} />

                <div className={styles.row}>
                  <Field name='expMonth' placeholder='MM' />
                  <ErrorMessage name='expMonth' component='div' className={styles.error} />

                  <Field name='expYear' placeholder='YY' />
                  <ErrorMessage name='expYear' component='div' className={styles.error} />

                  <Field name='cvc' placeholder='CVC' />
                  <ErrorMessage name='cvc' component='div' className={styles.error} />
                </div>

                <Field name='cardHolder' placeholder='Имя держателя карты' />
                <ErrorMessage name='cardHolder' component='div' className={styles.error} />
              </div>

              <div className={styles.actions}>
                <Button type='button' onClick={onClose} disabled={isSubmitting}>
                  Отмена
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? 'Загрузка...' : 'Оплатить'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>

        <ToastContainer theme='light' hideProgressBar autoClose={3000} />
      </div>
    </div>
  );
};

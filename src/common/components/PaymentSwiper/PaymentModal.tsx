import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { CreatePaymentRequest } from './api/paymentApi';
import { toast, ToastContainer } from 'react-toastify';
import Button from '../Button';
import styles from './PaymentModal.module.scss';
import { Formik, Form, Field, FieldProps } from 'formik';
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
    email: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    cardHolder: '',
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
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    if (!userData?.id) return;

    const paymentData: CreatePaymentRequest = {
      subscription_type: String(plan.subscription_type),
      currency,
      user_email: values.email,
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
          {() => (
            <Form>
              <div className={styles.section}>
                <h3>Информация для счёта</h3>
                <Field name='email'>
                  {({ field, form }: FieldProps) => (
                    <input
                      {...field}
                      placeholder='Email'
                      className={`
        ${styles.input} 
        ${form.touched.email && form.errors.email ? styles.error : ''}
      `}
                    />
                  )}
                </Field>{' '}
              </div>

              <div className={styles.section}>
                <h3>Данные карты</h3>
                <Field name='cardNumber'>
                  {({ field, form }: FieldProps) => (
                    <input
                      {...field}
                      type='number'
                      placeholder='Номер карты'
                      className={`${styles.input} ${form.touched.cardNumber && form.errors.cardNumber ? styles.error : ''}`}
                    />
                  )}
                </Field>
                <div className={styles.row}>
                  <Field name='expMonth'>
                    {({ field, form }: FieldProps) => (
                      <input
                        {...field}
                        type='number'
                        placeholder='MM'
                        className={`${styles.input} ${form.touched.expMonth && form.errors.expMonth ? styles.error : ''}`}
                      />
                    )}
                  </Field>
                  <Field name='expYear'>
                    {({ field, form }: FieldProps) => (
                      <input
                        {...field}
                        type='number'
                        placeholder='YY'
                        className={`${styles.input} ${form.touched.expYear && form.errors.expYear ? styles.error : ''}`}
                      />
                    )}
                  </Field>
                  <Field name='cvc'>
                    {({ field, form }: FieldProps) => (
                      <input
                        {...field}
                        type='number'
                        placeholder='CVC'
                        className={`${styles.input} ${form.touched.cvc && form.errors.cvc ? styles.error : ''}`}
                      />
                    )}
                  </Field>{' '}
                </div>
                <Field name='cardHolder'>
                  {({ field, form }: FieldProps) => (
                    <input
                      {...field}
                      placeholder='Имя держателя карты'
                      className={`${styles.input} ${form.touched.cardHolder && form.errors.cardHolder ? styles.error : ''}`}
                    />
                  )}
                </Field>{' '}
              </div>

              <div className={styles.actions}>
                <Button type='button' onClick={onClose}>
                  Отмена
                </Button>
                <Button type='submit'>Оплатить</Button>
              </div>
            </Form>
          )}
        </Formik>

        <ToastContainer theme='light' hideProgressBar autoClose={3000} />
      </div>
    </div>
  );
};

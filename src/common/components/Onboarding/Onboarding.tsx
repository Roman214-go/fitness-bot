import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { onboardingSlides } from './onboarding.data.tsx';
import { OnboardingSlide } from './OnboardingSlide';
import { OnboardingDots } from './OnboardingDots';
import Button from '../Button';
import styles from './Onboarding.module.scss';
import { PaymentSwiper } from '../PaymentSwiper/PaymentSwiper';
import { useAppSelector } from '../../store/hooks';
import { PrivacyModal } from '../../../pages/PrivacyModal/PrivacyModal.tsx';

export const Onboarding = () => {
  const { userData } = useAppSelector(state => state.auth);

  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [privacyId, setPrivacyId] = useState(0);
  const [activeIndex, setActiveIndex] = useState(userData?.medical_history && userData.body_photos ? 5 : 0);
  const navigate = useNavigate();

  const slides = useMemo(() => {
    return [
      {
        id: 1,
        title: <p style={{ fontSize: '25px' }}>Согласие</p>,
        text: (
          <p className={styles.agreementText}>
            Нажимая кнопку «Далее» вы принимаете политику{' '}
            <span
              style={{ textDecoration: 'underline' }}
              onClick={() => {
                setPrivacyId(1);
                setIsPrivacyOpen(true);
              }}
            >
              обработки персональных данных
            </span>{' '}
            и{' '}
            <span
              style={{ textDecoration: 'underline' }}
              onClick={() => {
                setPrivacyId(2);
                setIsPrivacyOpen(true);
              }}
            >
              соглашение на их обработку
            </span>
          </p>
        ),
      },
      ...onboardingSlides,
    ];
  }, []);

  const isLastSlide = activeIndex === slides.length;

  const next = () => {
    if (!isLastSlide) {
      setActiveIndex(prev => prev + 1);
      return;
    }

    finishOnboarding();
  };

  const finishOnboarding = () => {
    if (userData?.medical_history && userData.body_photos) {
      navigate('/');
      return;
    }
    if (!userData?.medical_history) {
      navigate('/anamnesis-form');
    }
    if (!userData?.body_photos) {
      navigate('/main-form', { replace: true });
    }
  };

  return (
    <div className={styles.wrapper} style={{ padding: isLastSlide ? '0' : '5%' }}>
      {!isLastSlide ? (
        activeIndex === 0 ? (
          <div />
        ) : (
          <button type='button' className={styles.wrapper_skip} onClick={() => setActiveIndex(slides.length)}>
            Пропустить
          </button>
        )
      ) : (
        <p className={styles.wrapper_subscription}>Выберите подходящий для вас тип подписки</p>
      )}
      {activeIndex === 0 ? (
        <div style={{ margin: '0 auto' }}>
          <svg
            id='Layer_1'
            data-name='Layer 1'
            xmlns='http://www.w3.org/2000/svg'
            width={'200px'}
            viewBox='0 0 792.97 374.608'
          >
            <path
              fill='#f2080b'
              d='M792.937,332.888c-.003,8.672-1.844,16.492-5.999,23.541-5.996,10.173-18.08,18.05-30.985,18.054l-355.996.126c-13.347-1.745-23.251-7.507-30.345-18.703-2.551-6.215-5.831-13.165-5.839-20.711l-.17-160.369,245.294.475,143.551.507c15.333-.133,32.569,7.573,37.084,22.89,1.737,5.892,3.44,12.14,3.439,18.603l-.034,115.588ZM517.87,263.544l-54.057-.163c-1.037-9.62-1.238-17.597-1.034-27.134l64.025-.078-.147-36.077-105.86.227-.016,150.817,41.891.106.067-51.511,55.126-.159.004-36.029ZM587.508,200.165l-42.219.013.048,151.124,42.219-.013-.048-151.124ZM689.684,344.226l-.036-104.962,39.774-.058.051-38.233-123.734-.02-.042,38.212,40.403.107.012,111.859,42.17.156c.796-1.622,1.402-4.209,1.401-7.062Z'
            />
            <path
              fill='#f2080b'
              d='M333.181,213.461l-118.03.011-.253,112.002c-.024,10.713-8.637,17.263-18.356,18.825l-70.843-.067c-11.963-.011-20.001-9.82-20.009-22.048l-.209-300.691c-.008-10.925,6.911-21.023,18.588-21.063l71.581-.244c10.117,1.189,19.333,8.374,19.351,19.421l.194,113.97,114.896-.047c3.591-.001,5.712,1.235,5.919,5.053l.02,70.91c.192.835-1.446,3.968-2.851,3.968Z'
            />
            <path
              fill='#f2080b'
              d='M547.104,160.978c-15.958.704-28.325-.129-43.426-5.583-11.418-4.124-21.545-9.677-29.68-18.643-12.774-14.079-20.196-30.982-21.456-50.003-1.325-20.002,3.692-43.119,16.579-58.874C485.882,7.384,511.579-.313,537.589.01c23.063.286,46.189,7.17,61.982,24.566,26.295,28.965,27.195,72.452,5.116,103.98-5.756,8.22-11.753,14.391-20.052,19.749-11.428,7.378-23.767,12.065-37.53,12.672ZM544.698,120.755c27.495-5.208,33.642-38.542,25.359-58.853-6.188-15.175-19.552-22.836-35.386-22.641-16.496.202-30.772,9.146-35.292,25.538-6.479,23.492.948,48.069,25.785,56.358,6.238-.266,12.928.849,19.534-.402Z'
            />
            <path
              fill='#f2080b'
              d='M769.42,1.163c1.482-.003,4.345,1.773,4.344,2.965l-.054,98.767c-.013,23.524-14.008,43.294-34.86,52.696-10.976,4.949-22.291,6.074-34.306,6.028-23.426-.089-47.246-4.739-60.402-26.123-4.905-7.973-9.285-17.17-9.427-26.694l-.81-54.384-.41-46.319c.455-2.36,1.092-4.881,1.926-7.055l43.331.252.103,95.925c.006,5.169,3.228,11.159,5.842,14.898,4.987,7.133,12.672,9.399,20.794,9.301,9.387-.114,17.407-4.766,20.936-13.817,1.473-3.777,2.952-8.781,2.952-13.265l.006-88.313c0-2.6,1.534-4.786,4.202-4.791l35.833-.071Z'
            />
            <path
              fill='#f2080b'
              d='M58.081,302.331c-9.631-.068-16.939-8.588-16.949-18.03l-.224-220.547c-.011-10.894,5.604-21.193,17.72-21.232l36.313-.117-.045,260.187-36.815-.261Z'
            />
            <path
              fill='#f2080b'
              d='M464.608,1.188c-3.441,9.288-7.775,15.138-12.063,22.602l-45.479,79.174-.146,55.645-43.239.029.096-53.263L306.579.259l50.114-.114,9.059,18.402c6.322,13.823,12.156,26.986,19.828,40.835L414.641,1.054l49.967.134Z'
            />
            <path
              fill='#f2080b'
              d='M31.085,228.535c-16.87-.369-22.802,4.187-31.085-11.595l.087-88.73c7.242-16.322,14.769-11.282,30.917-11.829l-.021,69.116.103,43.038Z'
            />
          </svg>
        </div>
      ) : null}
      <div style={{ width: '100%' }}>
        {isLastSlide ? <PaymentSwiper /> : <OnboardingSlide data={slides[activeIndex]} />}
      </div>

      <div className={styles.wrapper_next} style={{ padding: isLastSlide ? '0 5% 5% 5%' : '0' }}>
        {!isLastSlide && <OnboardingDots total={slides.length} active={activeIndex} />}

        <Button buttonType={isLastSlide ? 'secondary' : 'primary'} onClick={next}>
          {isLastSlide ? 'Пропустить оплату' : 'Далее'}
        </Button>
      </div>
      {isPrivacyOpen && <PrivacyModal id={privacyId} onClose={() => setIsPrivacyOpen(false)} />}
    </div>
  );
};

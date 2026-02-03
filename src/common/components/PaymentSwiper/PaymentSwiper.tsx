import { Swiper, SwiperSlide } from 'swiper/react';
import styles from './PaymentSwiper.module.scss';

import Button from '../Button';
import { Navigation } from 'swiper/modules';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import 'swiper/css/navigation';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import 'swiper/css';

export const PaymentSwiper = () => {
  const mockedPayment = [
    {
      id: 1,
      title: 'Для новичков',
      expiry: '30 дней',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates saepe at blanditiis eum illum consectetur dolorum consequatur iure aliquid ipsum!',
      additionalInfo: ['Персональные трени', 'Еще трени', 'Силовые трени', 'Слабовые трени'],
      price: '999 рублей',
    },
    {
      id: 2,
      title: 'Для любителей',
      expiry: '45 дней',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates saepe at blanditiis eum illum consectetur dolorum consequatur iure aliquid ipsum!',
      additionalInfo: ['Персональные трени', 'Еще трени', 'Силовые трени', 'Слабовые трени'],
      price: '1999 рублей',
    },
    {
      id: 3,
      title: 'Для профи',
      expiry: '60 дней',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates saepe at blanditiis eum illum consectetur dolorum consequatur iure aliquid ipsum!',
      additionalInfo: ['Персональные трени', 'Еще трени', 'Силовые трени', 'Слабовые трени'],
      price: '2499 рублей',
    },
  ];
  return (
    <Swiper spaceBetween={50} slidesPerView={1} modules={[Navigation]} navigation>
      {mockedPayment.map(item => (
        <SwiperSlide key={item.id}>
          <div className={styles.swiper_container}>
            <div>
              <h2 className={styles.title}>{item.title}</h2>
              <p style={{ textAlign: 'start' }}>{item.expiry}</p>
            </div>
            <p>{item.description}</p>
            <ul>
              {item.additionalInfo.map((list, i) => (
                <li key={i}>{list}</li>
              ))}
            </ul>
            <div>
              <div style={{ display: 'flex', justifyContent: 'end', margin: '10px 0' }}>
                <p className={styles.discount_price}>{item.price}</p>
              </div>
              <p className={styles.price}>{item.price}</p>
            </div>
            <Button>Купить</Button>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

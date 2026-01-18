import React, { useState } from 'react';
import styles from './ProfileEditPage.module.scss';
import { useNavigate } from 'react-router-dom';
import { MdArrowBackIos } from 'react-icons/md';
import { MdAddAPhoto } from 'react-icons/md';

interface SelectOption {
  label: string;
  value: string | number;
}

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<string>('mass');
  const options: SelectOption[] = [
    { label: 'Массонабор', value: 'mass' },
    { label: 'Похудение', value: 'hud' },
    { label: 'Лечение спины', value: 'healing' },
  ];
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    goal: '',
    trainingGoal: '',
    bodyType: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectedLabel = options.find(opt => opt.value === value)?.label || '';

  return (
    <div className={styles.container}>
      <div className={styles.avatar}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <MdArrowBackIos />
        </button>
        <button className={styles.uploadAvatar} onClick={() => console.log('upload-photo')}>
          <MdAddAPhoto />
        </button>
        <img src='https://i.pravatar.cc/150?img=8' />
      </div>

      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Возраст</label>
          <input
            type='text'
            className={styles.input}
            placeholder='Введите текст'
            value={formData.age}
            onChange={e => handleInputChange('age', e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Вес(кг)</label>
          <input
            type='text'
            className={styles.input}
            placeholder='Введите текст'
            value={formData.weight}
            onChange={e => handleInputChange('weight', e.target.value)}
          />

          <div style={{ marginTop: '20px' }}>
            <label className={styles.label}>Рост</label>
            <input
              type='text'
              className={styles.input}
              placeholder='Введите текст'
              value={formData.height}
              onChange={e => handleInputChange('height', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Цель тренировок</label>

          <div className={styles.selectWrapper}>
            <div className={styles.selectContent}>
              <div className={styles.selectValue}>{selectedLabel}</div>
            </div>
            <div className={styles.selectAction}>Выбери</div>
            <select className={styles.selectHidden} value={value} onChange={e => setValue(e.target.value)}>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;

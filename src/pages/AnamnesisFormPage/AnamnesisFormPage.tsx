import React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './AnamnesisFormPage.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/components/Button';

interface FormValues {
  varVeinExpansion: string;
  spineDisease: string;
  centralNervousDisease: string;
  cardiovascularDisease: string;
  respiratoryDisease: string;
  diabetes: string;
  diabetesText?: string;
  jointsTraumaDisease: string;
  traumaBoneJoint: string;
  kidneyDisease: string;
  surgicalOperations: string;
  surgicalOperationsText?: string;
  plantsMusclesDisorder: string;
  visionDisorder: string;
  visionDisorderText?: string;
  thyroidDisease: string;
  hormonalDisorders: string;
  otherHealthConditions: string;
  otherHealthConditionsText?: string;
}

const validationSchema = Yup.object().shape({
  varVeinExpansion: Yup.string().required('Выберите ответ'),
  spineDisease: Yup.string().required('Выберите ответ'),
  centralNervousDisease: Yup.string().required('Выберите ответ'),
  cardiovascularDisease: Yup.string().required('Выберите ответ'),
  respiratoryDisease: Yup.string().required('Выберите ответ'),
  diabetes: Yup.string().required('Выберите ответ'),
  diabetesText: Yup.string().when('diabetes', {
    is: 'yes',
    then: schema => schema.required('Введите текст'),
  }),
  jointsTraumaDisease: Yup.string().required('Выберите ответ'),
  traumaBoneJoint: Yup.string().required('Выберите ответ'),
  kidneyDisease: Yup.string().required('Выберите ответ'),
  surgicalOperations: Yup.string().required('Выберите ответ'),
  surgicalOperationsText: Yup.string().when('surgicalOperations', {
    is: 'yes',
    then: schema => schema.required('Введите текст'),
  }),
  plantsMusclesDisorder: Yup.string().required('Выберите ответ'),
  visionDisorder: Yup.string().required('Выберите ответ'),
  visionDisorderText: Yup.string().when('visionDisorder', {
    is: 'yes',
    then: schema => schema.required('Введите текст'),
  }),
  thyroidDisease: Yup.string().required('Выберите ответ'),
  hormonalDisorders: Yup.string().required('Выберите ответ'),
  otherHealthConditions: Yup.string().required('Выберите ответ'),
});

export const AnamnesisFormPage: React.FC = () => {
  const navigate = useNavigate();

  const initialValues: FormValues = {
    varVeinExpansion: '',
    spineDisease: '',
    centralNervousDisease: '',
    cardiovascularDisease: '',
    respiratoryDisease: '',
    diabetes: '',
    diabetesText: '',
    jointsTraumaDisease: '',
    traumaBoneJoint: '',
    kidneyDisease: '',
    surgicalOperations: '',
    surgicalOperationsText: '',
    plantsMusclesDisorder: '',
    visionDisorder: '',
    visionDisorderText: '',
    thyroidDisease: '',
    hormonalDisorders: '',
    otherHealthConditions: '',
    otherHealthConditionsText: '',
  };

  const handleSubmit = (values: FormValues) => {
    console.log('Form submitted:', values);
    navigate('/');
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Анамнез</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({ values, errors, touched, handleSubmit: formikSubmit }) => (
          <form
            className={styles.form}
            onSubmit={e => {
              e.preventDefault();
              formikSubmit();
            }}
          >
            {/* 1. Варикозное расширение вен */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>1. Варикозное расширение вен</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='varVeinExpansion' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='varVeinExpansion' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='varVeinExpansion' component='div' className={styles.error} />
            </div>

            {/* 2. Заболевания позвоночника */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>2. Заболевания позвоночника</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='spineDisease' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='spineDisease' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='spineDisease' component='div' className={styles.error} />
            </div>

            {/* 3. Заболевания центральной нервной системы */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>3. Заболевания центральной нервной системы</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='centralNervousDisease' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='centralNervousDisease' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='centralNervousDisease' component='div' className={styles.error} />
            </div>

            {/* 4. Заболевания сердечно-сосудистой системы */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>4. Заболевания сердечно-сосудистой системы</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='cardiovascularDisease' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='cardiovascularDisease' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='cardiovascularDisease' component='div' className={styles.error} />
            </div>

            {/* 5. Заболевания респираторной системы */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>5. Заболевания респираторной системы</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='respiratoryDisease' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='respiratoryDisease' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='respiratoryDisease' component='div' className={styles.error} />
            </div>

            {/* 6. Диабет (тип) */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>6. Диабет (тип)</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='diabetes' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='diabetes' value='no' />
                  <span>Нет</span>
                </label>
              </div>

              <ErrorMessage name='diabetes' component='div' className={styles.error} />
              {values.diabetes === 'yes' && (
                <div className={styles.conditionalField}>
                  <Field
                    type='text'
                    name='diabetesText'
                    placeholder='Введите текст'
                    className={`${styles.textInput} ${errors.diabetesText && touched.diabetesText ? styles.inputError : ''}`}
                  />
                  <ErrorMessage name='diabetes' component='div' className={styles.error} />
                </div>
              )}
            </div>

            {/* 7. Заболевания и травмы суставов */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>7. Заболевания и травмы суставов</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='jointsTraumaDisease' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='jointsTraumaDisease' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='jointsTraumaDisease' component='div' className={styles.error} />
            </div>

            {/* 8. Травмы позвоночника и черепно-мозговые травмы */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>8. Травмы позвоночника и черепно-мозговые травмы</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='traumaBoneJoint' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='traumaBoneJoint' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='traumaBoneJoint' component='div' className={styles.error} />
            </div>

            {/* 9. Заболевания почек */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>9. Заболевания почек</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='kidneyDisease' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='kidneyDisease' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='kidneyDisease' component='div' className={styles.error} />
            </div>

            {/* 10. Хирургические операции когда и какие */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>10. Хирургические операции когда и какие</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='surgicalOperations' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='surgicalOperations' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='surgicalOperations' component='div' className={styles.error} />
              {values.surgicalOperations === 'yes' && (
                <div className={styles.conditionalField}>
                  <Field
                    type='text'
                    name='surgicalOperationsText'
                    placeholder='Введите текст'
                    className={`${styles.textInput} ${errors.surgicalOperationsText && touched.surgicalOperationsText ? styles.inputError : ''}`}
                  />
                  <ErrorMessage name='surgicalOperationsText' component='div' className={styles.error} />
                </div>
              )}
            </div>

            {/* 11. Расстения и разрывы мышц и связок */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>11. Растяжения и разрывы мышц и связок</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='plantsMusclesDisorder' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='plantsMusclesDisorder' value='no' />
                  <span>Нет</span>
                </label>
              </div>
            </div>

            {/* 12. Нарушения зрения (степень) */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>12. Нарушения зрения (степень)</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='visionDisorder' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='visionDisorder' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='visionDisorder' component='div' className={styles.error} />
              {values.visionDisorder === 'yes' && (
                <div className={styles.conditionalField}>
                  <Field
                    type='text'
                    name='visionDisorderText'
                    placeholder='Введите текст'
                    className={`${styles.textInput} ${errors.visionDisorderText && touched.visionDisorderText ? styles.inputError : ''}`}
                  />
                  <ErrorMessage name='visionDisorderText' component='div' className={styles.error} />
                </div>
              )}
            </div>

            {/* 13. Заболевания щитовидной железы */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>13. Заболевания щитовидной железы</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='thyroidDisease' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='thyroidDisease' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='thyroidDisease' component='div' className={styles.error} />
            </div>

            {/* 14. Гормональные нарушения */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>14. Гормональные нарушения</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='hormonalDisorders' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='hormonalDisorders' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='hormonalDisorders' component='div' className={styles.error} />
            </div>

            {/* 15. Другие отклонения здоровья */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>15. Другие отклонения здоровья</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='otherHealthConditions' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='otherHealthConditions' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='otherHealthConditions' component='div' className={styles.error} />
              {values.otherHealthConditions === 'yes' && (
                <div className={styles.conditionalField}>
                  <Field
                    type='text'
                    name='otherHealthConditionsText'
                    placeholder='Введите текст'
                    className={`${styles.textInput} ${errors.otherHealthConditionsText && touched.otherHealthConditionsText ? styles.inputError : ''}`}
                  />
                  <ErrorMessage name='otherHealthConditionsText' component='div' className={styles.error} />
                </div>
              )}
            </div>

            <Button type='submit'>Далее</Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

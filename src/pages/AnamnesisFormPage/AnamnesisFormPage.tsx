import React, { useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styles from './AnamnesisFormPage.module.scss';
import { useNavigate } from 'react-router-dom';
import Button from '../../common/components/Button';
import { postAnamnesisData } from './api/postAnamnesisData';
import { useAppDispatch, useAppSelector } from '../../common/store/hooks';
import { axiosInstance } from '../../common/utils/axiosInstance';
import { setUserData } from '../../common/auth/authSlice';

export interface AnamnesisFormValues {
  has_varicose_veins: string;
  has_spinal_diseases: string;
  spinal_diseases_description?: string;
  has_cns_diseases: string;
  has_cardiovascular_diseases: string;
  cardiovascular_diseases_description?: string;
  has_respiratory_diseases: string;
  respiratory_diseases_description?: string;
  has_diabetes: string;
  diabetes_type?: string;
  has_joint_diseases: string;
  joint_diseases_description?: string;
  has_spinal_head_injuries: string;
  spinal_head_injuries_description?: string;
  has_kidney_diseases: string;
  has_surgical_operations: string;
  surgical_operations_description?: string;
  has_muscle_injuries: string;
  has_visual_impairment: string;
  visual_impairment_degree?: string;
  has_thyroid_diseases: string;
  has_hormonal_disorders: string;
  hormonal_disorders_description?: string;
  has_other_health_problems: string;
  other_health_problems_description?: string;
}

const validationSchema = Yup.object().shape({
  has_varicose_veins: Yup.string().required('Выберите ответ'),
  has_spinal_diseases: Yup.string().required('Выберите ответ'),
  spinal_diseases_description: Yup.string().when('has_spinal_diseases', {
    is: 'yes',
    then: schema => schema.required('Введите текст'),
  }),
  has_cns_diseases: Yup.string().required('Выберите ответ'),
  has_cardiovascular_diseases: Yup.string().required('Выберите ответ'),
  cardiovascular_diseases_description: Yup.string().when('has_cardiovascular_diseases', {
    is: 'yes',
    then: schema => schema.required('Введите текст'),
  }),
  has_respiratory_diseases: Yup.string().required('Выберите ответ'),
  respiratory_diseases_description: Yup.string().when('has_respiratory_diseases', {
    is: 'yes',
    then: schema => schema.required('Введите текст'),
  }),
  has_diabetes: Yup.string().required('Выберите ответ'),
  diabetes_type: Yup.string().when('has_diabetes', {
    is: 'yes',
    then: schema => schema.required('Введите текст'),
  }),
  has_joint_diseases: Yup.string().required('Выберите ответ'),
  joint_diseases_description: Yup.string().when('has_joint_diseases', {
    is: 'yes',
    then: schema => schema.required('Введите текст'),
  }),
  has_spinal_head_injuries: Yup.string().required('Выберите ответ'),
  spinal_head_injuries_description: Yup.string().when('has_spinal_head_injuries', {
    is: 'yes',
    then: schema => schema.required('Введите текст'),
  }),
  has_kidney_diseases: Yup.string().required('Выберите ответ'),
  has_surgical_operations: Yup.string().required('Выберите ответ'),
  surgical_operations_description: Yup.string().when('has_surgical_operations', {
    is: 'yes',
    then: schema => schema.required('Введите текст'),
  }),
  has_muscle_injuries: Yup.string().required('Выберите ответ'),
  has_visual_impairment: Yup.string().required('Выберите ответ'),
  visual_impairment_degree: Yup.string().when('has_visual_impairment', {
    is: 'yes',
    then: schema => schema.required('Введите текст'),
  }),
  has_thyroid_diseases: Yup.string().required('Выберите ответ'),
  has_hormonal_disorders: Yup.string().required('Выберите ответ'),
  hormonal_disorders_description: Yup.string().when('has_hormonal_disorders', {
    is: 'yes',
    then: schema => schema.required('Введите текст'),
  }),
  has_other_health_problems: Yup.string().required('Выберите ответ'),
});

export const AnamnesisFormPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector(state => state.auth);
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const initialValues: AnamnesisFormValues = {
    has_varicose_veins: '',
    has_spinal_diseases: '',
    spinal_diseases_description: '',
    has_cns_diseases: '',
    has_cardiovascular_diseases: '',
    cardiovascular_diseases_description: '',
    has_respiratory_diseases: '',
    respiratory_diseases_description: '',
    has_diabetes: '',
    diabetes_type: '',
    has_joint_diseases: '',
    joint_diseases_description: '',
    has_spinal_head_injuries: '',
    spinal_head_injuries_description: '',
    has_kidney_diseases: '',
    has_surgical_operations: '',
    surgical_operations_description: '',
    has_muscle_injuries: '',
    has_visual_impairment: '',
    visual_impairment_degree: '',
    has_thyroid_diseases: '',
    has_hormonal_disorders: '',
    hormonal_disorders_description: '',
    has_other_health_problems: '',
    other_health_problems_description: '',
  };

  const handleSubmit = async (values: AnamnesisFormValues) => {
    if (userData?.telegram_id) {
      setIsLoadingButton(true);
      postAnamnesisData(values, userData?.telegram_id);
      setTimeout(async () => {
        const res = await axiosInstance.get(`/users/telegram/${userData?.telegram_id}`, {
          params: { include_relations: true },
        });

        dispatch(setUserData(res.data));
        navigate('/');
      }, 1000);
    }
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
                  <Field type='radio' name='has_varicose_veins' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_varicose_veins' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_varicose_veins' component='div' className={styles.error} />
            </div>

            {/* 2. Заболевания позвоночника */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>2. Заболевания позвоночника</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_spinal_diseases' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_spinal_diseases' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_spinal_diseases' component='div' className={styles.error} />
              {values.has_spinal_diseases === 'yes' && (
                <div className={styles.conditionalField}>
                  <Field
                    type='text'
                    name='spinal_diseases_description'
                    placeholder='Введите текст'
                    className={`${styles.textInput} ${errors.spinal_diseases_description && touched.spinal_diseases_description ? styles.inputError : ''}`}
                  />
                  <ErrorMessage name='spinal_diseases_description' component='div' className={styles.error} />
                </div>
              )}
            </div>

            {/* 3. Заболевания центральной нервной системы */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>3. Заболевания центральной нервной системы</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_cns_diseases' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_cns_diseases' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_cns_diseases' component='div' className={styles.error} />
            </div>

            {/* 4. Заболевания сердечно-сосудистой системы */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>4. Заболевания сердечно-сосудистой системы</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_cardiovascular_diseases' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_cardiovascular_diseases' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_cardiovascular_diseases' component='div' className={styles.error} />
              {values.has_cardiovascular_diseases === 'yes' && (
                <div className={styles.conditionalField}>
                  <Field
                    type='text'
                    name='cardiovascular_diseases_description'
                    placeholder='Введите текст'
                    className={`${styles.textInput} ${errors.cardiovascular_diseases_description && touched.cardiovascular_diseases_description ? styles.inputError : ''}`}
                  />
                  <ErrorMessage name='cardiovascular_diseases_description' component='div' className={styles.error} />
                </div>
              )}
            </div>

            {/* 5. Заболевания респираторной системы */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>5. Заболевания респираторной системы</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_respiratory_diseases' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_respiratory_diseases' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_respiratory_diseases' component='div' className={styles.error} />
              {values.has_respiratory_diseases === 'yes' && (
                <div className={styles.conditionalField}>
                  <Field
                    type='text'
                    name='respiratory_diseases_description'
                    placeholder='Введите текст'
                    className={`${styles.textInput} ${errors.respiratory_diseases_description && touched.respiratory_diseases_description ? styles.inputError : ''}`}
                  />
                  <ErrorMessage name='respiratory_diseases_description' component='div' className={styles.error} />
                </div>
              )}
            </div>

            {/* 6. Диабет (тип) */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>6. Диабет (тип)</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_diabetes' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_diabetes' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_diabetes' component='div' className={styles.error} />
              {values.has_diabetes === 'yes' && (
                <div className={styles.conditionalField}>
                  <Field
                    type='text'
                    name='diabetes_type'
                    placeholder='Введите текст'
                    className={`${styles.textInput} ${errors.diabetes_type && touched.diabetes_type ? styles.inputError : ''}`}
                  />
                  <ErrorMessage name='diabetes_type' component='div' className={styles.error} />
                </div>
              )}
            </div>

            {/* 7. Заболевания и травмы суставов */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>7. Заболевания и травмы суставов</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_joint_diseases' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_joint_diseases' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_joint_diseases' component='div' className={styles.error} />
              {values.has_joint_diseases === 'yes' && (
                <div className={styles.conditionalField}>
                  <Field
                    type='text'
                    name='joint_diseases_description'
                    placeholder='Введите текст'
                    className={`${styles.textInput} ${errors.joint_diseases_description && touched.joint_diseases_description ? styles.inputError : ''}`}
                  />
                  <ErrorMessage name='joint_diseases_description' component='div' className={styles.error} />
                </div>
              )}
            </div>

            {/* 8. Травмы позвоночника и черепно-мозговые травмы */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>8. Травмы позвоночника и черепно-мозговые травмы</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_spinal_head_injuries' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_spinal_head_injuries' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_spinal_head_injuries' component='div' className={styles.error} />
              {values.has_spinal_head_injuries === 'yes' && (
                <div className={styles.conditionalField}>
                  <Field
                    type='text'
                    name='spinal_head_injuries_description'
                    placeholder='Введите текст'
                    className={`${styles.textInput} ${errors.spinal_head_injuries_description && touched.spinal_head_injuries_description ? styles.inputError : ''}`}
                  />
                  <ErrorMessage name='spinal_head_injuries_description' component='div' className={styles.error} />
                </div>
              )}
            </div>

            {/* 9. Заболевания почек */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>9. Заболевания почек</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_kidney_diseases' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_kidney_diseases' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_kidney_diseases' component='div' className={styles.error} />
            </div>

            {/* 10. Хирургические операции когда и какие */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>10. Хирургические операции когда и какие</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_surgical_operations' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_surgical_operations' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_surgical_operations' component='div' className={styles.error} />
              {values.has_surgical_operations === 'yes' && (
                <div className={styles.conditionalField}>
                  <Field
                    type='text'
                    name='surgical_operations_description'
                    placeholder='Введите текст'
                    className={`${styles.textInput} ${errors.surgical_operations_description && touched.surgical_operations_description ? styles.inputError : ''}`}
                  />
                  <ErrorMessage name='surgical_operations_description' component='div' className={styles.error} />
                </div>
              )}
            </div>

            {/* 11. Расстения и разрывы мышц и связок */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>11. Растяжения и разрывы мышц и связок</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_muscle_injuries' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_muscle_injuries' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_muscle_injuries' component='div' className={styles.error} />
            </div>

            {/* 12. Нарушения зрения (степень) */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>12. Нарушения зрения (степень)</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_visual_impairment' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_visual_impairment' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_visual_impairment' component='div' className={styles.error} />
              {values.has_visual_impairment === 'yes' && (
                <div className={styles.conditionalField}>
                  <Field
                    type='text'
                    name='visual_impairment_degree'
                    placeholder='Введите текст'
                    className={`${styles.textInput} ${errors.visual_impairment_degree && touched.visual_impairment_degree ? styles.inputError : ''}`}
                  />
                  <ErrorMessage name='visual_impairment_degree' component='div' className={styles.error} />
                </div>
              )}
            </div>

            {/* 13. Заболевания щитовидной железы */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>13. Заболевания щитовидной железы</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_thyroid_diseases' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_thyroid_diseases' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_thyroid_diseases' component='div' className={styles.error} />
            </div>

            {/* 14. Гормональные нарушения */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>14. Гормональные нарушения</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_hormonal_disorders' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_hormonal_disorders' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_hormonal_disorders' component='div' className={styles.error} />
              {values.has_hormonal_disorders === 'yes' && (
                <div className={styles.conditionalField}>
                  <Field
                    type='text'
                    name='hormonal_disorders_description'
                    placeholder='Введите текст'
                    className={`${styles.textInput} ${errors.hormonal_disorders_description && touched.hormonal_disorders_description ? styles.inputError : ''}`}
                  />
                  <ErrorMessage name='hormonal_disorders_description' component='div' className={styles.error} />
                </div>
              )}
            </div>

            {/* 15. Другие отклонения здоровья */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>15. Другие отклонения здоровья</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_other_health_problems' value='yes' />
                  <span>Да</span>
                </label>
                <label className={styles.radioLabel}>
                  <Field type='radio' name='has_other_health_problems' value='no' />
                  <span>Нет</span>
                </label>
              </div>
              <ErrorMessage name='has_other_health_problems' component='div' className={styles.error} />
              {values.has_other_health_problems === 'yes' && (
                <div className={styles.conditionalField}>
                  <Field
                    type='text'
                    name='other_health_problems_description'
                    placeholder='Введите текст'
                    className={`${styles.textInput} ${errors.other_health_problems_description && touched.other_health_problems_description ? styles.inputError : ''}`}
                  />
                  <ErrorMessage name='other_health_problems_description' component='div' className={styles.error} />
                </div>
              )}
            </div>

            <Button isLoading={isLoadingButton} type='submit'>
              Далее
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

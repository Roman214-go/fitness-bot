import { axiosInstance } from '../../../common/utils/axiosInstance';
import { AnamnesisFormValues } from '../AnamnesisFormPage';

const yesNoToBool = (v: string) => v === 'yes';

export const postAnamnesisData = async (values: AnamnesisFormValues, telegramId: number): Promise<void> => {
  const body = new URLSearchParams();

  body.append('has_varicose_veins', String(yesNoToBool(values.has_varicose_veins)));
  body.append('has_spinal_diseases', String(yesNoToBool(values.has_spinal_diseases)));
  body.append('has_cns_diseases', String(yesNoToBool(values.has_cns_diseases)));
  body.append('has_cardiovascular_diseases', String(yesNoToBool(values.has_cardiovascular_diseases)));
  body.append('has_respiratory_diseases', String(yesNoToBool(values.has_respiratory_diseases)));
  body.append('has_diabetes', String(yesNoToBool(values.has_diabetes)));

  if (values.has_diabetes === 'yes' && values.diabetes_type) {
    body.append('diabetes_type', values.diabetes_type);
  }

  body.append('has_joint_diseases', String(yesNoToBool(values.has_joint_diseases)));
  body.append('has_spinal_head_injuries', String(yesNoToBool(values.has_spinal_head_injuries)));
  body.append('has_kidney_diseases', String(yesNoToBool(values.has_kidney_diseases)));
  body.append('has_surgical_operations', String(yesNoToBool(values.has_surgical_operations)));

  if (values.has_surgical_operations === 'yes' && values.surgical_operations_description) {
    body.append('surgical_operations_description', values.surgical_operations_description);
  }

  body.append('has_muscle_injuries', String(yesNoToBool(values.has_muscle_injuries)));
  body.append('has_visual_impairment', String(yesNoToBool(values.has_visual_impairment)));

  if (values.has_visual_impairment === 'yes' && values.visual_impairment_degree) {
    body.append('visual_impairment_degree', values.visual_impairment_degree);
  }

  body.append('has_thyroid_diseases', String(yesNoToBool(values.has_thyroid_diseases)));
  body.append('has_hormonal_disorders', String(yesNoToBool(values.has_hormonal_disorders)));
  body.append('has_other_health_problems', String(yesNoToBool(values.has_other_health_problems)));

  if (values.has_other_health_problems === 'yes' && values.other_health_problems_description) {
    body.append('other_health_problems_description', values.other_health_problems_description);
  }

  await axiosInstance.post('forms/medical-history', body, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Telegram-Auth': JSON.stringify({ telegram_id: telegramId }),
    },
  });
};

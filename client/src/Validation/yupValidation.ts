import * as Yup  from 'yup';

export const answerInputSchema = Yup.object().shape({
    answer: Yup.string()
      .required("Answer is required.")
      .min(50, "Answer must be at least 50 characters.")
      .max(600, "Answer cannot exceed 600 characters.")
  });
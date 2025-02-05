import * as Yup  from 'yup';
import dayjs from 'dayjs';

export const answerInputSchema = Yup.object().shape({
    answer: Yup.string()
      .required("Answer is required.")
      .min(50, "Answer must be at least 50 characters.")
      .max(600, "Answer cannot exceed 600 characters.")
  });

export const bookingInputValidation = Yup.object().shape({
  message:Yup.string()
  .required('message field is required')
  .min(20,'message must be atleast 20 characters')
  .max(200,'message can\'t be longer than 200 characters')
});

 export const validateRecuuringSchema = Yup.object({
  startDate: Yup.string()
    .required('Start Date is required')
    .test('is-future', 'Start Date cannot be in the past', (value) => {
      // Ensure the value is not in the past
      if (value && dayjs(value).isBefore(dayjs(), 'day')) {
        return new Yup.ValidationError('Start Date cannot be in the past');
      }
      return true; 
    }),

    endDate: Yup.string()
    .required('End Date is required')
    .test('is-future', 'End Date cannot be in the past', (value) => {
      if (value && dayjs(value).isBefore(dayjs(), 'day')) {
        return new Yup.ValidationError('End Date cannot be in the past');
      }
      return true;
    })
    .test('is-not-same-as-start', 'End Date cannot be the same as Start Date', function (value) {
      if (value && dayjs(value).isSame(dayjs(this.parent.startDate), 'day')) {
        return new Yup.ValidationError('End Date cannot be the same as Start Date');
      }
      return true;
    })
    .test('is-at-least-3-days', 'End Date must be at least 3 days after Start Date', function (value) {
      if (value && dayjs(value).diff(dayjs(this.parent.startDate), 'day') < 3) {
        return new Yup.ValidationError('End Date must be at least 3 days after Start Date');
      }
      return true;
    }),

  price: Yup.number()
    .required('Price is required')
    .positive('Price must be a positive number')
    .integer('Price must be an integer')
    .typeError('Price must be a valid number'),

  selectedDays: Yup.array()
    .min(1, 'Please select at least one day')
    .required('Days are required'),

    timeSlots: Yup.array().of(
      Yup.object({
        startTime: Yup.string()
          .required('Start Time is required')
          .test('is-future', 'Start Time must be at least 1 hour ahead of the current time', (value) => {
            if (value && dayjs(value).isBefore(dayjs().add(1, 'hour'), 'minute')) {
              return new Yup.ValidationError('Start Time must be at least 1 hour ahead of the current time');
            }
            return true;
          }),
  

          endTime: Yup.string()
          .required('End Time is required')
          .test('is-different-from-start', 'End Time cannot be the same as Start Time', function (value) {
            if (value && dayjs(value).isSame(dayjs(this.parent.startTime), 'minute')) {
              return new Yup.ValidationError('End Time cannot be the same as Start Time');
            }
            return true;
          })
          .test('is-at-least-30-minutes-later', 'End Time must be at least 30 minutes after Start Time', function (value) {
            if (value && dayjs(value).diff(dayjs(this.parent.startTime), 'minute') < 30) {
              return new Yup.ValidationError('End Time must be at least 30 minutes after Start Time');
            }
            return true;
          }),
    })
  ),
});


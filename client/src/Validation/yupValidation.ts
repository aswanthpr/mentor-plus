import * as Yup from "yup";
import moment from "moment";

export const answerInputSchema = Yup.object().shape({
  answer: Yup.string()
    .required("Answer is required.")
    .min(50, "Answer must be at least 50 characters.")
    .max(600, "Answer cannot exceed 600 characters."),
});

export const bookingInputValidation = Yup.object().shape({
  message: Yup.string()
    .required("message field is required")
    .min(20, "message must be atleast 20 characters")
    .max(300, "message can't be longer than 300 characters"),
});


const oneMonthLater = moment().add(1, "month").toDate();

export const timeSlotSchema = Yup.object().shape({
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string()
    .required("End time is required")
    .test("is-after-start", "End time must be after start time", function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return false;
      return moment(value, "HH:mm").isAfter(moment(startTime, "HH:mm"));
    })
    .test("is-not-equal", "Start time and End time cannot be the same", function (value) {
      const { startTime } = this.parent;
      return startTime !== value;
    })
    .test("min-30-minutes", "Need 30 minutes difference", function (value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return false;
      return moment(value, "HH:mm").diff(moment(startTime, "HH:mm"), "minutes") >= 30;
    }),
    
});
export const baseScheduleSchema = Yup.object().shape({
  startDate: Yup.date()
  .required("Date is required")
  .min(new Date(), "Date must be in the future")
  .max(oneMonthLater, "Cannot be more than one month ahead")
    .transform((value, originalValue) =>
      typeof originalValue === "string" ? new Date(originalValue) : value
    ),

  price: Yup.number()
  .typeError("Price must be a number")
    .required("Price is required")
    .positive("Must be a positive value")
    .integer("Must be an integer")
    .min(10, "Quantity must be at least 10"),

  slots: Yup.array()
    .of(timeSlotSchema)
    .min(1, "At least one time slot is required"),
});

export const scheduleSchema = Yup.lazy((values) => {
  if (values?.selectedDays) {
    return baseScheduleSchema.shape({
      endDate: Yup.date()
        .transform((value, originalValue) =>
          typeof originalValue === "string" ? new Date(originalValue) : value
        )
        .min(Yup.ref("startDate"), "End date must be after start date")
        .max(oneMonthLater, "Cannot be more than one month ahead")
        .test("min-3-days", "End date must be at least 3 days after start date", function (endDate) {
          const { startDate } = this.parent;
          if (!startDate || !endDate) return false;
          return (
            new Date(endDate).getTime() - new Date(startDate).getTime() >= 3 * 24 * 60 * 60 * 1000
          );
        })
        .required("End date is required"),

      selectedDays: Yup.array()
        .of(Yup.string())
        .min(1, "At least one day must be selected"),
    });
  }
  return baseScheduleSchema;
});
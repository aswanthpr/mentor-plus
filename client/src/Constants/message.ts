export const ROUTES = {
  MENTEE_SINGUP:'/auth/signup',
  MENTEE_LOGIN: "/auth/login/mentee",
  MENTEE_HOME: "/mentee/home",
  MENTEE_EXPLORE: "/mentee/explore",
  MENTEE_BOOKING: "/mentee/bookings",

  ADMIN_MGT_VERIFIED: "/admin/mentor_management/verified",
  ADMIN_MGT_NOT_VERIFIED: "/admin/mentor_management/not_verified",
  ADMIN_DASHBOARD: "/admin/dashboard",

  MENTOR_HOME: "/mentor/home",
  MENTOR_LOGIN: "/auth/login/mentor",
  MENTOR_APPLY:'/auth/apply_as_mentor',

  ADMIN_LOGIN :'/auth/login/admin',
};
//========================
export const Messages = {
  FIILE_LIMIT_EXCEED: "File size exceeds the 5MB limit.",
  OTP_REQUIRED: "OTP is required",
  OTP_MUSTBE_6: "OTP must be 6 digits",
  OTP_MUST_BE_NUMBERS: "OTP must contain only numbers",
  EMAIL_OTP_ERROR: "Please enter a valid email address before sending OTP",
  OTP_FAILED_TO_SEND: "Failed to send OTP",
  OTP_RESEND_SUCCESS:"OTP resend successfull",

  NORMAL_TIMESLOT_LIMIT: "You can only add up to 10 time slots.",
  TIME_SLOT_CANNOT_OVERLAP: "Time slots cannot overlap",
  SELECT_A_SLOT:"Please select a time slot",

  GOOGLE_AUTH_FAIL_MESSAGE:
    "This email is already registered with a different provider",
  CATEGORY_ADD_INPUT_VALIDATION:
    "Category must be between 3 and 50 letters, and no symbols or numbers are allowed.",
  CATEGORY_EDIT_INPUT_VALIDATION:
    "Category must be between 3 and 20 letters, and no symbols or numbers are allowed.",
  CATEGORY_EXIST: "Category already exists. Please choose a different name.",

  CREDENTIAL_NOT_FOUND: "Credential not found",

  MENTOR_APPLY_INFO:
    '"Your application is currently under review. Once verified, you will receive a notification via email within 3 working days. Have a great day!"',
    FILE_CHANGE_ERROR:"invalid file type",

    NO_CHANGES_IN_FILE:"No changes detected. Please modify the question before updating.",

    UNEXPECTED_ERROR:"Unexpected error occured",

    CREATED_SESSION_CODE:"successfully created SessionCode ✔️",

    WITHDRAW_LIMIT:"amount cannot be less than $500",
    NOT_ENOUGH_FUND:"Not enough balance",

    SIGNUP_SUCCESS:'Signin Successfull!',
};
export const SESSION_STATUS = {
  CANCEL_REQUESTED: "CANCEL_REQUESTED",
  CONFIRMED:"CONFIRMED",
  COMPLETED:"COMPLETED",
  CANCELLED:"CANCELLED",
  REJECTED:"REJECTED",
  RESCHEDULED:"RESCHEDULED"
} 
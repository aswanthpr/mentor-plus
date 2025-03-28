export const HttpResponse = { 
    SERVER_ERROR: "Internal server error", 
    PHONE_EXIST:"Phone number exist",
    
    PAGE_NOT_FOUND: "Route not found",
    ADMIN_NOT_ALLOWEDED:"Admin not alloweded",
    
    PASSWORD_CHANGE_SUCCESS: "Password changed successfully!",
    PASSWORD_INCORRECT: "Incorrect password, try again",
    NEW_PASS_REQUIRED:"new password cannot be same as current password",
    NO_TOKEN: "Token not provided",
    TOKEN_EXPIRED: "Your session has expired!",
    UNAUTHORIZED: "Unauthorized access!",
    TOKEN_GENERATED:"Token refreshed",
    
    OTP_INCORRECT: "Incorrect otp, try again",
    OTP_NOT_FOUND: "Otp not found",
    OTP_SEND_TO_MAIL:"OTP successfully sent to mail",
    OTP_FAILED_TO_SEND:"OTP failed to send",
    
    INVALID_USER_ROLE:"Invalid user role",
    USER_BLOCKED:"User blocked..",
    USER_NOT_FOUND: "User not found",
    USER_EXIST: "User already exist",
    USER_CREATION_FAILED: "User creation failed",
    USER_VERIFIED:"User verifed!",
    USER_CREATION_SUCCESS: "User created successfully",
    USERNAME_EXIST: "Username Already Exist",
  
    
    INVALID_CREDENTIALS: "Invalid credentials",
    EMAIL_EXIST: "Email already exist",
    INVALID_EMAIL: "Invalid email address",
    UNEXPECTED_KEY_FOUND: "Unexpected key found",

    RESOURCE_NOT_FOUND:"Resource not found",
    RESOURCE_UPDATED: "Resource updated.",
    RESOURCE_FOUND: "Resource found.",
    RESOURCE_UPDATE_FAILED:"Resource updation failed",
    PROFILE_PICTURE_CHANGED: "Profile picture changed successfully",
    DUPLICATE_TIME_SLOT:"Duplicate time slots",
    NO_PAYLOAD: "Payload not found",

    NO_SLOT_AVAIL_TO_CREATE:"Duplicate slot found ",
    SLOTS_CREATED:"slots created",
    
    CATEOGRY_EXIST:"category existing",
    CATEGORY_CREATED:"Category created!",
    CATEGORY_NOTFOUND:"Category not found",
    CATEGORY_EDITED:"Category edited successfully",
    
    DATA_RETRIEVED:"Data retrieved!",
    
    CHANGES_APPLIED:"Changes applied!",
    LOGIN_WITH_GOOGLE:"Plase login with google",
    
    FAILED:"Failed!",
    SUCCESS:"Success",
    
    
    APPLICATION_SUBMITTED:"Application submitted!",
    MENTEE_NOTIFICATION:`You're on our waitlist!
                       Thanks for signing up for MentorPlus.
                        We're focused on creating the best experience possible for everyone on the site.`,

    SESSION_COMPLETED:"Session marked as completed",
    SESSION_CODE_CREATED:"Session code created!",
    SLOT_CANCEL_REQUESTED:"Requested!",

    SOMETHING_WENT_WRONG:"something went wrong",

    SLOT_BOOKED:"Slot booked!",

    INSUFFICINET_BALANCE:"Insufficient balance",
    APPLIED_FOR_WITHDRAW:"withdraw Requested",
    PAYMENT_INTENT_CREATED:"payment intent created",

    WEBHOOK_SIGNATURE_MISSING:'Missing signature or body data in webhook request.',
    REVIEW_NOT_CREATED:"whoops... ,review not created",
    REVIEW_CREATED:"review created!",

    QUESTION_EXIST:"Question already exist",

    END_TIME_PAST:"The End Time is Befor Start Time",
    START_DATE_CANNOT_BE_PAST:"Start date cannot be in the past.",
    DURATION_DIFFERNT_REQUIRED:"The time duration must be between 30 and 60 minutes.",
    DATE_CANNOT_BE_PAST:"The given date is in the past.",
    TIME_DIFF_REQUIRED: "Time difference is not in between 20 to 60.",

  } as const ;

export  const NOTIFY = {
MENTEE_WELCOME:`Start exploring and connect with mentors today.`,
ADMIN_NEW_MENTOR_NOTIFY:"Applied as mentor. Please review their profile and verify",
EARNING_CREDITED:"Earnings Credited",
EARNING_CREDIT_MESSAGE:"your earnings credited to your wallet.have a nice day",
EARNINGS_CREDITED_TO_WALLET:"Earnings credited to wallet",
CANCELLD_AMOUNT_CREDIT:"Cancellation amount refunded",
PAYMENT_ATTEMPT_FALED:`Your payment attempt failed. Please try again.`,
PAYMENT_FAILED:`Payment Failed`,

SLOT_SCHEDULED:`new slot were scheduled . checkout now`,
SLOT_SCHEDULE_TITLE: `Your new slot were Scheduled`
  }

  export const USER = {
    MENTEE:"mentee",
    MENTOR:"MENTOR",
    ADMIN:"admin",
  }
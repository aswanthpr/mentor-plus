export const PASSWORD_ERROR_INITIAL: IPass = {
  newPassword: "",
  confirmPassword: "",
};
export const RECURRING_SCHEDULE_INITIAL = {
  startDate: "",
  endDate: "",
  slots: [{ startTime: "", endTime: "" }],
  selectedDays: [],
  price: null,
};
export const initialState: IBookingError = {
  message: "",
  wallet: "",
  stripe: "",
};
export const MENTE_PROFILE_PASS_CHANGE = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};
export const FITLER_VALUE_INITIAL = {
  sort: "",
  domain: [],
  skill: [],
};

export const EDIT_CATEGORY = {
  _id: "",
  category: "",
};
export const ADMIN_DASH_INITIAL_VALUE = {
  totalRevenue: 0,
  totalBookings: 0,
  totalCancelledBookings: 0,
  uniqueMentorsThisMonth: 0,
  yearly: [{ year: 0, revenue: 0, sessions: 0 }],
  monthly: [{ month: 0, revenue: 0, sessions: 0 }],
  weekly: [{ week: 0, revenue: 0, sessions: 0 }],
  categoryDistribution: [
    { category: "", value: 0 },
    { category: "", value: 0 },
  ],
  topMentors: [
    {
      mentorId: "",
      mentorName: "",
      totalSessions: 0,
      totalRevenue: 0,
      category: "",
      averageRating: 0,
      profileUrl: "",
    },
  ],
};
export const ADMIN_LOGIN_ERROR = {
  email: "",
  password: "",
};

export const MENTEE_LOGIN_FORMDATA = {
  email: "",
  password: "",
};

export const MENTOR_APPLY_INITIAL = {
  formData: {
    name: "",
    email: "",
    password: "",
    phone: "",
    jobTitle: "",
    category: "",
    linkedinUrl: "",
    githubUrl: "",
    bio: "",
    skills: [],
    resume: null,
    profileImage: null,
  },
  errors: {
    name: "",
    email: "",
    password: "",
    phone: "",
    jobTitle: "",
    category: "",
    linkedinUrl: "",
    githubUrl: "",
    bio: "",
    skills: "",
    resume: "",
    profileImage: "",
  },
};
export const MENTEE_SIGNUP_FORM_INIT = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
export const FILTERS_EXPLORE = { categories: [], skills: [], rating: 0 };
export const ANSWER_EDIT = {
  content: "",
  answerId: "",
};
export const MENTEE_PROFILE_FORMDATA = {
  _id: "",
  name: "",
  email: "",
  phone: "",
  bio: "",
  profileUrl: "",
  linkedinUrl: "",
  githubUrl: "",
  education: "",
  currentPosition: "",
  isBlocked: false,
  verified: true,
  provider: "email",
};

export const MENTEE_PROFILE_ERROR = {
  name: "",
  email: "",
  phone: "",
  linkedinUrl: "",
  githubUrl: "",
  bio: "",
  education: "",
  currentPosition: "",
};
export const MENTEE_EDIT_PASSWORD = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};
export const WALLET_DATA ={
    _id: "",
    userId: "",
    balance: "",
    transaction: [],
  }
export const MENTOR_PROFILE_FORM_INITIAL={
    _id: "",
    name: "",
    email: "",
    phone: "",
    bio: "",
    linkedinUrl: "",
    githubUrl: "",
    jobTitle: "",
    category: "",
    skills: [],
    resume: null,
  }
  export const MENTOR_PROFILE_FORM_ERROR_INITIAL={
      name: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      githubUrl: "",
      bio: "",
      jobTitle: "",
      category: "",
      skills: "",
      resume: "",
    }
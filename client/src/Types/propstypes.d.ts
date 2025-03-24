
interface StatusBadgeProps {
  status: "active" | "inactive" | "verified" | "not-verified" | "blocked";
}
interface ICategModal {
  heading: JSX.Element | string;
  category: string;
  handleCategoryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
  handleCloseModal: () => void;
  handleSave: () => void;
  reference: React.RefObject<HTMLInputElement>;
}
interface IPassChange {
  onSubmit: (password: string) => void;
}
interface IFileUpload {
  onFileSelect: (file: File) => void;
  accept?: string;
}
interface ImageCroper {
  imageFile: File;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}
interface InputFieldProps {
  label?: string;
  type: string;
  id?: string;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  className?: string;
  name?: string;
  min?: string | number;
  max?: string | number;
}
interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  onResendOtp: () => void;
}
interface IOtpinput {
  value: string;
  onChange: (value: string) => void;
}
interface IProfileImageUpload {
  onImageChange: (image: Blob | null) => void;
}
interface ISkill {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  maxSkills?: number;
}
interface BookingData {
  time: string;
  bookings: number;
}

interface BookingTrendsProps {
  data: BookingData[];
}
interface CategoryData {
  category: string;
  value: number;
}

interface CategoryDistributionProps {
  data: CategoryData[];
  colors: string[];
}
// Interface for session data
interface CumulativeSessionData {
  revenue: number;
  cumulativeRevenue: number;
  month: number;
  year?: number;
}

// Interface for transformed growth data
interface GrowthData {
  month: string;
  revenue: number;
  cumulative: number;
}

// Props interface
interface GrowthTrendProps {
  data: CumulativeSessionData[];
}
interface RevenueChartProps {
  data: RevenueData[];
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}
interface TopMentorsProps {
  mentors: ItopMentors[];
}
interface Session {
  id: string;
  mentorName: string;
  mentorAvatar: string;
  date: string;
  time: string;
  duration: number;
  topic: string;
  status: "scheduled" | "completed" | "cancelled";
  rating?: number;
  review?: string;
}
interface SessionCardProps {
  session: Session;
  handleCancelSession: (sessionId: string) => void;
}
interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (rating: number, review: string) => void;
  session?: ISession;
}
interface ISessionCardProps {
  session: ISession;
  role?: string;
  handleReclaimRequest?: (sessionId: string, value: string) => void;
  handleCreateSessionCode?: (sessionId: string) => void;
  handleCancelSession?: (
    sessionId: string,
    reason: string,
    customReason: string
  ) => void;
  handleCompletedSession?(sessionId: string): void;
  handleRating?: (session: ISession) => void;
  handleSessionJoin?(
    sessionId: string,
    sessionCode: string,
    role: string
  ): void;
}
interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  firstTab: string;
  secondTab: string;
}

// Reusable Toast Component
interface ToastNotificationProps {
  message: string;
  description: string;
  onReply: () => void;
  onIgnore: () => void;
  ariaLabel: string;
}
interface IHeader {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder: string;
  ToggleSideBar: () => void;
  userType: "mentor" | "mentee" | "admin";
  profileLink: string;
  logout: () => void;
  onRead: (id: string) => void;
  notifData: Inotification[];
}

interface INotificationitem {
  notification: Inotification;
  onRead: (id: string) => void;
}
interface INotificationPanel {
  isOpen: boolean;
  onClose: () => void;
  onReadNotification: (id: string) => void;
  notification: Inotification[];
}
interface INavItem {
  name: string;
  path: string;
  icon: React.FC<{ className?: string }>;
}
interface ISideBar {
  SideBarItems: INavItem[];
}

interface MentorshipPlansProps {
  mentorName: string;
  onBook: () => void;
}
interface BreadcrumbProps {
  path: { label: string; href: string }[];
}
interface MentorListByCategoryProps {
  title: string;
  mentors: IMentor[];
  onSeeAll: () => void;
}

interface ProfileHeaderProps {
  mentorData: IMentor | null;
}
interface SkillsProps {
  skills: string[];
}
interface Answer {
  id: string;
  content: string;
  author: IMentee;
  createdAt: string;
}

interface IAddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (question: IeditQuestion) => void;
  initialQuestion?: IQuestion;
  isEditing?: boolean;
}
interface AnswerInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, answerId?: string) => void;
  answerId?: string;
  receiveAnswer?: string;
}

interface QuestionFilterProps {
  activeFilter:TquestionTab;
  onFilterChange: (filter:TquestionTab) => void;
}
interface QuestionListProps {
  questions: IQuestion[];
  onEditQuestion?: (questionId: string, question: IeditQuestion) => void;
  currentUserId?: string;
  onShowAnswers: (questionId: string) => void;
  onDeleteQestion?: (questionId: string) => void;
  setIsAnswerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAnswerQuestionId: React.Dispatch<React.SetStateAction<string>>;
  onEditAnswer: (content: string, answerId: string) => void;
  EditedData: { content: string; answerId: string };
  newAnswer?: Ianswer | null;
}

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags: number;
  error?: string;
}
interface BlockedDate {
  date: string;
}

interface BlockedDatesPickerProps {
  blockedDates: BlockedDate[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, date: string) => void;
}


interface RecurringScheduleFormProps {
  startDate: string;
  endDate: string;
  price: number;
  selectedDays: string[];
  timeSlots: TimeSlot[];
  errors: Record<string, string>;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onPriceChange: (price: number) => void;
  onDayToggle: (day: string) => void;
  onAddTimeSlot: () => void;
  onRemoveTimeSlot: (index: number) => void;
  onTimeSlotChange: (index: number, key: keyof TimeSlot, value: string) => void;
}
interface ScheduleTypeSelectorProps {
  value: Tmethod;
  onChange: (value: Tmethod) => void;
  classNames: string;
}
interface TimeSlotCardProps {
  day: string;
  startTime: string;
  endTime: string;
  price: string;
  onDelete: () => void;
  key: string;
}
interface IPass {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface EditPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (passwords: IPass) => void;
}
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}
interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  maxAmount: number;
}
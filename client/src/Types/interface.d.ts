interface IPass {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}
interface ICategory {
  _id: string;
  category: string;
  isBlocked: boolean;
}

interface SkillData {
  category: string;
  skills: string[];
}

interface ICategory {
  id: string;
  category: string;
  isBlocked: boolean;
}
 
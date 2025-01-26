interface Ianswer {
  _id?: string;
  answer: string;
  authorId:string;
  authorType: string;
  questionId:string;
  author?:IMentee|IMentor;
  createdAt:string;
  updatedAt:string;
  isBlocked?:boolean;
}

interface IQuestion {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  menteeId: string;
  createdAt: string;
  updatedAt: string;
  answers?: number;
  user?:IMentee;
  answerData?:Ianswer[];
  isBlocked:boolean
  
} 
interface Answer {
  id: string;
  content: string;
  isBlocked: boolean;
  createdAt: string;
  author: string;

}

interface Question {
  id: string;
  content: string;
  answers: Answer[];
  isBlocked: boolean;
  createdAt: string;
  author: string;
}
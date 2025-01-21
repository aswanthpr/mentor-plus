interface Ianswer {
  _id?: string;
  answer: string;
  authorId:string;
  authorType: string;
  questionId:string;
  author?:IMentee|IMentor;
  createdAt:string;
  updatedAt:string;
}

interface IQuestion {
  _id?: string;
  title: string;
  content: string;
  tags: string[];
  menteeId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  answers?: number;
  user?:IMentee;
  answerData?:Ianswer[];
  
}

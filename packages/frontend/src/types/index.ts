export enum Role {
  User = "User",
  Admin = "Admin",
}

export enum Language {
  C = "C",
  Go = "Go",
  Cpp = "Cpp",
  Rust = "Rust",
  Python = "Python",
}

export enum SubmissionStatus {
  Pending = "Pending",
  Compiling = "Compiling",
  Running = "Running",
  Accepted = "Accepted",
  CompileError = "CompileError",
  WrongAnswer = "WrongAnswer",
  TimeLimitExceeded = "TimeLimitExceeded",
  RunningError = "RunningError",
  MemoryLimitExceeded = "MemoryLimitExceeded",
  PresentationError = "PresentationError",
  OutputLimitExceeded = "OutputLimitExceeded",
  UnknownError = "UnknownError",
}

export type IUserInfo = {
  id: number;
  role: Role;
  email: string;
  handle: string;
};

export type IProblem = {
  id: number;
  title: string;
  // passRate: number;
  // difficulty: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type ISubmission = {
  id: number;
  code: string;
  status: SubmissionStatus;
  language: Language;
  userId: number;
  userHandle: string;
  problemId: number;
  problemTitle: string;
  createdAt: string;
};


export type IPager<T> = {
  data: T[],
  size: number,
  currentPage: number,
  hasPrevPage: boolean,
  hasNextPage: boolean
}

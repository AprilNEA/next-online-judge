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
  Error = "Error",
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
  status: string;
  handle: string;
};

export type IProblem = {
  id: number;
  title: string;
  // passRate: number;
  // difficulty: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ITestcase = {
  problem_id: number;
  is_hidden?: boolean;
  input: string;
  output: string;
};

export type ISubmission = {
  id: number;
  status: SubmissionStatus;
  language: Language;
  userId?: number;
  userHandle?: string;
  problemId: number;
  problemTitle: string;
  createdAt?: string;
};

export type IPager<T> = {
  data: T[];
  size: number;
  total: number;
  totalPages: number;
  currentPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
};

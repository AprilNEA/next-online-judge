export enum Language {
  C = "C",
  GO = "GO",
  CPP = "CPP",
  RUST = "RUST",
  PYTHON = "PYTHON",
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

export type IProblem = {
  id: number;
  title: string;
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

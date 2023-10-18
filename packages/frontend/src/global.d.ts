declare module "*.svg";

declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BASE: string;
  }
}

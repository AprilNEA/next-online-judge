export type IAuthModal = "login" | "code" | "register";

export type IAuthSlice = {
  authModal: IAuthModal;
  account?: string;
  captcha?: number;
  password?: string;
  confirmPassword?: string;
  verificationCode?: string;
  isLogin: boolean;
  errorText: string;
  verificationDelay: boolean | number;
  isForceInit: boolean;

  updateAuthModal: (authModal: IAuthModal) => void;
  updateAccount: (account: string) => void;
  updateCaptcha: (captcha: number) => void;
  updatePassword: (password: string) => void;
  updateConfirmPassword: (confirmPassword: string) => void;
  updateVerificationCode: (verificationCode: string) => void;
  updateLoginStatus: (isLogin: boolean) => void;
  updateErrorText: (errorText: string) => void;
  updateVerificationDelay: (verificationDelay: boolean | number) => void;
  updateIsForceInit: (isForceInit: boolean) => void;
};

export type IAppStore = IAuthSlice;

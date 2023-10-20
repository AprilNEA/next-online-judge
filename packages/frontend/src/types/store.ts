export type IAuthModal = "login" | "code" | "register";

export type IAuthSlice = {
  authModal: IAuthModal;
  account?: string;
  captcha?: number;
  password?: string;
  confirmPassword?: string;
  verificationCode?: number;
  isLogin: boolean;

  updateAuthModal: (authModal: IAuthModal) => void;
  updateAccount: (account: string) => void;
  updateCaptcha: (captcha: number) => void;
  updatePassword: (password: string) => void;
  updateConfirmPassword: (confirmPassword: string) => void;
  updateVerificationCode: (verificationCode: number) => void;
  updateLoginStatus: (isLogin: boolean) => void;
};

export type IAppStore = IAuthSlice;

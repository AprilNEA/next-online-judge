import { create } from "zustand";
import toast from "react-hot-toast";
import { Verification } from "next/dist/lib/metadata/types/metadata-types";
import { fetcher } from "@/utils";

export type IAuthModal = "login-phone" | "login-email" | "register";
type AuthStore = {
  authModal: IAuthModal;
  email?: string;
  captcha?: number;
  password?: string;
  confirmPassword?: string;
  verificationCode?: number;
  isLogin: boolean;

  updateAuthModal: (authModal: IAuthModal) => void;
  updateEmail: (email: string) => void;
  updateCaptcha: (captcha: number) => void;
  updatePassword: (password: string) => void;
  updateConfirmPassword: (confirmPassword: string) => void;
  updateVerificationCode: (verificationCode: number) => void;
  updateLoginStatus: (isLogin: boolean) => void;
  requestCode: () => void;
  login: () => Promise<void>;
  register: () => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  authModal: "login-phone",
  isLogin: false,
  updateAuthModal: (authModal: IAuthModal) => {
    set({ authModal });
  },
  updateEmail: (email: string) => {
    set({ email });
  },
  updateCaptcha: (captcha: number) => {
    set({ captcha });
  },
  updatePassword: (password: string) => {
    set({ password });
  },
  updateConfirmPassword: (confirmPassword: string) => {
    set({ confirmPassword });
  },
  updateVerificationCode: (verificationCode: number) => {
    set({ verificationCode });
  },
  requestCode: () => {},
  updateLoginStatus: (isLogin: boolean) => {
    set({ isLogin });
  },
  login: async () => {
    const { email, password } = get();
    if (!email) {
      toast("请输入邮箱");
    }
    if (!password) {
      toast("请输入密码");
    }
    await fetcher("/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }).then((r) => {
      r.ok ? toast("登录成功") : toast("登录失败");
    });
  },
  register: () => {
    const { email, password, confirmPassword, verificationCode } = get();
    if (!email) {
      toast("请输入邮箱");
    }
    if (!password || !confirmPassword || password != confirmPassword) {
      toast("两次输入的密码不一致");
    }
    if (!verificationCode) {
      toast("请输入验证码");
    }
  },
}));

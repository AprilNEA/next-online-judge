import {create} from 'zustand'
import toast from "react-hot-toast";

type AuthStore = {
  authModal: "login-phone" | "login-email" | "register";
  email?: string;
  captcha?: number;
  password?: string;
  confirmPassword?: string;
  updateEmail: (email: string) => void;
  updateCaptcha: (captcha: number) => void;
  updatePassword: (password: string) => void;
  updateConfirmPassword: (confirmPassword: string) => void;
  requestCode: () => void;
  login: () => void;
  register: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  authModal: "login-email",
  updateEmail: (email: string) => {
    set(email)
  },
  updateCaptcha: (captcha: number) => {
    set(captcha);
  },
  updatePassword: (password: string) => {
    set(password);
  },
  updateConfirmPassword: (confirmPassword: string) => {
    set(confirmPassword);
  },
  requestCode: () => {

  },
  login: () => {
    const {email, password} = get();
    if (!email) {
      toast("请输入邮箱");
    }
    if (!password) {
      toast("请输入密码")
    }
  },
  register: () => {

  }
}))

import { create, StateCreator } from "zustand";
import toast from "react-hot-toast";
import { fetcher } from "@/utils";
import { IAppStore, IAuthSlice, IAuthModal } from "@/types/store";

export const createAuthSlice: StateCreator<IAppStore, [], [], IAuthSlice> = (
  set,
  get,
) => ({
  isLogin: false,
  authModal: "login",
  updateAuthModal: (authModal: IAuthModal) => {
    set({ authModal });
  },
  updateAccount: (account: string) => {
    set({ account });
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
  register: () => {
    const { account, password, confirmPassword, verificationCode } = get();
    if (!account) {
      toast("请输入邮箱");
    }
    if (!password || !confirmPassword || password != confirmPassword) {
      toast("两次输入的密码不一致");
    }
    if (!verificationCode) {
      toast("请输入验证码");
    }
  },
});

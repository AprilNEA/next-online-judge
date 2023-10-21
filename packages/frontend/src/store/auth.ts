import { create, StateCreator } from "zustand";
import { IAppStore, IAuthSlice, IAuthModal } from "@/types/store";

export const createAuthSlice: StateCreator<IAppStore, [], [], IAuthSlice> = (
  set,
  get,
) => ({
  isLogin: false,
  authModal: "login",
  errorText: "",
  verificationDelay: false,
  isForceInit: false,
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
  updateVerificationCode: (verificationCode: string) => {
    set({ verificationCode });
  },
  updateLoginStatus: (isLogin: boolean) => {
    set({ isLogin });
  },
  updateVerificationDelay: (verificationDelay: boolean | number) => {
    set({ verificationDelay });
  },
  updateErrorText: (errorText: string) => {
    set({ errorText });
  },
  updateIsForceInit: (isForceInit: boolean) => {
    set({ isForceInit });
  },
});

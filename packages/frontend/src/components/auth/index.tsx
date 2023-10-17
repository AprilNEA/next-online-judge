"use client";

import { useRef, useCallback, useEffect } from "react";
import { Button, Modal, Input } from "react-daisyui";
import { IAuthModal, useAuthStore } from "@/store";

import CodeIcon from "@/icons/code.svg";
import EmailIcon from "@/icons/email.svg";
import KeyIcon from "@/icons/key.svg";
import PhoneIcon from "@/icons/phone.svg"

function LoginModal() {
  const authStore = useAuthStore.getState();

  return (
    <>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0">
        <div className="flex mr-2 items-center">
          <PhoneIcon />
        </div>
        <div className="form-control w-full max-w-xs">
          <Input
            type="text"
            value={authStore.email}
            placeholder="Phone number"
            onChange={(e) => {
              authStore.updateEmail(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0 pt-0">
        <div className="flex mr-2 items-center">
          <KeyIcon />
        </div>
        <div className="form-control w-full max-w-xs">
          <Input
            type="password"
            value={authStore.password}
            placeholder="Password"
            onChange={(e) => {
              authStore.updatePassword(e.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
}

function RegisterModal() {
  const authStore = useAuthStore.getState();

  return (
    <>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0">
        <div className="flex mr-2 items-center">
          <EmailIcon />
        </div>
        <div className="form-control w-full max-w-xs">
          <Input
            type="text"
            value={authStore.email}
            placeholder="Li.Hua23@student.xjtlu.edu.cn"
            onChange={(e) => {
              authStore.updateEmail(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0 pt-0">
        <div className="flex mr-2 items-center">
          <KeyIcon />
        </div>
        <div className="form-control w-full max-w-xs">
          <Input
            type="password"
            value={authStore.password}
            placeholder="Password"
            onChange={(e) => {
              authStore.updatePassword(e.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default function AuthModal() {
  const authStore = useAuthStore.getState();

  const ref = useRef<HTMLDialogElement | null>(null);
  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  const renderText = {
    title: {
      "login-email": "登录",
      "login-phone": "登录",
      register: "注册",
    },
    left: {
      "login-email": "注册",
      "login-phone": "注册",
      register: "登录",
    },
    right: {
      "login-email": "登录",
      "login-phone": "登录",
      register: "注册",
    },
  } as const;

  return (
    <>
      <Button onClick={handleShow}>登录</Button>

      <Modal ref={ref} suppressHydrationWarning>
        <Modal.Header className="font-bold text-2xl items-center flex justify-center mb-3 pl-3">
          {renderText.title[authStore.authModal]}
          <Button className="btn-ghost ml-auto px-2">
            <CodeIcon />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <LoginModal />
        </Modal.Body>
        <Modal.Actions className="flex justify-between">
            <Button
              className="btn-ghost"
              onClick={() =>
                authStore.updateAuthModal(
                  authStore.authModal == "login-phone"
                    ? "register"
                    : "login-email",
                )
              }
            >
              {renderText.left[authStore.authModal]}
            </Button>
            <div className="flex">
            <form method="dialog">
              <Button className="btn-ghost mr-1">取消</Button>
            </form>
            <Button
              className="bg-black text-white hover:bg-gray-500"
              // onClick={}
            >
              {renderText.right[authStore.authModal]}
            </Button>
          </div>
        </Modal.Actions>
      </Modal>
    </>
  );
}

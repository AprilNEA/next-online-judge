"use client";

import { useRef, useCallback } from "react";
import { Button, Modal, Input } from "react-daisyui";
import { useAppStore } from "@/store";

import CodeIcon from "@/icons/code.svg";
import EmailIcon from "@/icons/email.svg";
import KeyIcon from "@/icons/key.svg";
import PhoneIcon from "@/icons/phone.svg";

function LoginForm() {
  const authStore = useAppStore.getState();

  return (
    <>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0">
        <div className="flex mr-2 items-center">
          <PhoneIcon />
        </div>
        <div className="form-control w-full max-w-xs">
          <Input
            type="text"
            value={authStore.account}
            placeholder="Phone number"
            onChange={(e) => {
              authStore.updateAccount(e.target.value);
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

function RegisterForm() {
  const {
    account,
    updateAccount,
    password,
    updatePassword,
    confirmPassword,
    updateConfirmPassword,
  } = useAppStore.getState();

  return (
    <>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0">
        <div className="flex mr-2 items-center">
          <EmailIcon />
        </div>
        <div className="form-control w-full max-w-xs">
          <Input
            type="text"
            value={account}
            placeholder="Li.Hua23@student.xjtlu.edu.cn"
            onChange={(e) => {
              updateAccount(e.target.value);
            }}
          />
        </div>
      </div>
      {[
        { value: password, updater: updatePassword },
        {
          value: confirmPassword,
          updater: updateConfirmPassword,
        },
      ].map((item) => (
        <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0 pt-0">
          <div className="flex mr-2 items-center">
            <KeyIcon />
          </div>
          <div className="form-control w-full max-w-xs">
            <Input
              type="password"
              value={item.value}
              placeholder="Password"
              onChange={(e) => {
                item.updater(e.target.value);
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
}

function CodeForm() {
  return <div>WIP</div>;
}

export default function AuthModal() {
  const { authModal, updateAuthModal } = useAppStore();

  const ref = useRef<HTMLDialogElement | null>(null);
  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  const renderText = {
    title: {
      code: "登录",
      login: "登录",
      register: "注册",
    },
    left: {
      code: "注册",
      login: "注册",
      register: "登录",
    },
    right: {
      code: "登录",
      login: "登录",
      register: "注册",
    },
    form: {
      code: <CodeForm />,
      login: <LoginForm />,
      register: <RegisterForm />,
    },
  } as const;

  function handleAuth() {}

  return (
    <>
      <Button onClick={handleShow}>登录</Button>

      <Modal ref={ref} suppressHydrationWarning>
        <Modal.Header className="font-bold text-2xl items-center flex justify-center mb-3 pl-3">
          {renderText.title[authModal]}
          <Button
            className="btn-ghost ml-auto px-2"
            onClick={() => updateAuthModal("code")}
          >
            <CodeIcon />
          </Button>
        </Modal.Header>
        <Modal.Body>{renderText.form[authModal]}</Modal.Body>
        <Modal.Actions className="flex justify-between">
          <Button
            className="btn-ghost"
            onClick={() =>
              updateAuthModal(authModal == "login" ? "register" : "login")
            }
          >
            {renderText.left[authModal]}
          </Button>
          <div className="flex">
            <form method="dialog">
              <Button className="btn-ghost mr-1">取消</Button>
            </form>
            <Button
              className="bg-black text-white hover:bg-gray-500"
              onClick={handleAuth}
            >
              {renderText.right[authModal]}
            </Button>
          </div>
        </Modal.Actions>
      </Modal>
    </>
  );
}

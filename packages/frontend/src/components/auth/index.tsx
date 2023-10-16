"use client";

import { useRef, useCallback } from "react";
import { Button, Modal, Input } from "react-daisyui";
import { useAuthStore } from "@/store";

import CodeIcon from "@/icons/code.svg";
import EmailIcon from "@/icons/email.svg";
import KeyIcon from "@/icons/key.svg";

const authStore = useAuthStore.getState();

function LoginModal() {
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

function RegisterModal() {
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
  const ref = useRef<HTMLDialogElement | null>(null);
  const handleShow = useCallback(() => {
    ref.current?.showModal();
  }, [ref]);

  return (
    <>
      <Button onClick={handleShow}>登录</Button>

      <Modal ref={ref} suppressHydrationWarning>
        <Modal.Header className="font-bold text-2xl items-center flex justify-center mb-3 pl-3">
          {authStore.authModal == "login-phone"
            ? "扫码登陆"
            : authStore.authModal == "login-email"
            ? "登录"
            : authStore.authModal == "register"
            ? "注册"
            : "undefined"}
          <Button className="btn-ghost ml-auto px-2">
            <CodeIcon />
          </Button>
        </Modal.Header>
        <Modal.Body>
          <LoginModal />
        </Modal.Body>
        <Modal.Actions className="justify-between">
          <Button className="btn-ghost">注册</Button>
          <div className="flex">
            <form method="dialog">
              <Button className="btn-ghost">取消</Button>
            </form>
            {authStore.authModal == "login-phone" ? (
              ""
            ) : authStore.authModal == "login-email" ? (
              <Button className="bg-black text-white hover:bg-gray-500">
                登录
              </Button>
            ) : authStore.authModal == "register" ? (
              "注册"
            ) : (
              <Button className="bg-black text-white hover:bg-gray-500">
                注册
              </Button>
            )}
          </div>
        </Modal.Actions>
      </Modal>
    </>
  );
}

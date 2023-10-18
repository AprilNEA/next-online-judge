"use client";

import { Button, Modal, Input } from "react-daisyui";
import { useAppStore } from "@/store";

import CodeIcon from "@/icons/code.svg";
import EmailIcon from "@/icons/email.svg";
import KeyIcon from "@/icons/key.svg";
import PhoneIcon from "@/icons/phone.svg";
import toast, { Toaster } from "react-hot-toast";
import { fetcher } from "@/utils";
import { useMemo } from "react";

function LoginForm() {
  const { account, updateAccount, password, updatePassword } = useAppStore();

  return (
    <>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0">
        <div className="flex mr-2 items-center">
          <PhoneIcon />
        </div>
        <div className="form-control w-full max-w-xs">
          <Input
            type="text"
            value={account}
            placeholder="Phone number"
            onChange={(e) => {
              updateAccount(e.target.value);
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
            value={password}
            placeholder="Password"
            onChange={(e) => {
              updatePassword(e.target.value);
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
  } = useAppStore();

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
        { name: "Password", value: password, updater: updatePassword },
        {
          name: "Confirm Password",
          value: confirmPassword,
          updater: updateConfirmPassword,
        },
      ].map((item) => (
        <div
          key={item.name}
          className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0 pt-0"
        >
          <div className="flex mr-2 items-center">
            <KeyIcon />
          </div>
          <div className="form-control w-full max-w-xs">
            <Input
              type="password"
              value={item.value}
              placeholder={item.name}
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

function AuthModal({ hide }: { hide: () => void }) {
  const { authModal, updateAuthModal, account, password } = useAppStore();

  const render = useMemo(
    () => ({
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
    }),
    [authModal],
  );

  async function handleAuth() {
    switch (authModal) {
      case "login":
        if (!account) toast("请输入账户/邮箱/手机号");
        if (!password) toast("请输入密码");
        const toastId = toast.loading("登录中...", {
          style: {
            minWidth: "250px",
          },
        });
        await fetcher("/user/login", {
          method: "POST",
          body: JSON.stringify({
            email: account,
            password,
          }),
        }).then((res) => {
          if (res.ok) {
            toast("登录成功", {
              id: toastId,
              icon: "🔥",
              duration: 5000,
            });
            hide();
          } else {
            toast("登录失败");
          }
        });
        toast.dismiss();
    }
  }

  return (
    <>
      <Modal.Header className="font-bold text-2xl items-center flex justify-center mb-3 pl-3">
        {render.title[authModal]}
        <Button
          className="btn-ghost ml-auto px-2"
          onClick={() => updateAuthModal("code")}
        >
          <CodeIcon />
        </Button>
      </Modal.Header>
      <Modal.Body>{render.form[authModal]}</Modal.Body>
      <Modal.Actions className="flex justify-between">
        <Button
          className="btn-ghost"
          onClick={() =>
            updateAuthModal(authModal == "login" ? "register" : "login")
          }
        >
          {render.left[authModal]}
        </Button>
        <div className="flex">
          <form method="dialog">
            <Button className="btn-ghost mr-1">取消</Button>
          </form>
          <Button
            className="bg-black text-white hover:bg-gray-500"
            onClick={handleAuth}
          >
            {render.right[authModal]}
          </Button>
        </div>
      </Modal.Actions>
    </>
  );
}

export default function Auth() {
  const { Dialog, handleShow, handleHide } = Modal.useDialog();

  return (
    <>
      <Button onClick={handleShow}>登录</Button>

      <Dialog className="z-5000" backdrop={true}>
        <AuthModal hide={handleHide} />
      </Dialog>
    </>
  );
}

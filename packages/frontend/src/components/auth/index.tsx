"use client";

import { Button, Modal, Input, Loading } from "react-daisyui";
import { useAppStore } from "@/store";
import VerificationCodeIcon from "@/icons/verification-code.svg";
import SendIcon from "@/icons/send.svg";
import CodeIcon from "@/icons/code.svg";
import AccountIcon from "@/icons/account.svg";
import ReturnIcon from "@/icons/return.svg";
import KeyIcon from "@/icons/key.svg";
import PhoneIcon from "@/icons/phone.svg";
import toast from "react-hot-toast";
import { fetcher } from "@/utils";
import { useEffect, useMemo, useState } from "react";

function LoginForm() {
  const { account, updateAccount, password, updatePassword } = useAppStore();

  return (
    <>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0">
        <div className="flex mr-2 items-center">
          <AccountIcon />
        </div>
        <div className="form-control w-full max-w-xs">
          <Input
            type="text"
            value={account}
            placeholder="Email/Phone/Username"
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
    verificationCode,
    verificationDelay,
    updateVerificationDelay,
    updateErrorText,
    updateVerificationCode,
  } = useAppStore();

  useEffect(() => {
    //@ts-ignore
    let countDown;
    if (typeof verificationDelay == "number") {
      if (verificationDelay == 0) {
        updateVerificationDelay(false);
        clearInterval(countDown);
        return;
      }
      countDown = setInterval(() => {
        updateVerificationDelay(verificationDelay - 1);
      },1000);
    }

    return () => {
      //@ts-ignore
      clearInterval(countDown);
    };
  }, [verificationDelay, updateVerificationDelay]);

  async function sendVerification() {
    updateErrorText("");
    //@ts-ignore
    if (!/^[1]([3-9])[0-9]{9}$/.test(account)) {
      updateErrorText("请输入有效的手机号");
      return;
    }
    if (typeof verificationDelay == "number" && verificationDelay) {
      updateErrorText(`还需等候${verificationDelay}才能再次发送验证码`);
      return;
    }
    if (typeof verificationDelay == "boolean" && verificationDelay) {
      updateErrorText("请求已发送，请勿重复请求！");
      return;
    }
    updateVerificationDelay(true);
    fetcher("/user/code", {
      method: "POST",
      body: JSON.stringify({
        account: account,
      }),
    })
      .then((res) => {
        if (res.ok) {
          updateVerificationDelay(60);
        }
        return res;
      })
      .then((res) => res.json())
      .then((res) => {
        if (res.delay) {
          updateVerificationDelay(res.delay);
        }
      });
  }

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
            placeholder="Phone Number"
            onChange={(e) => {
              updateAccount(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0 pt-0">
        <div className="flex mr-2 items-center">
          <VerificationCodeIcon />
        </div>
        <div className="w-full max-w-xs flex">
          <Input
            className="w-full mr-2"
            type="text"
            value={verificationCode}
            placeholder="Verification Code"
            onChange={(e) => {
              updateVerificationCode(e.target.value);
            }}
          />
          {typeof verificationDelay == "boolean" ? (
            verificationDelay ? (
              <Button disabled>
                <Loading />
              </Button>
            ) : (
              <Button onClick={sendVerification}>
                <SendIcon />
              </Button>
            )
          ) : typeof verificationDelay == "number" ? (
            <Button disabled>{`${verificationDelay}秒`}</Button>
          ) : (
            "ERR"
          )}
        </div>
      </div>
    </>
  );
}

function CodeForm() {
  return <div>WIP</div>;
}

function AuthModal({ hide }: { hide: () => void }) {
  const {
    authModal,
    updateAuthModal,
    account,
    password,
    verificationCode,
    errorText,
    updateErrorText,
    updateIsForceInit,
  } = useAppStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isForceInit } = useAppStore();
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
    [authModal]
  );

  async function handleAuth() {
    updateErrorText("");
    switch (authModal) {
      case "login":
        if (!account || !password) {
          updateErrorText("请输入用户名和密码");
          return;
        }
        await fetcher("/user/login", {
          method: "POST",
          body: JSON.stringify({
            email: account,
            password,
          }),
        }).then((res) => {
          setIsLoading(false);
          if (res.ok) {
            toast("登录成功", {
              icon: "🔥",
              duration: 5000,
              style: {
                zIndex: 10000,
              },
            });
            updateErrorText("");
            hide();
          } else {
            updateErrorText("用户名或密码不正确");
          }
        });
        break;
      case "register":
        //@ts-ignore
        if (!/^[1]([3-9])[0-9]{9}$/.test(account)) {
          updateErrorText("请输入有效的手机号");
          return;
        }
        if (!verificationCode) {
          updateErrorText("请输入验证码");
          return;
        }
        await fetcher("/user/register", {
          method: "POST",
          body: JSON.stringify({
            account: account,
            password: password,
            code: verificationCode,
          }),
        }).then((res) => {
          if (res.ok) {
            updateIsForceInit(true);
          } else {
            let r = res.json();
          }
        });
        break;
    }
  }

  if(!isForceInit) return (
    <>
      <Modal.Header className="items-center flex justify-center mb-3 pl-3">
        <div>
          <div className="font-bold text-2xl">{render.title[authModal]}</div>
          <div className="text-sm text-red-600">{errorText}</div>
        </div>
        <Button
          className="btn-ghost ml-auto px-2"
          onClick={() => {
            updateAuthModal(authModal == "code" ? "login" : "code");
            updateErrorText("");
          }}
        >
          {authModal == "code" ? <ReturnIcon /> : <CodeIcon />}
        </Button>
      </Modal.Header>
      <Modal.Body>{render.form[authModal]}</Modal.Body>
      <Modal.Actions className="flex justify-between">
        <Button
          className="btn-ghost"
          onClick={() => {
            updateAuthModal(authModal == "login" ? "register" : "login");
            updateErrorText("");
          }}
        >
          {render.left[authModal]}
        </Button>
        <div className="flex">
          <form method="dialog">
            <Button className="btn-ghost mr-1">取消</Button>
          </form>

          {!isLoading ? (
            <Button
              className="bg-black text-white hover:bg-gray-500"
              onClick={handleAuth}
            >
              {render.right[authModal]}
            </Button>
          ) : (
            <Button disabled>
              <Loading />
            </Button>
          )}
        </div>
      </Modal.Actions>
    </>
  );

  else return(
    <AccountInitModal />
  )
}

function AccountInitModal() {
  const {
    errorText,
    updateErrorText,
    password,
    updatePassword,
    confirmPassword,
    updateConfirmPassword,
    account,
  } = useAppStore();

  const [userName, setUserName] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleAccountInit() {
    updateErrorText("");
    if (!userName || !password || !confirmPassword) {
      updateErrorText("请填写全部信息");
      return;
    }
    if (password != confirmPassword) {
      updateErrorText("两次输入的密码不一致");
      return;
    }
    setIsLoading(true);
    await fetcher("/user/active", {
      method: "POST",
      body: JSON.stringify({
        password: password,
        handle: userName,
      }),
    }).then((res) => {

    });
  }

  return (
    <>
      <Modal.Header className="items-center flex justify-start mb-3 pl-3">
        <div>
          <div className="font-bold text-2xl">完成账号注册</div>
          <div className="text-sm text-red-600">{errorText}</div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0">
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
        <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0 pt-0">
          <div className="flex mr-2 items-center">
            <KeyIcon />
          </div>
          <div className="form-control w-full max-w-xs">
            <Input
              type="password"
              value={confirmPassword}
              placeholder="Confirm Password"
              onChange={(e) => {
                updateConfirmPassword(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="flex w-full component-preview p-4 items-center justify-center gap-2 font-sans px-0 pt-0">
          <div className="flex mr-2 items-center">
            <AccountIcon />
          </div>
          <div className="form-control w-full max-w-xs">
            <Input
              type="text"
              value={userName}
              placeholder="Username"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Actions className="flex justify-end mt-0">
        {!isLoading ? (
          <Button
            className="bg-black text-white hover:bg-gray-500"
            onClick={handleAccountInit}
          >
            继续
          </Button>
        ) : (
          <Button disabled>
            <Loading />
          </Button>
        )}
      </Modal.Actions>
    </>
  );
}

export default function Auth() {
  const { Dialog, handleShow, handleHide } = Modal.useDialog();

  return (
    <>
      <Button onClick={handleShow}>登录</Button>
      <Dialog>
        <AuthModal hide={handleHide} />
      </Dialog>
    </>
  );
}

export const SESSION_ID_COOKIE_NAME = 'FART';

export const parseSessionId = (cookie: string) => {
  const sessionIdMatch = cookie.match(
    new RegExp(`${SESSION_ID_COOKIE_NAME}=([^;]+)(;|$)`),
  );
  return sessionIdMatch ? sessionIdMatch[1] : null;
};

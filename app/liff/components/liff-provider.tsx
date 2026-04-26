"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface LiffContext {
  liff: typeof import("@line/liff").default | null;
  isLoggedIn: boolean;
  idToken: string | null;
  profile: { displayName: string; pictureUrl?: string } | null;
  error: string | null;
  debugInfo: string;
}

const LiffContext = createContext<LiffContext>({
  liff: null,
  isLoggedIn: false,
  idToken: null,
  profile: null,
  error: null,
  debugInfo: "",
});

export function useLiff() {
  return useContext(LiffContext);
}

export function LiffProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LiffContext>({
    liff: null,
    isLoggedIn: false,
    idToken: null,
    profile: null,
    error: null,
    debugInfo: "初期化開始前",
  });

  useEffect(() => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
    if (!liffId) {
      setState((prev) => ({ ...prev, error: "LIFF ID が設定されていません", debugInfo: "LIFF ID なし" }));
      return;
    }

    setState((prev) => ({ ...prev, debugInfo: `LIFF ID: ${liffId} / import中...` }));

    import("@line/liff")
      .then((liffModule) => liffModule.default)
      .then(async (liff) => {
        setState((prev) => ({ ...prev, debugInfo: "liff.init() 呼び出し中..." }));
        await liff.init({ liffId });

        const isInClient = liff.isInClient();
        const isLoggedIn = liff.isLoggedIn();
        const os = liff.getOS();
        const info = `init完了 / isInClient: ${isInClient} / isLoggedIn: ${isLoggedIn} / OS: ${os}`;

        if (!isLoggedIn) {
          setState((prev) => ({ ...prev, debugInfo: `${info} → login() 呼び出し` }));
          liff.login();
          return;
        }

        setState((prev) => ({ ...prev, debugInfo: `${info} → プロフィール取得中...` }));

        const idToken = liff.getIDToken();
        const profile = await liff.getProfile();

        setState({
          liff,
          isLoggedIn: true,
          idToken,
          profile: {
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl,
          },
          error: null,
          debugInfo: `${info} → 完了`,
        });
      })
      .catch((err) => {
        setState((prev) => ({
          ...prev,
          error: `LIFF 初期化エラー: ${err.message}`,
          debugInfo: `エラー: ${err.message} / ${err.stack?.slice(0, 200)}`,
        }));
      });
  }, []);

  return <LiffContext.Provider value={state}>{children}</LiffContext.Provider>;
}

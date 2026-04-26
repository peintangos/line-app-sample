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
}

const LiffContext = createContext<LiffContext>({
  liff: null,
  isLoggedIn: false,
  idToken: null,
  profile: null,
  error: null,
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
  });

  useEffect(() => {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
    if (!liffId) {
      setState((prev) => ({ ...prev, error: "LIFF ID が設定されていません" }));
      return;
    }

    import("@line/liff")
      .then((liffModule) => liffModule.default)
      .then(async (liff) => {
        await liff.init({ liffId });
        const isLoggedIn = liff.isLoggedIn();

        if (!isLoggedIn) {
          liff.login();
          return;
        }

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
        });
      })
      .catch((err) => {
        setState((prev) => ({
          ...prev,
          error: `LIFF 初期化エラー: ${err.message}`,
        }));
      });
  }, []);

  return <LiffContext.Provider value={state}>{children}</LiffContext.Provider>;
}

import React from "react";
/**
 * 
 */

/**
 * beforeinstallpromptイベント型
 */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

//NONE, CHECK_UPDATE
export interface Pwa {
  /** インストールできるかどうかを取得する */
  canInstall: boolean;
  /** インストールする。インストールできない場合、何もしない。 */
  install: () => void;
  /** 自身がインストールされたアプリかどうかを取得する */
  isInstalledApp: boolean;
  /** updateする。updateが不要な場合は何もしない */
  update: () => Promise<void>;
}

/**
 * アップデートする。
 */
const update = async () => {
  if(navigator && navigator.serviceWorker){
    const registration = await navigator.serviceWorker.getRegistration();
    if(registration){
      registration.update();
    }
  } 
}
/**
 * コンテキスト
 */
const PwaContext = React.createContext<Pwa>({
  canInstall: false,
  install: () => {},
  isInstalledApp: false,
  update: async () => {},
})

export const PwaProvider = (
  props: {
    autoUpdate?: boolean,
    children: React.ReactNode,

  }
) => {
  const autoUpdate = props.autoUpdate ?? false;
  
  const [pwa, setPwa] = React.useState({
    canInstall: false,
    install: () => {},
    isInstalledApp: window.matchMedia('(display-mode: standalone)').matches,
    update: update
  });
  //■beforeinstallpromptイベントのハンドラ。eventをstateに保持。
  // useEffect内でイベント登録し、cleanするために外だしで定義。
  const onBeforeInstallPrompt = (e: any) => {
    e.preventDefault();
    setPwa({
      canInstall: true,
      install: () => {(e as BeforeInstallPromptEvent).prompt();},
      isInstalledApp: window.matchMedia('(display-mode: standalone)').matches,
      update: update
    });
  };
  const onAppinstalled  = (e: any) => {
    e.preventDefault();
    window.location.reload();
  };

  //■beforeinstallpromptのイベント登録
  React.useEffect(() => {
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppinstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppinstalled);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //■自動更新チェック
  const onWindowFocus = (e: any) => {
    if(autoUpdate){
      update();
    }
  };
  React.useEffect(() => {
    window.addEventListener('focus', onWindowFocus);
    return () => {
      window.removeEventListener("focus", onWindowFocus);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoUpdate]);


  return (
    <PwaContext.Provider value={pwa}>
      {props.children}
    </PwaContext.Provider>
  );
};

export const usePwa = (): Readonly<Pwa> => {
  const pwa = React.useContext(PwaContext);
  return pwa;
};
import React from "react";
import { useHistory } from "react-router-dom";
import { PageLayout } from "../layout/pageLayout";
import { usePwa } from "../lib/pwa";
import styles from "./homePage.module.scss";

export const HomePage = function(
  props: {
  }
) 
{
  const pwa = usePwa();
  const history = useHistory();
  return (
    <PageLayout title="Home">
      <div className={styles.root}>
        {
          pwa.isInstalledApp ? <>PWA</> 
          : pwa.canInstall ? <button onClick={e => {e.preventDefault(); pwa.install();}}>インストール</button>
          : <>インストール済み</>
        }
        <br />
        <a href="/test1">test1(link)</a><br />
        <a onClick={e => {e.preventDefault(); history.push("/test1")}}>test1(navigate)</a><br />
      </div>
    </PageLayout>
  )
}


export const HomePage_BK = function(
  props: {
  }
) 
{
  const [beforeInstallPromptEvent, setBeforeInstallPromptEvent] = React.useState<BeforeInstallPromptEvent | undefined>(undefined);
   
  //■beforeinstallpromptイベントのハンドラ。eventをstateに保持。
  // useEffect内でイベント登録し、cleanするために外だしで定義。
  const onBeforeInstallPrompt = (e: any) => {
    e.preventDefault();
    setBeforeInstallPromptEvent(e as BeforeInstallPromptEvent);
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
  }, []);

  return (
    <PageLayout title="Home3">
      <div className={styles.root}>
        {
          beforeInstallPromptEvent != null ?
            <button onClick={e => {e.preventDefault(); beforeInstallPromptEvent.prompt();}}>インストール</button>
          : window.matchMedia('(display-mode: standalone)').matches ? <>PWA</> : <>インストール済み3</>
        }
        <div>xcvbcv
        <a href={window.location.origin + process.env.PUBLIC_URL }>test</a>
        </div>
      </div>
    </PageLayout>
  )
}


interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}
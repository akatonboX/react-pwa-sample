import React from "react";
import { PageLayout } from "../layout/pageLayout";
import styles from "./homePage.module.scss";
export const HomePage = function(
  props: {
  }
) 
{
  const [beforeInstallPromptEvent, setBeforeInstallPromptEvent] = React.useState<BeforeInstallPromptEvent | undefined>(undefined);
   
  //■beforeinstallpromptイベントのハンドラ。eventをstateに保持。
  // useEffect内でイベント登録し、cleanするために外だしで定義。
  const onBeforeInstallPrompt = (e: any) => {
    console.log("★onBeforeInstallPrompt")
    e.preventDefault();
    setBeforeInstallPromptEvent(e as BeforeInstallPromptEvent);
  };

  //■beforeinstallpromptのイベント登録
  React.useEffect(() => {
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  return (
    <PageLayout title="Home">
      <div className={styles.root}>
        {
          beforeInstallPromptEvent != null ?
            <button onClick={e => {e.preventDefault(); beforeInstallPromptEvent.prompt();window.location.reload();}}>インストール</button>
          : window.matchMedia('(display-mode: standalone)').matches ? <>PWA</> : <>インストール済み</>
        }
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
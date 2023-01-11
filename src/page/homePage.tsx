import React from "react";
import { PageLayout } from "../layout/pageLayout";
import styles from "./homePage.module.scss";
export const HomePage = function(
  props: {
  }
) 
{
  const [beforeInstallPromptEvent, setBeforeInstallPromptEvent] = React.useState<BeforeInstallPromptEvent | undefined>(undefined);
   
  React.useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e => {
      e.preventDefault();
      setBeforeInstallPromptEvent(e as BeforeInstallPromptEvent);
    }));
  }, []);
  return (
    <PageLayout title="Home">
      <div className={styles.root}>
        {
          beforeInstallPromptEvent != null ?
            <button></button>
          : <>aaa</>
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
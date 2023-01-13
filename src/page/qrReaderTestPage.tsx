import { BrowserQRCodeReader } from "@zxing/browser";
import React from "react";
import { PageLayout } from "../layout/pageLayout";
import styles from "./qrReaderTestPage.module.scss";
export const QrReaderTest = function(
  props: {
  }
) 
{
  const videoElement = React.useRef<HTMLVideoElement>(null);

  //■<video />とカメラの接続
  React.useEffect(() => {
    (async() => {
      if(videoElement.current == null)throw Error("videoElementがありません。");
      const codeReader = new BrowserQRCodeReader();
      const controls = await codeReader.decodeFromVideoDevice(undefined, videoElement.current, (result, error, controls) => {
        console.log("★", result, error)
        if(result != null){
          controls.stop();
          alert(result);
        }
      });
    })();
  }, []);

  return (
    <PageLayout title="OR Reader Test3">
      <div className={styles.root}>
        <video ref={videoElement} />
        
      </div>
    </PageLayout>
  )
}
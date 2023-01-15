import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import React from "react";
import { PageLayout } from "../layout/pageLayout";
import styles from "./qrReaderTestPage.module.scss";
export const QrReaderTestPage = function(
  props: {
  }
) 
{
  const videoElement = React.useRef<HTMLVideoElement>(null);
  const scannerControls = React.useRef<IScannerControls | null>(null);
  //■<video />とカメラの接続
  React.useEffect(() => {
    (async() => {
      if(videoElement.current == null)throw Error("videoElementがありません。");
      const codeReader = new BrowserQRCodeReader();
      scannerControls.current = await codeReader.decodeFromVideoDevice(undefined, videoElement.current, (result, error, controls) => {
        console.log("★", result, error)
        if(error == null && result != null && result.getText() != null){
          controls.stop();
          alert(result.getText());
        }
      });
    })();

    return () => {
      if (!scannerControls.current) {
        return
      }
      scannerControls.current.stop()
      scannerControls.current = null
    };

  }, []);

  return (
    <PageLayout title="QR Reader Test">
      <div className={styles.root}>
        <video ref={videoElement} />
        
      </div>
    </PageLayout>
  )
}
import React from "react";
import { PageLayout } from "../layout/pageLayout";
import styles from "./videoTestPage.module.scss";
export const VideoTestPage = function(
  props: {
  }
) 
{
  const videoElement = React.useRef<HTMLVideoElement>(null);

  //■<video />とカメラの接続
  React.useEffect(() => {
    (async() => {
      if(videoElement.current == null)throw Error("videoElementがない");
      const stream = await navigator.mediaDevices.getUserMedia( 
        { 
          audio: false,
          video: { 
            facingMode: {
              exact: 'environment'
            }
          } 
        }
      );
      videoElement.current.srcObject = stream;
      videoElement.current.onloadedmetadata = e => {
        if(videoElement.current == null)throw Error("videoElementがない");
        videoElement.current.play();
      };
    })();
  }, []);

  return (
    <PageLayout title="Video Test">
      <div className={styles.root}>
        <video ref={videoElement} />
        
      </div>
    </PageLayout>
  )
}
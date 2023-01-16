import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import React from "react";
import { PageLayout } from "../layout/pageLayout";
import styles from "./qrReaderTest3Page.module.scss";


type Size = {
  width: number,
  height: number;
}
export const QrReaderTest3Page = function(
  props: {
  }
) 
{
  const canvasElement = React.useRef<HTMLCanvasElement>(null);

  const viewElement = React.useRef<HTMLDivElement>(null);
  const videoElement = React.useRef<HTMLVideoElement>(null);
  const videoStream = React.useRef<MediaStream>();
  const scannerControls = React.useRef<IScannerControls | null>(null);
  // //■videoを包括するエレメントサイズ。(固定)
  // const [viewSize, setViewSize] = React.useState<Size | undefined>(undefined);
  // //■videoのサイズ
  // const [size, setSize] = React.useState<Size | undefined>(undefined);
  
  //■ピンチ開始時のサイズ
  const startPinchDistance = React.useRef<number | undefined>(undefined);
  const startZoom = React.useRef(1);

  //■zoomのrete
  // const zoom = React.useRef(1);

  //■QRの読み取り用
  const [timer, setTimer] = React.useState(Number.MIN_VALUE);

  React.useEffect(() => {
    //■ViewElementのサイズを固定
    if(viewElement.current == null)throw Error("viewElementがない");
    // setViewSize({
    //   width: viewElement.current.clientWidth, 
    //   height: viewElement.current.clientHeight
    // });
    
    //■<video>のサイズ取得
    if(videoElement.current == null)throw Error("videoElementがない");
    // const size = {
    //   width: videoElement.current.clientWidth, 
    //   height: videoElement.current.clientHeight
    // };
    // setSize(size);


    (async() => {
      //■<video>とカメラの接続
      if(videoElement.current == null)throw Error("videoElementがない");
      console.log(navigator.mediaDevices.getSupportedConstraints());
      videoStream.current = await navigator.mediaDevices.getUserMedia( 
        { 
          audio: false,
          video: {
            facingMode: { exact: "environment" },//Widnowsでは使用不可になる。
            
          }
        }
      );
      videoElement.current.srcObject = videoStream.current;
      videoElement.current.onloadedmetadata = e => {
        if(videoElement.current == null)throw Error("videoElementがない");
        videoElement.current.play();
      };
      
      //■<video>とQRコードスキャナの接続
      const codeReader = new BrowserQRCodeReader();
      //scannerControls.current = await codeReader.decodeFromVideoDevice(undefined, videoElement.current, (result, error, controls) => {
      scannerControls.current = await codeReader.decodeFromVideoElement(videoElement.current, (result, error, controls) => {
        console.log("★", result, error)
        if(error == null && result != null && result.getText() != null){
          controls.stop();
          alert(result.getText());
          window.location.reload();
        }
      });
    })();

   
  }, []);


  //■Qcodeの読み取り

  React.useEffect(() => {
    // window.setTimeout(async () => {
    //   // if(startPinchDistance.current != null){//ピンチ中は実行しない
    //     //■ViewElementをcanvusに描画
    //     if(canvasElement.current == null)throw Error("")
    //     if(viewElement.current == null)throw Error("viewElementが未定義");
    //     if(videoElement.current == null)throw Error("videoElementが未定義");

    //     //■サイズ計算
    //     const [width, height] = [Math.min(viewElement.current.clientWidth, videoElement.current.clientWidth) , Math.min(viewElement.current.clientHeight, videoElement.current.clientHeight)];
    //     const [marginX, marginY] = [(videoElement.current.clientWidth - width) / 2 , (videoElement.current.clientHeight - height) / 2];
    //     const [rateX, rateY] = [videoElement.current.videoWidth / videoElement.current.clientWidth, videoElement.current.videoHeight / videoElement.current.clientHeight];

    //     //■canvasに表示領域をコピー
    //     const canvas = canvasElement.current;
    //     canvas.width = width;
    //     canvas.height = height;
    //     const context = canvas.getContext("2d");
    //     if(context == null)throw Error("canvas.getContext()で取得できなかった");
    //     context.drawImage(videoElement.current, marginX * rateX, marginY * rateY, width * rateX, height * rateY, 0, 0, width * rateX, height * rateY);
   
       
    //     //■QRコード読み取り
    //     const codeReader = new BrowserQRCodeReader();
    //     try{
    //       const result = await codeReader.decodeFromImageUrl(canvas.toDataURL());
    //       alert(result.getText());
    //       window.location.reload();
    //     }
    //     catch(error){
    //       console.log("★error", error)
    //     }


    //   // }
    //   setTimer(timer + 1);
    // }, 500);
  }, [timer]);

  
  //■bodyのピンチによるzoomを無効化
  const disableBodyZoom = (e: TouchEvent) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  };
  React.useEffect(() => {
    window.document.body.addEventListener("touchmove", disableBodyZoom, {passive: false});
    return () => {
      window.document.body.removeEventListener("touchmove", disableBodyZoom);
    }
  }, []);


  return (
    <PageLayout title="QRコードリーダ(Chrome版)">
      <div className={styles.root}>
        <div ref ={viewElement} 
          onTouchEnd={e => {
            //■move直後に実行されるので、初期化
            console.log("end")
            startPinchDistance.current = undefined;
            if(videoStream.current == null)throw Error("videoStreamが未定義");
            const [videoTrack] = videoStream.current.getVideoTracks();
            console.log("★end", videoTrack.getConstraints());
            const constraints = videoTrack.getConstraints();
            if(constraints.advanced != null && constraints.advanced.length > 0){
              const zoom = ((constraints.advanced[0]) as any).zoom;
              console.log("★newzoom", zoom)
              startZoom.current = zoom ?? 1;
            }
          }}
          onTouchMove={async e => {
            if(e.changedTouches.length > 1){
              //■座標取得
              const [x1, y1, x2, y2] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY, e.changedTouches[1].pageX, e.changedTouches[1].pageY];
              const pinchDistance  = Math.sqrt( Math.pow( x2-x1, 2 ) + Math.pow( y2-y1, 2 ) ) ;

              if(startPinchDistance.current == null){//開始
                console.log("★開始", pinchDistance)
                startPinchDistance.current = pinchDistance;
              }
              else{//move
                //開始との差異でサイズを変更する
                if(videoStream.current == null)throw Error("videoStreamが未定義");
                const newZoom =  (() => {
                  const temp = startZoom.current * (pinchDistance / startPinchDistance.current);
                  return temp < 1 ? 1 : temp;
                })();


                //■zoomの設定
                const [videoTrack] = videoStream.current.getVideoTracks();
                try{
                  await videoTrack.applyConstraints({
                    advanced: [{ zoom: newZoom} as MediaTrackConstraintSet],
                  });
                }
                catch(error){
                  console.log("エラー", newZoom)
                }
              }
            }
          }}
        >

          <video ref={videoElement} muted={true} playsInline={true} />
        </div>
        
      </div>
    </PageLayout>
  )
}
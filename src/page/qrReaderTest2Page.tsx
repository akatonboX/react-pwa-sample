import { BrowserQRCodeReader } from "@zxing/browser";
import React from "react";
import { PageLayout } from "../layout/pageLayout";
import styles from "./qrReaderTest2Page.module.scss";


type Size = {
  width: number,
  height: number;
}
export const QrReaderTest2Page = function(
  props: {
  }
) 
{
  const canvasElement = React.useRef<HTMLCanvasElement>(null);

  const viewElement = React.useRef<HTMLDivElement>(null);
  const videoElement = React.useRef<HTMLVideoElement>(null);
  //■videoを包括するエレメントサイズ。(固定)
  const [viewSize, setViewSize] = React.useState<Size | undefined>(undefined);
  //■videoのサイズ
  const [size, setSize] = React.useState<Size | undefined>(undefined);
  
  //■ピンチ開始時のサイズ
  const startPinchDistance = React.useRef<number | undefined>(undefined);
  const startPinchSize = React.useRef<Size | undefined>(undefined);

  //■QRの読み取り用
  const [timer, setTimer] = React.useState(Number.MIN_VALUE);

  React.useEffect(() => {
    //■ViewElementのサイズを固定
    if(viewElement.current == null)throw Error("viewElementがない");
    setViewSize({
      width: viewElement.current.clientWidth, 
      height: viewElement.current.clientHeight
    });
    
    //■<video>のサイズ取得
    if(videoElement.current == null)throw Error("videoElementがない");
    const size = {
      width: videoElement.current.clientWidth, 
      height: videoElement.current.clientHeight
    };
    setSize(size);

    //■<video>とカメラの接続
    (async() => {
      if(videoElement.current == null)throw Error("videoElementがない");
      console.log(navigator.mediaDevices.getSupportedConstraints());
      const stream = await navigator.mediaDevices.getUserMedia( 
        { 
          audio: false,
          video: {
            facingMode: { exact: "environment" },//Widnowsでは使用不可になる。
            
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


  //■Qcodeの読み取り

  React.useEffect(() => {
    window.setTimeout(async () => {
      // if(startPinchDistance.current != null){//ピンチ中は実行しない
        //■ViewElementをcanvusに描画
        if(canvasElement.current == null)throw Error("")
        if(viewElement.current == null)throw Error("viewElementが未定義");
        if(videoElement.current == null)throw Error("videoElementが未定義");

        //■サイズ計算
        const [width, height] = [Math.min(viewElement.current.clientWidth, videoElement.current.clientWidth) , Math.min(viewElement.current.clientHeight, videoElement.current.clientHeight)];
        const [marginX, marginY] = [(videoElement.current.clientWidth - width) / 2 , (videoElement.current.clientHeight - height) / 2];
        const [rateX, rateY] = [videoElement.current.videoWidth / videoElement.current.clientWidth, videoElement.current.videoHeight / videoElement.current.clientHeight];

        //■canvasに表示領域をコピー
        const canvas = canvasElement.current;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if(context == null)throw Error("canvas.getContext()で取得できなかった");
        context.drawImage(videoElement.current, marginX * rateX, marginY * rateY, width * rateX, height * rateY, 0, 0, width * rateX, height * rateY);
   
       
        //■QRコード読み取り
        const codeReader = new BrowserQRCodeReader();
        try{
          const result = await codeReader.decodeFromImageUrl(canvas.toDataURL());
          alert(result.getText());
          window.location.reload();
        }
        catch(error){
          console.log("★error", error)
        }


      // }
      setTimer(timer + 1);
    }, 500);
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
    <PageLayout title="QRコードリーダ(疑似ピンチ版)">
      <div className={styles.root}>
        <div ref ={viewElement} style={viewSize == null ? undefined : {width: viewSize.width, height: viewSize.height}} 
          onTouchEnd={e => {
            //■move直後に実行されるので、初期化
            console.log("end")
            startPinchDistance.current = undefined;
            startPinchSize.current = undefined;
          }}
          onTouchMove={e => {
            if(e.changedTouches.length > 1){
              console.log("move")
              //■座標取得
              const [x1, y1, x2, y2] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY, e.changedTouches[1].pageX, e.changedTouches[1].pageY];
              const pinchDistance  = Math.sqrt( Math.pow( x2-x1, 2 ) + Math.pow( y2-y1, 2 ) ) ;

              if(startPinchDistance.current == null){//開始
                startPinchDistance.current = pinchDistance;
                startPinchSize.current = size;
              }
              else{//move
                //開始との差異でサイズを変更する
                if(startPinchSize.current == null)throw Error("startPinchSizeが未定義");
                if(viewSize == null)throw Error("viewSizeが未定義");
                const rate = pinchDistance / startPinchDistance.current;
                const newSize = {
                  width: startPinchSize.current.width * rate,
                  height: startPinchSize.current.height * rate,
                };
                //ViewSizeより小さくなければ、サイズを変える
                if(newSize.width >= viewSize.width && newSize.height >= viewSize.height){
                  setSize(newSize);
                }
              }
            }
          }}
        >

          <video ref={videoElement} muted={true} playsInline={true} style={size == null ? undefined : {width: size.width, height: size.height}}/>
        </div>
        
      </div>
      <canvas ref={canvasElement} />
    </PageLayout>
  )
}
import lodash from "lodash";
import React from "react";
import { PageLayout } from "../layout/pageLayout";
import styles from "./cameraInputTestPage.module.scss";
export const CameraInputTestPage = function(
  props: {
  }
) 
{
  const [image, setImage] = React.useState<string | undefined>(undefined);


  return (
    <PageLayout title="カメラによる画像入力">
      
      <div className={styles.root}>
        <input type="file" capture="user" accept="image/*" onChange={e => {
          if(e.currentTarget.files != null && e.currentTarget.files.length > 0){
            const fileReader = new FileReader();
            
            fileReader.onload = (e) => {
              if(e.target == null)throw Error("e.targetがnull");
              if(!lodash.isString(e.target.result))throw Error("e.target.resultがstringではない");
              setImage(e.target.result);
            }
            fileReader.readAsDataURL(e.currentTarget.files[0]);
          }
        }} />
        <br />
        {image != null ? <img style={{width: "80%"}} src={image} alt="preview"/> : <></>}
      </div>
    </PageLayout>
  )
}
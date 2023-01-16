import React from "react";
import styles from './pageLayout.module.scss';
import { NavLink, useNavigate } from "react-router-dom";
import { AppBar, Avatar, IconButton, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { DropdownMenu } from "../component/dropdownMenu";
import { LoadingPage } from "../component/loadingPage";
import { v4 as uuid } from "uuid"; 
import { APP_VERSION } from "../version";

export const PageLayout = (
  props: {
    title: string,
    isInitialized?: boolean,
    children: React.ReactNode
  }
) => {
  const isInitialized = props.isInitialized != null ? props.isInitialized : true;
  const navigate = useNavigate();

  //■Windowタイトルの修正
  React.useEffect(() => {
    document.title = `サンプル - ${props.title}`;
  }, [props.title]);

  return (
    <>
      <div className={styles.root}>
        <div>{/*ヘッダ-*/}
          <AppBar position="static" style={{backgroundColor: "#ffffff"}}>
            <Toolbar variant="dense">
              <div className={styles.toolbarLayout}>
                <div>
                  <NavLink to="/" style={{textDecoration: "none"}}>
                    <div className={styles.appTitle}>SampleApp</div>
                  </NavLink>
                </div>
                <div>

                </div>
                <div>
                  <DropdownMenu
                    menuItems={[
                      // <MenuItem onClick={e => {
                      //   e.preventDefault();
                      //   const paramsString = window.location.search.substring(1);
                      //   if(paramsString){
                      //     const params = paramsString.split('&').map(item => item.split("="));
                      //     const newParamsString = params.reduce((previousValue, currentValue, index, items) => {
                      //       const key = currentValue[0];
                      //       const value = key === "version" ? uuid() : currentValue.length > 0 ? currentValue[1] : undefined;
                      //       return `${previousValue}${index === 0 ? "" : "&"}${key}${value != null ? `=${value}` : ""}` 
                      //     }, "");
                      //     window.location.replace(`${window.location.origin}${window.location.pathname}?${newParamsString}${paramsString.indexOf("version=") < 0 ? `&version=${uuid()}` : ""}`);
                      //   }
                      //   else{
                      //     window.location.replace(`${window.location.origin}${window.location.pathname}?version=${uuid()}`);
                      //   }
                       
                      // }}>★github page更新</MenuItem>,
                      <MenuItem onClick={async e => {
                        e.preventDefault();
                        if(navigator && navigator.serviceWorker){
                          const registration = await navigator.serviceWorker.getRegistration();
                          if(registration){
                            registration.update();
                          }
                        }      
                      }}>Service Worker更新</MenuItem>,
                      <MenuItem onClick={e => {e.preventDefault();alert(APP_VERSION ?? "none")}}>app version</MenuItem>,
                      <hr />,
                      <MenuItem onClick={e => {e.preventDefault();navigate("/")}}>Home</MenuItem>,
                      <MenuItem onClick={e => {e.preventDefault();navigate("/test1")}}>Test1</MenuItem>,
                      <MenuItem onClick={e => {e.preventDefault();navigate("/videoTest")}}>video test</MenuItem>,
                      <MenuItem onClick={e => {e.preventDefault();navigate("/cameraInputTest")}}>camera test</MenuItem>,
                      <MenuItem onClick={e => {e.preventDefault();navigate("/qrReaderTest")}}>qrReader test</MenuItem>,
                      <MenuItem onClick={e => {e.preventDefault();navigate("/qrReaderTest2")}}>qrReader test2</MenuItem>,
                      <MenuItem onClick={e => {e.preventDefault();navigate("/qrReaderTest3")}}>qrReader test3</MenuItem>,
                      
                    ]}
                    children = {(open, isOpen) => {
                      return (
                        <Tooltip title="アカウント設定">
                          <IconButton
                            onClick={e => {
                              e.preventDefault();
                              open(e.currentTarget);
                            }}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={isOpen ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={isOpen ? 'true' : undefined}
                          >
                            <Avatar sx={{ width: 45, height: 45 }}></Avatar>
                          </IconButton>
                        </Tooltip>
                      );
                    }} />
                </div>
              </div>

            </Toolbar>
          </AppBar>
        </div>
        <div>{/*コンテンツ*/}
          <Typography variant="h5">
            <b>{props.title}</b>
          </Typography>
          <div>
            <div>{isInitialized ? props.children : <LoadingPage isVisible={true} />}</div>
          </div>
        </div>
        <div>{/*フッター */}
          <div>Copyright XXXX All Rights Reserved.</div>
        </div>
      </div>
      
    </>
  );
}
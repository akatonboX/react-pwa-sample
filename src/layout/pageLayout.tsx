import React, { Children, useState } from "react";
import styles from './pageLayout.module.scss';
import { NavLink, useNavigate } from "react-router-dom";
import { AppBar, Avatar, Box, Container, IconButton, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { DropdownMenu } from "../component/dropdownMenu";
import { LoadingPage } from "../component/loadingPage";


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
                      <MenuItem onClick={e => {e.preventDefault();navigate("/")}}>Home</MenuItem>,
                      <MenuItem onClick={e => {e.preventDefault();navigate("/test1")}}>Test1</MenuItem>,
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
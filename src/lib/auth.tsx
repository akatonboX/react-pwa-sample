/**
 * 認証関係をまとめたライブラリ。ただし、Auth0による実装。
 * Auth0は本モジュールで隠ぺいする。
 */
import { Auth0ContextInterface, Auth0Provider, useAuth0, User } from '@auth0/auth0-react';
import React from 'react';
import { LoadingPage } from '../component/loadingPage';


const LOGIN_CALLBACK_PATH = "/auth0logincallback";
const LOGOUT_CALLBACK_PATH = "/";
/**
 * ログイン情報を格納するラッパー
 */
export interface Authentication{

  /**
   * ログインする
   */
  login(): Promise<void>;

  /**
   * ログアウトする
   */
  logout(): void;

  /**
   * アクセストークンを取得する。
   */
  getAccessToken(): Promise<string>;

  /**
   * ログイン済みかどうかを取得する
   */
  readonly isAuthenticated: boolean;

  /**
   * 認証処理中かどうかを取得する。
   */
  readonly isLoading: boolean;
}

class AuthenticationImple implements Authentication{
  private auth0: Auth0ContextInterface<User>;
  
  constructor(auth0: Auth0ContextInterface<User>) {
    this.auth0 = auth0;
    this.isAuthenticated = this.auth0.isAuthenticated;
    this.isLoading = this.auth0.isLoading;
  }


  login(): Promise<void> {
    const returnTo = window.location.href.substring(window.location.origin.length + process.env.PUBLIC_URL.length);
    return this.auth0.loginWithRedirect({
      appState: {
        returnTo: returnTo
      }
    });
  }

  logout(){
    this.auth0.logout({
      returnTo: window.location.origin + process.env.PUBLIC_URL + LOGOUT_CALLBACK_PATH
    });
  }

  async getAccessToken(){
    return this.auth0.getAccessTokenSilently();
  }
  readonly isAuthenticated: boolean;

  readonly isLoading: boolean;
}


/** ログインプロバイダ */
export const LoginProvider = function(

  props: {
    children: React.ReactNode
  }
) 
{
  
  return (
    <Auth0Provider
      domain="dev-sa5x8co1.jp.auth0.com"
      clientId="Yo9OICvf6uyfZAL30deVku3E2JU4LW6M"
      audience="https://api.com"
      scope="openid offline_access"
      redirectUri={window.location.origin + process.env.PUBLIC_URL + LOGIN_CALLBACK_PATH}
      useRefreshTokens={true}
      onRedirectCallback={(appState, user) => {
        console.log("★onRedirectCallback", appState, user)
        const rediret = appState != null && appState.returnTo != null ? appState.returnTo : "/";
        window.location.replace(rediret);
      }}
      
    >
      <LoginProviderInner>{props.children}</LoginProviderInner>
    </Auth0Provider>
  );
}

const LoginProviderInner = function(
  props: {
    children: React.ReactNode
  }
) 
{
  const auth = useAuth0();
  const isCallback = window.location.href.startsWith(window.location.origin + process.env.PUBLIC_URL + LOGIN_CALLBACK_PATH);
  const isWaiting = isCallback || auth.isLoading;

  return isWaiting ? <LoadingPage isVisible={true} /> : <>{props.children}</>;

}



/**
 * 
 * @param autologin trueの場合、ログインしていない時は、ログイン画面に遷移する。
 * @returns 
 */
export function useAuthentication(autologin?: boolean){
  
  const auth = new AuthenticationImple(useAuth0());
  React.useEffect(() => {
    if(autologin !== false && !auth.isAuthenticated){
      (async() => {
        await auth.login();
      })();
    }
  });

  return auth;
}
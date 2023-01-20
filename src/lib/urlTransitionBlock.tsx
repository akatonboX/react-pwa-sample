import { setegid } from 'process';
import React from 'react';
import { UNSAFE_NavigationContext, unstable_usePrompt, useInRouterContext, useLinkClickHandler } from 'react-router-dom';




interface UrlTransitionBlock{
  isEnable: boolean;
  setIsEnable: (isEnable: boolean) => void;
}
const UrlTransitionBlockContext = React.createContext<UrlTransitionBlock>({
  isEnable: false,
  setIsEnable: isEnable => {}
});

export const UrlTransitionBlockProvider = (
  props: {
    children: React.ReactNode,
  }
) => {
  const [isEnable, setIsEnable] = React.useState(false);

  const beforeunloadHandler = (event: BeforeUnloadEvent) => {
    console.log("beforeunloadHandler", window.location)

      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = "";
   
  };
  const popstateHandler = (event: PopStateEvent) => {
    console.log("popstateHandler", window.location)
  alert("hoge")

      event.preventDefault();
   
  };
  React.useEffect(() => {
    console.log("★1")
    window.addEventListener("beforeunload", beforeunloadHandler);
    window.addEventListener("popstate", popstateHandler);
    return () => {
      console.log("★2")
      window.removeEventListener("beforeunload", beforeunloadHandler);
      window.removeEventListener("popstate", popstateHandler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UrlTransitionBlockContext.Provider value={{isEnable: isEnable, setIsEnable: isEnable => {setIsEnable(isEnable);}}}>
      {props.children}
    </UrlTransitionBlockContext.Provider>
  );
};

export const useUrlTransitionBlock = () => {
  const urlTransitionBlock = React.useContext(UrlTransitionBlockContext);
  const navigator = React.useContext(UNSAFE_NavigationContext).navigator;
  console.log("★★", (navigator as any).block)
  
};
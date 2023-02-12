import { setegid } from 'process';
import React from 'react';
import { useHistory } from 'react-router';
import { v4 as uuid } from "uuid"; 


interface UrlTransitionBlock{
  id: string;
  isBlock: boolean;
}

interface UrlTransitionBlocks{
  blocks: UrlTransitionBlock[],
  message: string;
  setBlocks: (blocks: UrlTransitionBlock[]) => void;
}
const UrlTransitionBlockContext = React.createContext<UrlTransitionBlocks>({
  blocks: [],
  message: "",
  setBlocks: isEnable => {}
});

export const UrlTransitionBlockProvider = (
  props: {
    message: string,
    children: React.ReactNode,
  }
) => {
  const [blocks, setBlocks] = React.useState<UrlTransitionBlock[]>([]);
  const isBlock = blocks.filter(item => item.isBlock === true).length > 0;
  console.log("★UrlTransitionBlockProvider", blocks,isBlock)
  const beforeunloadHandler = (event: BeforeUnloadEvent) => {
    console.log("★beforeunloadHandler", window.location, isBlock)
    if(isBlock){
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = "";
    }
   
  };
  const popstateHandler = (event: PopStateEvent) => {
    console.log("★popstateHandler", window.location, isBlock);

    if(isBlock && window.confirm(props.message)){

    }
  };
  const onUnload = (event: any) => {
    console.log("★onUnload", window.location, isBlock);

  };
  React.useEffect(() => {
    console.log("regist event");
    window.addEventListener("beforeunload", beforeunloadHandler);
    window.addEventListener("popstate", popstateHandler);
    window.addEventListener("unload", onUnload);
    return () => {
      console.log("unregist event");
      window.removeEventListener("beforeunload", beforeunloadHandler);
      window.removeEventListener("popstate", popstateHandler);
      window.removeEventListener("unload", onUnload);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBlock]);

  return (
    <UrlTransitionBlockContext.Provider value={{blocks: blocks, setBlocks: blocks => {setBlocks(blocks);}, message: props.message}}>
      {props.children}
    </UrlTransitionBlockContext.Provider>
  );
};

export const useUrlTransitionBlock = (isBlock: boolean) => {
  const urlTransitionBlocks = React.useContext(UrlTransitionBlockContext);
  const id = React.useMemo(() => uuid(), []);
  
  React.useEffect(() => {
    urlTransitionBlocks.setBlocks([...urlTransitionBlocks.blocks.filter(item => item.id === id)
      , {
        id: id,
        isBlock: isBlock
      }
    ]);
    return () => {
      urlTransitionBlocks.setBlocks([...urlTransitionBlocks.blocks.filter(item => item.id === id)]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBlock])

  
  const beforeunloadHandler = (event: BeforeUnloadEvent) => {
    console.log("★beforeunloadHandler", window.location)
  };
  const popstateHandler = (event: PopStateEvent) => {
    console.log("★popstateHandler", window.location);
  };
  const onUnload = (event: any) => {
    console.log("★onUnload", window.location);
  };

  const history = useHistory();
  React.useEffect(() => {
    const href = window.location.href;
    
    console.log("regist event", href);
    window.addEventListener("beforeunload", beforeunloadHandler);
    window.addEventListener("popstate", popstateHandler);
    window.addEventListener("unload", onUnload);
    return () => {
      console.log("unregist event", window.location);
      window.removeEventListener("beforeunload", beforeunloadHandler);
      window.removeEventListener("popstate", popstateHandler);
      window.removeEventListener("unload", onUnload);
      
      if(window.location.href !== href){
        if(window.confirm("ああ")){
   
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return {
    
  }
  
};
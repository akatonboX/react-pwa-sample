// import { unstable_useBlocker, unstable_usePrompt } from "react-router-dom";
import { Prompt } from "react-router-dom";
import { PageLayout } from "../layout/pageLayout";
import { useUrlTransitionBlock } from "../lib/urlTransitionBlock";
import styles from "./test1Page.module.scss";
export const Test1Page = function(
  props: {
  }
) 
{
  // unstable_usePrompt({when: false, message: "hoge"});

  // useUrlTransitionBlock(true);
  
  return (
    <PageLayout title="Test1">
      <div className={styles.root}>
        <input></input>
        <a href="http://www.yahoo.co.jp">yahoo</a><br />
        <button onClick={e => {e.preventDefault();window.history.back();}} >back</button>
      </div>
      <Prompt message={(location, action) => {
        console.log("★prompt", location, action);
        return "ほげss";

      }} />
    </PageLayout>
  )
}
import { unstable_usePrompt } from "react-router-dom";
import { PageLayout } from "../layout/pageLayout";
import { useUrlTransitionBlock } from "../lib/urlTransitionBlock";
import styles from "./test1Page.module.scss";
export const Test1Page = function(
  props: {
  }
) 
{
  useUrlTransitionBlock();
  unstable_usePrompt({when: true, message: "hoge"});
  return (
    <PageLayout title="Test1">
      <div className={styles.root}>
        <input></input>
        <a href="http://www.yahoo.co.jp">yahoo</a>
      </div>
    </PageLayout>
  )
}
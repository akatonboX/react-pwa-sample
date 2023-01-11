import { PageLayout } from "../layout/pageLayout";
import styles from "./test1Page.module.scss";
export const Test1Page = function(
  props: {
  }
) 
{
  return (
    <PageLayout title="Test1">
      <div className={styles.root}>
      </div>
    </PageLayout>
  )
}
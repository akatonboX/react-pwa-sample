import { PageLayout } from "../layout/pageLayout";
import { useAuthentication } from "../lib/auth";
import styles from "./needLoginPage.module.scss";
export const NeedLoginPage = function(
  props: {
  }
) 
{
  const auth = useAuthentication();
  return (
    <PageLayout title="Need Login">
      <div className={styles.root}>
        <button onClick={e => {e.preventDefault(); auth.logout();}}>logout</button>
      </div>
    </PageLayout>
  )
}
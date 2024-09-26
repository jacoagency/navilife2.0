import { SignIn } from "@clerk/nextjs";
import styles from './sign-in.module.css';

export default function SignInPage() {
  return (
    <div className={styles.signInContainer}>
      <h1 className={styles.title}>Welcome to NaviLife</h1>
      <SignIn />
    </div>
  );
}
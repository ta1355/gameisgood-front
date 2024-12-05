import { useState } from "react";
import styles from "./Signup.module.css"; // CSS 모듈 import

const Signup = () => {
  const [username, setUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      userPassword,
      userEmail,
    };

    try {
      const response = await fetch("/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("회원가입 실패");
      }

      const result = await response.json();
      console.log("회원가입 성공:", result);

      // 상태 초기화
      setUsername("");
      setUserPassword("");
      setUserEmail("");
      setError("");
    } catch (error) {
      console.error("Error:", error);
      setError("회원가입 실패. 다시 시도해주세요.");
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.signupFormGroup}>
          <label htmlFor="username" className={styles.signupLabel}>
            아이디
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.signupInput}
            required
          />
        </div>
        <div className={styles.signupFormGroup}>
          <label htmlFor="userPassword" className={styles.signupLabel}>
            비밀번호
          </label>
          <input
            type="password"
            id="userPassword"
            name="userPassword"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            className={styles.signupInput}
            required
          />
        </div>
        <div className={styles.signupFormGroup}>
          <label htmlFor="userEmail" className={styles.signupLabel}>
            이메일
          </label>
          <input
            type="email"
            id="userEmail"
            name="userEmail"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className={styles.signupInput}
            required
          />
        </div>
        {error && <div className={styles.signupErrorMessage}>{error}</div>}
        <button className={styles.signupButton} type="submit">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;

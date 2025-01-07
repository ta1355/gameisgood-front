import { useState } from "react";
import styles from "./Signup.module.css"; // CSS 모듈을 import
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const userData = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:8080/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // 회원가입 성공 처리
        setLoading(false);
        alert("회원가입이 성공적으로 완료되었습니다.");
        navigate("/login"); // 로그인 폼으로 리디렉션
      } else {
        alert("회원가입 실패");
        setLoading(false);
      }
    } catch (error) {
      setError("회원가입 실패. 다시 시도해주세요.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupBody}>
      <div className={styles.signupContainer}>
        <h2 className={styles.signupTitle}>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.signupFormGroup}>
            <label htmlFor="username" className={styles.signupLabel}>
              아이디
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.signupInput}
            />
          </div>
          <div className={styles.signupFormGroup}>
            <label htmlFor="email" className={styles.signupLabel}>
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.signupInput}
            />
          </div>
          <div className={styles.signupFormGroup}>
            <label htmlFor="password" className={styles.signupLabel}>
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.signupInput}
            />
          </div>
          <div className={styles.signupFormGroup}>
            <label htmlFor="confirmPassword" className={styles.signupLabel}>
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.signupInput}
            />
          </div>
          {error && <div className={styles.signupErrorMessage}>{error}</div>}
          <button type="submit" className={styles.signupButton}>
            회원가입
          </button>
          {loading && (
            <div className={styles.signupLoadingText}>로딩 중...</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;

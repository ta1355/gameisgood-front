import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ChangePassword.module.css";

function ChangePassword() {
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/user/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            userEmail,
            newPassword,
          }),
        }
      );

      const data = await response.text();

      if (response.ok) {
        setMessage("비밀번호가 성공적으로 변경되었습니다.");
      } else {
        setMessage(data || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className={styles.changePasswordContainer}>
      <h2>비밀번호 변경</h2>
      <form onSubmit={handleSubmit} className={styles.changePasswordForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username">사용자명</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="사용자명을 입력하세요"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="userEmail">이메일</label>
          <input
            type="email"
            id="userEmail"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
            placeholder="가입시 등록한 이메일을 입력하세요"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="새 비밀번호를 입력하세요"
          />
        </div>

        {message && (
          <div
            className={`${styles.message} ${
              message.includes("실패") || message.includes("오류")
                ? styles.error
                : styles.success
            }`}
          >
            {message}
          </div>
        )}

        <div className={styles.buttonGroup}>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "처리 중..." : "비밀번호 변경"}
          </button>
          <button type="button" onClick={handleBackToLogin}>
            로그인으로 돌아가기
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FindId.module.css";

function FindId() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/user/find-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: email,
        }),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        setMessage(`찾은 아이디: ${data}`);
      } else {
        setMessage(
          typeof data === "string"
            ? data
            : data.message || "아이디 찾기에 실패했습니다."
        );
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
    <div className={styles.findIdBody}>
      <div className={styles.findIdContainer}>
        <h2 className={styles.findIdTitle}>아이디 찾기</h2>
        <form onSubmit={handleSubmit} className={styles.findIdForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="가입시 등록한 이메일을 입력하세요"
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
              {isLoading ? "처리 중..." : "아이디 찾기"}
            </button>
            <button type="button" onClick={handleBackToLogin}>
              로그인으로 돌아가기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FindId;

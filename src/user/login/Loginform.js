import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 리디렉션을 위한 navigate 사용

const Login = () => {
  const [username, setUsername] = useState(""); // 사용자 아이디
  const [userPassword, setUserPassword] = useState(""); // 사용자 비밀번호
  const [error, setError] = useState(""); // 오류 메시지
  const navigate = useNavigate(); // 로그인 성공 후 이동을 위한 navigate

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 새로 고침 방지

    const userData = {
      username,
      userPassword, // 여기도 동일하게 확인
    };

    console.log("전송되는 userData:", userData); // userData 확인

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include", // 세션 쿠키를 포함시킴
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.message || "로그인 실패");
        return;
      }

      navigate("/"); // 메인 페이지로 리디렉션
    } catch (error) {
      console.error("Error:", error);
      setError("로그인 실패. 다시 시도해주세요.");
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">아이디 또는 이메일</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="userPassword">비밀번호</label>
          <input
            type="password"
            id="userPassword"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default Login;

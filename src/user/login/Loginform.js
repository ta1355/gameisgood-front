import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./../../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState(""); // 사용자 아이디
  const [userPassword, setUserPassword] = useState(""); // 사용자 비밀번호
  const [error, setError] = useState(""); // 오류 메시지
  const navigate = useNavigate(); // 로그인 성공 후 이동을 위한 navigate
  const { login } = useContext(AuthContext);

  // 구글 로그인 리디렉션 후 토큰 처리
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      navigate("/"); // 로그인 상태이면 바로 리디렉션
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 새로 고침 방지

    const userData = {
      username,
      userPassword,
    };

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include", // 세션 쿠키를 포함시킴
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token; // 서버에서 반환된 토큰
        localStorage.setItem("jwtToken", token); // JWT 토큰을 로컬 스토리지에 저장

        // 로그인 성공 후, AuthContext의 login 함수 호출
        login(username);

        // 메인 페이지로 리디렉션
        navigate("/"); // navigate 호출
      } else {
        const errorText = await response.text();
        setError(errorText || "로그인 실패");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("로그인 실패. 다시 시도해주세요.");
    }
  };

  const handleGoogleLogin = async () => {
    // 구글 로그인 URL로 리디렉션
    const clientId =
      "314722272928-n0o5noignn56bpp9sen4gmcg1r57derl.apps.googleusercontent.com"; // 구글 클라이언트 ID
    const redirectUri = encodeURIComponent(
      "http://localhost:3000/login/oauth2/code/google"
    ); // 리디렉션 URI
    const scope = encodeURIComponent("profile email"); // 요청할 권한
    const state = encodeURIComponent("randomStateString"); // CSRF 보호를 위한 상태값

    // 구글 로그인 URL
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&scope=${scope}&state=${state}&redirect_uri=${redirectUri}&service=lso&o2v=1&ddm=1&flowName=GeneralOAuthFlow`;

    // 구글 로그인 페이지로 리디렉션
    window.location.href = googleAuthUrl;
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

      {/* 구글 로그인 버튼 */}
      <div className="google-login">
        <button onClick={handleGoogleLogin}>구글 로그인</button>
      </div>
    </div>
  );
};

export default Login;

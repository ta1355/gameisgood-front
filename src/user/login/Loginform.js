import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./../../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState(""); // 사용자 아이디
  const [userPassword, setUserPassword] = useState(""); // 사용자 비밀번호
  const [error, setError] = useState(""); // 오류 메시지
  const navigate = useNavigate(); // 로그인 성공 후 이동을 위한 navigate
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    console.log("Token from localStorage on load:", token); // 로컬스토리지에서 가져온 토큰 출력
    if (token) {
      navigate("/"); // 로그인 상태이면 바로 리디렉션
    }
    // 구글 로그인 리디렉션에서 코드 받기
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      handleGoogleTokenExchange(code);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Server response data:", data); // 서버 응답 확인

        const receivedToken = data.token; // 응답에서 받은 token
        console.log("Received token:", receivedToken); // 실제 받은 token 확인

        if (receivedToken) {
          localStorage.setItem("testKey", "testValue");
          console.log(localStorage.getItem("testKey")); // "testValue"
          localStorage.setItem("jwtToken", receivedToken); // 로컬스토리지에 토큰 저장
          console.log("Token stored in localStorage:", receivedToken); // 로컬스토리지에 저장된 토큰 확인

          // 로그인 상태 업데이트
          login(username, receivedToken);
          navigate("/"); // 로그인 후 홈 페이지로 리디렉션
        } else {
          console.error("No token received from server");
          setError("로그인 실패: 토큰이 없습니다.");
        }
      } else {
        const errorText = await response.text();
        setError(errorText || "로그인 실패");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("로그인 실패. 다시 시도해주세요.");
    }
  };

  // 구글 로그인 후 서버와의 토큰 교환
  const handleGoogleTokenExchange = async (code) => {
    try {
      const response = await fetch(
        "http://localhost:8080/login/oauth2/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        if (token) {
          localStorage.setItem("jwtToken", token);
          console.log("Google login token stored in localStorage:", token);

          // 추가: 구글 로그인 후 저장된 토큰을 확인
          const storedToken = localStorage.getItem("jwtToken");
          console.log("Stored token after Google login:", storedToken);

          login(data.username); // 구글 로그인 후 사용자 정보 업데이트
          navigate("/"); // 로그인 성공 후 홈 페이지로 리디렉션
        } else {
          console.error("No token received from server after Google login");
        }
      } else {
        const errorText = await response.text();
        setError(errorText || "구글 로그인 실패");
      }
    } catch (error) {
      console.error("Error during Google token exchange:", error);
      setError("구글 로그인 실패. 다시 시도해주세요.");
    }
  };

  const handleGoogleLogin = async () => {
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

  const handleSignup = () => {
    navigate("/signup");
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
            autoFocus
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
      <div>
        <button onClick={handleSignup}>회원가입</button>
      </div>
    </div>
  );
};

export default Login;

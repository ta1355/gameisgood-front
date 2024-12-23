import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./../../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState(""); // 사용자 아이디
  const [userPassword, setUserPassword] = useState(""); // 사용자 비밀번호
  const [error, setError] = useState(""); // 오류 메시지
  const navigate = useNavigate(); // 로그인 성공 후 이동을 위한 navigate
  const { login } = useContext(AuthContext); // 로그인 함수

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      navigate("/"); // 이미 로그인된 상태이면 바로 리디렉션
      return; // 이미 토큰이 있으면 처리 끝
    }

    // 구글 로그인 리디렉션에서 코드 받기
    const urlParams = new URLSearchParams(window.location.search);
    console.log("URL Parameters:", urlParams); // URL 파라미터를 로그로 출력

    const code = urlParams.get("code");
    if (code) {
      console.log("Received Google code:", code); // code가 있는지 확인
      handleGoogleTokenExchange(code); // 구글 로그인 코드 처리
    } else {
      console.log("No Google code in URL"); // code가 없을 경우 로그
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
        const receivedToken = data.token; // 응답에서 받은 토큰

        if (receivedToken) {
          localStorage.setItem("jwtToken", receivedToken); // 로컬스토리지에 토큰 저장
          login(username, receivedToken); // 로그인 상태 업데이트
          navigate("/"); // 로그인 후 홈 페이지로 리디렉션
        } else {
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
      console.log("Received Google code:", code); // 로그로 코드 확인

      const response = await fetch(
        "http://localhost:8080/login/oauth2/code/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // x-www-form-urlencoded 형식으로 요청
          },
          body: new URLSearchParams({
            code: code,
          }), // 'code'를 URLSearchParams로 변환하여 전송
          credentials: "include", // 쿠키를 포함한 요청
        }
      );

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        if (token) {
          localStorage.setItem("jwtToken", token); // 로컬스토리지에 토큰 저장
          login(data.username, token); // 로그인 상태 업데이트
          navigate("/"); // 로그인 후 홈 페이지로 리디렉션
        } else {
          console.error("No token received from server after Google login");
          setError("로그인 실패: 토큰이 없습니다.");
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
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      process.env.REACT_APP_GOOGLE_REDIRECT_URI
    );
    const scope = encodeURIComponent("profile email");
    const state = encodeURIComponent("randomStateString");

    // 구글 로그인 URL 생성
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

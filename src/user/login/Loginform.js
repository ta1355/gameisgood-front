import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./../../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (code && state) {
        console.log("Google OAuth code received:", code);
        const savedState = sessionStorage.getItem("oauth2_state");

        if (state !== savedState) {
          setError("보안 검증 실패");
          return;
        }

        try {
          setIsLoading(true);
          const response = await fetch(
            "http://localhost:8080/login/oauth2/code/google",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                code: code,
                redirectUri: "http://localhost:3000/login/oauth2/code/google",
              }),
              credentials: "include",
            }
          );

          if (!response.ok) {
            console.error("Response not OK:", response.status);
            const errorData = await response.text();
            console.error("Error response:", errorData);
            throw new Error("구글 로그인 처리 중 오류가 발생했습니다.");
          }

          const data = await response.json();
          console.log("Response data:", data);

          if (data.error) {
            throw new Error(data.message || "구글 로그인 실패");
          }

          if (data.token) {
            localStorage.setItem("jwtToken", data.token);
            login(data.username || data.email, data.token);
            navigate("/");
          } else {
            throw new Error("토큰이 없습니다.");
          }
        } catch (error) {
          console.error("Google login error:", error);
          setError(error.message || "구글 로그인 처리 중 오류가 발생했습니다.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    const token = localStorage.getItem("jwtToken");
    if (token) {
      navigate("/");
      return;
    }

    if (location.pathname === "/login/oauth2/code/google") {
      handleGoogleCallback();
    }
  }, [location, navigate]);

  const handleGoogleTokenExchange = async (code) => {
    console.log("Exchanging Google code for token...");

    try {
      const response = await fetch(
        "http://localhost:8080/login/oauth2/code/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
            redirectUri: "http://localhost:3000/login/oauth2/code/google",
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.message || "구글 로그인 실패");
      }

      if (data.token) {
        localStorage.setItem("jwtToken", data.token);
        login(data.username || data.email, data.token);
        navigate("/");
      } else {
        throw new Error("토큰이 없습니다.");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message || "구글 로그인 처리 중 오류가 발생했습니다.");
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          userPassword,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token) {
          localStorage.setItem("jwtToken", data.token);
          login(username, data.token);
          navigate("/");
        } else {
          setError("로그인 실패: 토큰이 없습니다.");
        }
      } else {
        setError(data.message || "로그인 실패");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("로그인 실패. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      "http://localhost:3000/login/oauth2/code/google"
    );
    const scope = encodeURIComponent("profile email");
    const state = crypto.randomUUID();
    sessionStorage.setItem("oauth2_state", state);

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&scope=${scope}&state=${state}&redirect_uri=${redirectUri}`;
    console.log("Google Auth URL:", googleAuthUrl);

    window.location.href = googleAuthUrl;
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  if (location.pathname === "/login/oauth2/code/google" && isLoading) {
    return <div>구글 로그인 처리 중...</div>;
  }

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
        <button type="submit" disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="google-login">
        <button onClick={handleGoogleLogin} disabled={isLoading}>
          {isLoading ? "처리 중..." : "구글 로그인"}
        </button>
      </div>
      <div>
        <button onClick={handleSignup} disabled={isLoading}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Login;

import React, { createContext, useState, useEffect } from "react";

// AuthContext 생성
export const AuthContext = createContext();

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null); // 사용자 이름 상태
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 인증 상태

  // JWT 토큰 만료 여부 확인
  const checkTokenExpiration = (token) => {
    if (!token) return false;
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // JWT 디코딩
    const expirationTime = decodedToken.exp * 1000; // 토큰 만료 시간
    return expirationTime > Date.now(); // 현재 시간과 비교하여 만료 여부 확인
  };

  // 로컬 스토리지에서 토큰 확인 및 사용자 이름 설정
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token && checkTokenExpiration(token)) {
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // JWT 디코딩
      setUsername(decodedToken.sub); // 사용자 이름 설정
      setIsAuthenticated(true); // 인증 상태 설정
    } else {
      setUsername(null);
      setIsAuthenticated(false);
    }
  }, []);

  // 로그인 함수
  const login = (username, token) => {
    setUsername(username); // 사용자 이름 설정
    localStorage.setItem("jwtToken", token); // JWT 토큰을 로컬 스토리지에 저장
    setIsAuthenticated(true); // 인증 상태 설정
  };

  // 로그아웃 함수
  const logout = () => {
    setUsername(null); // 사용자 이름 초기화
    setIsAuthenticated(false); // 인증 상태 초기화
    localStorage.removeItem("jwtToken"); // JWT 토큰 삭제
  };

  return (
    <AuthContext.Provider value={{ username, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

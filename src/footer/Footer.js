import React, { useState, useEffect } from "react";
import styles from "./Footer.module.css"; // CSS 모듈 사용

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  const checkScrollPosition = () => {
    // 페이지가 맨 아래에 도달했을 때만 푸터를 보이도록 설정
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setIsVisible(true); // 맨 아래에 도달했을 때 푸터 표시
    } else {
      setIsVisible(false); // 그 외에는 푸터 숨기기
    }
  };

  useEffect(() => {
    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", checkScrollPosition);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  return (
    <footer
      className={`${styles.footer} ${isVisible ? styles.footerVisible : ""}`}
    >
      <div className="container">
        <p className="m-0 text-center text-white">
          ⓒ 2024 [GameisGood] | 비영리 목적
        </p>
        <p className="m-0 text-center text-white">
          이 사이트는{" "}
          <a
            href="https://getbootstrap.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
          >
            Bootstrap
          </a>
          을 사용하여 제작되었습니다.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

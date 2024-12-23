import React, { useState, useEffect } from "react";
import styles from "./Footer.module.css";

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  const checkScrollPosition = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollPosition);
    return () => {
      window.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  return (
    <footer
      className={`${styles.footer} ${isVisible ? styles.footerVisible : ""}`}
    >
      <div className={styles.container}>
        <p className="m-0 text-center text-white">
          ⓒ 2024 [GameisGood] || 비영리 목적 페이지 |
        </p>
        <p className="m-0 text-center text-white">
          | 이 사이트는{" "}
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

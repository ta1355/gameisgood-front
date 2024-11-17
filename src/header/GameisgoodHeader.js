import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 import
import styles from "./Header.module.css";

function Header() {
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태 추가
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 막기
    if (searchQuery) {
      navigate(`/search/${searchQuery}`); // 검색어를 URL에 포함하여 라우팅
    }
  };

  return (
    <div>
      <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
        <div className="container-fluid">
          <a className={styles.navbarBrand} href="#">
            GameisGood
          </a>
          <button
            className={`navbar-toggler ${styles.navbarToggler}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span
              className={`navbar-toggler-icon ${styles.navbarTogglerIcon}`}
            ></span>
          </button>
          <div
            className={`collapse navbar-collapse ${styles.navbarCollapse}`}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  aria-current="page"
                  href="/"
                  style={{ color: "white" }}
                >
                  홈
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" style={{ color: "white" }}>
                  로그인
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ color: "white" }}
                >
                  메뉴
                </a>
                <ul
                  className={`dropdown-menu ${styles.dropdownMenu}`}
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      href="#"
                    >
                      인기순
                    </a>
                  </li>
                  <li>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      href="#"
                    >
                      최신순
                    </a>
                  </li>
                  <li>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      href="/special"
                    >
                      특별할인
                    </a>
                  </li>
                  <li>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      href="#"
                    >
                      이건 뭘 해야할까
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      href="#"
                    >
                      공지사항
                    </a>
                  </li>
                  <li>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      href="#"
                    >
                      자유게시판
                    </a>
                  </li>
                  <li>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      href="#"
                    >
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            <form className="d-flex" onSubmit={handleSearchSubmit}>
              <input
                className={`form-control me-2 ${styles.formControl}`}
                type="search"
                placeholder="게임 검색"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className={`btn btn-outline-success ${styles.btnOutlineSuccess}`}
                type="submit"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;

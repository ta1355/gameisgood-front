import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // AuthContext import
import debounce from "lodash.debounce";
import styles from "./Header.module.css";

const fetchGames = async (query) => {
  try {
    const response = await fetch(`http://localhost:8080/search/${query}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API 호출 오류:", error);
    return [];
  }
};

function Header() {
  const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
  const [games, setGames] = useState([]); // 검색된 게임 목록
  const [error, setError] = useState(null); // 오류 상태
  const { username, isAuthenticated, logout } = useContext(AuthContext); // AuthContext 사용
  const navigate = useNavigate(); // useNavigate 훅 사용

  // Debounced 검색어 입력 핸들러
  const handleSearchChange = debounce(async (query) => {
    setSearchQuery(query);

    if (query.length > 0) {
      setError(null);

      try {
        const results = await fetchGames(query);
        setGames(results);
      } catch (err) {
        setError("검색 결과를 불러오는 데 문제가 발생했습니다.");
      }
    } else {
      setGames([]);
    }
  }, 50);

  // 검색 폼 제출 처리
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    if (searchQuery) {
      navigate(`/search/${searchQuery}`); // 검색어를 URL에 포함하여 라우팅
    }
  };

  // 실시간으로 검색어 변경 시 debounce 함수 호출
  const handleInputChange = (e) => {
    const query = e.target.value;
    handleSearchChange(query);
  };

  // 게임 클릭 시 디테일 페이지로 이동
  const handleGameClick = (appid) => {
    navigate(`/game_detail/${appid}`);
    setSearchQuery("");
    setGames([]);
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    logout(); // AuthContext의 logout 함수 호출
    navigate("/login"); // 로그인 페이지로 리디렉션
  };

  return (
    <div>
      <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
        <div className="container-fluid">
          <a className={styles.navbarBrand} href="/">
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
            />
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
              {!isAuthenticated ? (
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/login"
                    style={{ color: "white" }}
                  >
                    로그인
                  </a>
                </li>
              ) : (
                <li className="nav-item">
                  <button
                    className="nav-link"
                    onClick={handleLogout}
                    style={{
                      color: "white",
                      background: "none",
                      border: "none",
                    }}
                  >
                    로그아웃
                  </button>
                </li>
              )}
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
                  게임 정보
                </a>
                <ul
                  className={`dropdown-menu ${styles.dropdownMenu}`}
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      href="/top_sellers"
                    >
                      인기순
                    </a>
                  </li>
                  <li>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      href="/new_releases"
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
                      href="/coming_soon"
                    >
                      출시 예정
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/post/list"
                  style={{ color: "white" }}
                >
                  자유게시판
                </a>
              </li>
            </ul>

            {username && (
              <div className="welcome-message ps-3 pe-3 ">
                <h2 className="fs-5">환영합니다, {username}님!</h2>
              </div>
            )}

            {/* 검색 폼 */}
            <form className="d-flex" onSubmit={handleSearchSubmit}>
              <input
                className={`form-control me-2 ${styles.formControl}`}
                type="search"
                placeholder="게임 검색"
                aria-label="Search"
                value={searchQuery}
                onChange={handleInputChange}
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

      {/* 검색 결과 */}
      {games.length > 0 && (
        <ul className={styles.searchResults}>
          {games.map((game) => (
            <li
              key={game.appid}
              className={styles.gameItem}
              onClick={() => handleGameClick(game.appid)}
            >
              {game.logo && (
                <img
                  src={game.logo}
                  alt={game.name}
                  className={styles.gameLogo}
                />
              )}
              <span>{game.name}</span>
            </li>
          ))}
        </ul>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {games.length === 0 && !error}
    </div>
  );
}

export default Header;

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Search.module.css"; // 스타일 모듈 임포트

function Search() {
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState([]);
  const { steamAppName } = useParams();

  const getGame = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/search/${steamAppName}`
      );
      const json = await response.json();
      console.log(json);
      setGame(json);
      setLoading(false);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (steamAppName) {
      getGame();
    }
  }, [steamAppName]);

  return (
    <div className={styles.searchContainer}>
      {loading ? (
        <h1 className={styles.loadingText}>로딩중...</h1>
      ) : (
        <div>
          {game.length > 0 ? (
            <div className={styles.gameList}>
              {game.map((search) => (
                <div key={search.appid} className={styles.gameCard}>
                  <img
                    src={search.logo}
                    alt={search.name}
                    className={styles.gameLogo}
                  />
                  <h2 className={styles.gameTitle}>{search.name}</h2>
                  {/* appid와 icon 숨기기 */}
                  <p className={styles.hidden}>{search.appid}</p>
                  <img
                    src={search.icon}
                    alt="게임아이콘"
                    className={styles.hidden}
                  />
                </div>
              ))}
            </div>
          ) : (
            <h2 className={styles.noResultsMessage}>검색 결과가 없습니다</h2>
          )}
        </div>
      )}
    </div>
  );
}

export default Search;

import React, { useEffect, useState } from "react";
import styles from "./GameDetail.module.css"; // CSS 모듈 import

function Detail() {
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState([]);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  const getGame = async () => {
    try {
      const response = await fetch(`http://localhost:8080/test/582010`);
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
    getGame();
  }, []);

  const goToNextScreenshot = () => {
    if (
      game.screenshots &&
      currentScreenshotIndex < game.screenshots.length - 1
    ) {
      setCurrentScreenshotIndex(currentScreenshotIndex + 1);
    }
  };

  const goToPreviousScreenshot = () => {
    if (currentScreenshotIndex > 0) {
      setCurrentScreenshotIndex(currentScreenshotIndex - 1);
    }
  };

  const goToNextMovie = () => {
    if (game.movies && currentMovieIndex < game.movies.length - 1) {
      setCurrentMovieIndex(currentMovieIndex + 1);
    }
  };

  const goToPreviousMovie = () => {
    if (currentMovieIndex > 0) {
      setCurrentMovieIndex(currentMovieIndex - 1);
    }
  };

  return (
    <div className={styles.detailContainer}>
      {loading ? (
        <h1 className={styles.loadingText}>로딩중...</h1>
      ) : (
        <div className={styles.gameDetails}>
          {game ? (
            <div>
              <div className={styles.gameHeaderContainer}>
                <img
                  src={game.headerImage}
                  alt={game.name}
                  className={styles.gameHeaderImage}
                />
                <h2 className={styles.gameTitle}>{game.name}</h2>
              </div>

              <div
                className={styles.shortDescriptionContainer}
                style={{
                  backgroundImage: `url(${game.background})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h3 className={styles.shortDescriptionTitle}>게임 소개</h3>
                <p className={styles.gameShortDescription}>
                  {game.shortDescription}
                </p>
              </div>

              <div
                className={styles.detailedDescriptionContainer}
                style={{
                  backgroundImage: `url(${game.background})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <h3 className={styles.detailedDescriptionTitle}>상세 설명</h3>
                <p className={styles.gameDescription}>
                  {game.detailedDescription}
                </p>
              </div>

              <p className={styles.releaseDate}>
                출시일: {game.releaseDate || "날짜 정보 없음"}
              </p>

              <a
                href={game.website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.websiteLink}
              >
                게임 웹사이트 방문하기
              </a>

              <div className={styles.mediaSection}>
                <div className={styles.screenshotWrapper}>
                  <h3>스크린샷</h3>
                  <div className={styles.imageNavigation}>
                    <button
                      onClick={goToPreviousScreenshot}
                      disabled={currentScreenshotIndex === 0}
                      className={styles.navButton}
                    >
                      이전
                    </button>
                    <button
                      onClick={goToNextScreenshot}
                      disabled={
                        currentScreenshotIndex === game.screenshots.length - 1
                      }
                      className={styles.navButton}
                      style={{ marginLeft: "10px" }}
                    >
                      다음
                    </button>
                    <div className={styles.imageWrapper}>
                      <img
                        src={game.screenshots[currentScreenshotIndex]}
                        alt={`Screenshot ${currentScreenshotIndex + 1}`}
                        className={styles.screenshotImage}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.movieWrapper}>
                  <h3>동영상</h3>
                  <div className={styles.videoNavigation}>
                    <button
                      onClick={goToPreviousMovie}
                      disabled={
                        currentMovieIndex === 0 ||
                        !game.movies ||
                        game.movies.length === 0
                      }
                      className={styles.navButton}
                    >
                      이전
                    </button>
                    <button
                      onClick={goToNextMovie}
                      disabled={
                        currentMovieIndex ===
                        (game.movies ? game.movies.length - 1 : 0)
                      }
                      className={styles.navButton}
                      style={{ marginLeft: "10px" }}
                    >
                      다음
                    </button>
                    <div className={styles.videoWrapper}>
                      {game.movies && game.movies.length > 0 && (
                        <video
                          key={currentMovieIndex}
                          controls
                          className={styles.gameVideo}
                        >
                          <source
                            src={game.movies[currentMovieIndex]}
                            type="video/mp4"
                          />
                          브라우저가 동영상을 지원하지 않습니다.
                        </video>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <h2>게임 정보가 없습니다.</h2>
          )}
        </div>
      )}
    </div>
  );
}

export default Detail;

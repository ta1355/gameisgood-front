import React, { useEffect, useState } from "react";

function Detail() {
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0); // 현재 스크린샷 인덱스
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0); // 현재 동영상 인덱스

  const getGame = async () => {
    try {
      const response = await fetch(`http://localhost:8080/test/582010`);
      const json = await response.json();
      console.log(json);
      setGame(json); // 게임 데이터 설정
      setLoading(false);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getGame();
  }, []);

  // 스크린샷 넘기기
  const goToNextScreenshot = () => {
    if (game && currentScreenshotIndex < game.screenshots.length - 1) {
      setCurrentScreenshotIndex(currentScreenshotIndex + 1);
    }
  };

  const goToPreviousScreenshot = () => {
    if (currentScreenshotIndex > 0) {
      setCurrentScreenshotIndex(currentScreenshotIndex - 1);
    }
  };

  // 동영상 넘기기
  const goToNextMovie = () => {
    if (game && currentMovieIndex < game.movies.length - 1) {
      setCurrentMovieIndex(currentMovieIndex + 1);
    }
  };

  const goToPreviousMovie = () => {
    if (currentMovieIndex > 0) {
      setCurrentMovieIndex(currentMovieIndex - 1);
    }
  };

  return (
    <div>
      {loading ? (
        <h1>로딩중...</h1>
      ) : (
        <div>
          {game ? (
            <div>
              {/* 게임의 헤더 이미지 */}
              <img
                src={game.headerImage}
                alt={game.name}
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "cover",
                }}
              />

              {/* 게임 이름과 간략한 설명 */}
              <h2>{game.name}</h2>
              <p>{game.shortDescription}</p>

              {/* 게임에 대한 상세 설명 */}
              <p>{game.detailedDescription}</p>

              {/* 출시일 표시 */}
              <p>
                출시일: {new Date(game.releaseDate.date).toLocaleDateString()}
              </p>

              {/* 게임 웹사이트 링크 */}
              <a href={game.website} target="_blank" rel="noopener noreferrer">
                게임 웹사이트 방문하기
              </a>

              {/* 스크린샷 */}
              <div style={{ marginTop: "20px" }}>
                <h3>스크린샷</h3>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    onClick={goToPreviousScreenshot}
                    disabled={currentScreenshotIndex === 0}
                  >
                    이전
                  </button>
                  <img
                    src={game.screenshots[currentScreenshotIndex]}
                    alt={`Screenshot ${currentScreenshotIndex + 1}`}
                    style={{
                      width: "100%",
                      maxHeight: "300px",
                      objectFit: "cover",
                      margin: "0 10px",
                    }}
                  />
                  <button
                    onClick={goToNextScreenshot}
                    disabled={
                      currentScreenshotIndex === game.screenshots.length - 1
                    }
                  >
                    다음
                  </button>
                </div>
              </div>

              {/* 동영상 */}
              <div style={{ marginTop: "20px" }}>
                <h3>동영상</h3>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <button
                    onClick={goToPreviousMovie}
                    disabled={currentMovieIndex === 0}
                  >
                    이전
                  </button>
                  <video
                    width="320"
                    height="180"
                    controls
                    style={{ margin: "0 10px" }}
                  >
                    <source
                      src={game.movies[currentMovieIndex]}
                      type="video/mp4"
                    />
                    브라우저가 동영상을 지원하지 않습니다.
                  </video>
                  <button
                    onClick={goToNextMovie}
                    disabled={currentMovieIndex === game.movies.length - 1}
                  >
                    다음
                  </button>
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

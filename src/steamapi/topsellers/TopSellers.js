import React, { useEffect, useState } from "react";
import GameList from "./TopSellersList";
import styles from "./Topsellers.module.css";

function Game() {
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState([]);

  const getGame = async () => {
    try {
      const response = await fetch(`http://localhost:8080/game/top_sellers`);
      const json = await response.json();
      setGame(json.specials);
      setLoading(false);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getGame();
  }, []);

  return (
    <div>
      {loading ? (
        <h1>로딩중...</h1>
      ) : (
        <div className={styles.gameContainer}>
          {game.map((gameItem) => (
            <GameList
              key={gameItem.id}
              id={gameItem.id}
              name={gameItem.name}
              discounted={gameItem.discounted}
              discountPercent={gameItem.discountPercent}
              currency={gameItem.currency}
              largeCapsuleImage={gameItem.largeCapsuleImage}
              smallCapsuleImage={gameItem.smallCapsuleImage}
              windowsAvailable={gameItem.windowsAvailable}
              macAvailable={gameItem.macAvailable}
              linuxAvailable={gameItem.linuxAvailable}
              streamingVideoAvailable={gameItem.streamingVideoAvailable}
              discountExpiration={gameItem.discountExpiration}
              headerImage={gameItem.headerImage}
              headline={gameItem.headline}
              formattedOriginalPrice={gameItem.formattedOriginalPrice}
              formattedFinalPrice={gameItem.formattedFinalPrice}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Game;

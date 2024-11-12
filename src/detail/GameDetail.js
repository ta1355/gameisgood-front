import React, { useEffect, useState } from "react";

function Detail() {
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState([]);

  const getGame = async () => {
    try {
      const response = await fetch(`http://localhost:8080/test/582010`);
      const json = await response.json();

      console.log(json);
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
      <h1>백엔드가 알아서 해오삼</h1>
    </div>
  );
}

export default Detail;

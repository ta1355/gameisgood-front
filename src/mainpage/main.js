import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./main.module.css"; // CSS 모듈을 import
import { useNavigate } from "react-router-dom"; // 게시글 클릭 시 이동을 위해 추가

function Main() {
  const [message, setMessage] = useState(""); // 메시지 상태
  const [responseMessage, setResponseMessage] = useState(""); // 응답 메시지 상태
  const [messages, setMessages] = useState([]); // 대화 메시지들
  const [isOpen, setIsOpen] = useState(false); // 대화창 열고 닫기
  const [isTyping, setIsTyping] = useState(false); // 봇이 타이핑 중인지 여부
  const [popularPosts, setPopularPosts] = useState([]); // 인기 게시글 상태 추가
  const [games, setGames] = useState([]); // 게임 리스트 상태 추가
  const navigate = useNavigate();

  // 인기 게시글 불러오기
  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/post/today/popularity"
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Received popular posts:", data); // 데이터 확인용 로그
          setPopularPosts(data);
        } else {
          console.error("인기 게시글을 불러오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("Error fetching popular posts:", error);
      }
    };

    fetchPopularPosts();
  }, []);

  // 게임 리스트 불러오기
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch("http://localhost:8080/game/specials");
        const data = await response.json();
        setGames(data.specials.slice(0, 6)); // 상위 6개의 게임만 설정
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // 게시글 클릭 핸들러
  const handlePostClick = (postId) => {
    console.log("Clicked post ID:", postId); // ID 확인용 로그
    if (postId) {
      // ID가 있는 경우에만 네비게이트
      navigate(`/post/${postId}`);
    } else {
      console.error("게시글 ID가 없습니다.");
    }
  };

  // 메시지 전송 함수
  const sendMessageToBackend = async () => {
    // 사용자가 보낸 메시지를 대화창에 추가
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "You", text: message },
    ]);
    setMessage(""); // 메시지 입력란 초기화

    try {
      const requestData = {
        channel_id: "1298970279950946304", // 테스트용 채널 ID
        message: message, // 사용자가 입력한 메시지
      };

      // 타이핑 중 효과 추가 (타이핑 중 상태 활성화)
      setIsTyping(true);

      // 2초 후에 봇의 응답을 표시하도록 설정
      setTimeout(async () => {
        const response = await axios.post(
          "http://localhost:8080/sendMessage",
          requestData
        );

        if (response.data.status === "success") {
          setResponseMessage(response.data.message); // 성공 메시지
          // 봇의 응답을 대화 로그에 추가
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "Bot", text: response.data.message },
          ]);
        } else {
          setResponseMessage("Error: " + response.data.message); // 실패 메시지
        }

        setIsTyping(false); // 타이핑 중 상태 해제
      }, 1000); // 2초 후에 응답을 추가
    } catch (error) {
      console.error("Error sending message:", error);
      setResponseMessage("Error sending message.");
      setIsTyping(false); // 타이핑 중 상태 해제
    }
  };

  // 대화창 토글
  const toggleChatWindow = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.App}>
      <div className={styles.popularPostsSection}>
        <h2>오늘의 인기 게시글</h2>
        <div className={styles.popularPostsList}>
          {popularPosts.map((post, index) => (
            <div
              key={index}
              className={styles.popularPostItem}
              onClick={() => handlePostClick(post.id)}
            >
              <h3 className={styles.postTitle}>{post.title}</h3>
              <div className={styles.postInfo}>
                <span className={styles.postAuthor}>{post.username}</span>
                <span className={styles.postDate}>
                  {formatDate(post.createDateTime)}
                </span>
                <span className={styles.viewCount}>
                  조회수: {post.viewCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.gamesSection}>
        <h2>특가 게임</h2>
        <div className={styles.gamesList}>
          {games.map((game) => (
            <div key={game.id} className={styles.gameItem}>
              <img
                src={game.smallCapsuleImage}
                alt={game.name}
                className={styles.gameImage}
              />
              <h3 className={styles.gameName}>{game.name}</h3>
              <p className={styles.gamePrice}>{game.formattedFinalPrice}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.chatContainer} ${isOpen ? styles.open : ""}`}>
        <div className={styles.chatHeader}>
          <h2>도우미 봇</h2>
          <button onClick={toggleChatWindow} className={styles.closeBtn}>
            X
          </button>
        </div>
        <div className={styles.chatBody}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.chatMessage} ${
                msg.sender === "You" ? styles.userMessage : styles.botMessage
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}

          {/* 타이핑 중 메시지 표시 */}
          {isTyping && (
            <div className={styles.chatMessage}>
              <strong>Bot:</strong> <span className={styles.typing}>...</span>
            </div>
          )}
        </div>
        <div className={styles.chatInput}>
          <input
            type="text"
            placeholder="처음 이용시 '도움'을 입력하세요"
            value={message}
            onChange={(e) => setMessage(e.target.value)} // 메시지 입력
          />
          <button onClick={sendMessageToBackend}>Send</button>
        </div>
      </div>

      <div className={styles.chatIcon} onClick={toggleChatWindow}>
        💬
      </div>
    </div>
  );
}

export default Main;

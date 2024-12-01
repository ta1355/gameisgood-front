import React, { useState } from "react";
import axios from "axios";
import styles from "./main.module.css"; // CSS 모듈을 import

function Main() {
  const [message, setMessage] = useState(""); // 메시지 상태
  const [responseMessage, setResponseMessage] = useState(""); // 응답 메시지 상태
  const [messages, setMessages] = useState([]); // 대화 메시지들
  const [isOpen, setIsOpen] = useState(false); // 대화창 열고 닫기
  const [isTyping, setIsTyping] = useState(false); // 봇이 타이핑 중인지 여부

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
            placeholder="Enter your message"
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

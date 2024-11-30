import React, { useState } from "react";
import axios from "axios";

function Main() {
  const [message, setMessage] = useState(""); // 메시지 상태
  const [responseMessage, setResponseMessage] = useState(""); // 응답 메시지 상태

  // 메시지 전송 함수
  const sendMessageToBackend = async () => {
    try {
      const requestData = {
        channel_id: "1298970279950946304", // 테스트용 채널 ID
        message: message, // 사용자가 입력한 메시지
      };

      // Spring Boot 서버의 /sendMessage 엔드포인트로 POST 요청
      const response = await axios.post(
        "http://localhost:8080/sendMessage",
        requestData
      );

      // 응답을 받아서 화면에 출력
      if (response.data.status === "success") {
        setResponseMessage(response.data.message); // 성공 메시지
      } else {
        setResponseMessage("Error: " + response.data.message); // 실패 메시지
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setResponseMessage("Error sending message.");
    }
  };

  return (
    <div className="App">
      <h1>Discord Message Sender</h1>

      <input
        type="text"
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)} // 메시지 입력
      />

      <button onClick={sendMessageToBackend}>Send Message</button>

      <p>Response: {responseMessage}</p>
    </div>
  );
}

export default Main;

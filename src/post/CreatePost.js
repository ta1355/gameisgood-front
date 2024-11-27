import { useState } from "react";
import styles from "./CreatePost.module.css";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [gameTag, setGameTag] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const maxSize = 5 * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png"];

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    //공백제거후 유효성 검사
    if (title.trim() === "") {
      alert("제목을 입력해주세요.");
      return;
    }

    if (title.length > 100) {
      alert("제목은 100자 이하로 입력해주세요.");
      return;
    }

    if (content.trim() === "") {
      alert("내용을 입력해주세요.");
      return;
    }

    if (content.length > 500) {
      alert("내용은 500자 이하로 입력해주세요.");
      return;
    }

    if (image && !allowedTypes.includes(image.type)) {
      alert("JPG, PNG 형식만 업로드 가능합니다.");
      return;
    }

    if (image && image.size > maxSize) {
      alert("이미지 파일 크기는 5MB 이하로 업로드해주세요.");
      return;
    }

    // 유효성 검사를 모두 통과하면 서버로 데이터 전송
    const formData = new FormData();
    formData.append("title", title);
    formData.append("detail", content);
    formData.append("game", gameTag);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:8080/createpost", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert("게시글이 성공적으로 작성되었습니다!");
        navigate("/post/list");
      } else {
        alert("게시글 작성에 실패했습니다.");
      }
    } catch (error) {
      alert("서버와의 연결에 문제가 발생했습니다.");
    }
  };

  return (
    <div className={styles.createPostContainer}>
      <form className={styles.createPostForm} onSubmit={handleSubmit}>
        <label htmlFor="title">제목</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 적어주세요"
        />

        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          rows="4"
          cols="50"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 작성해주세요. 타인에게 불쾌감을 줄 수 있는 언어나 비하적인 표현은 삼가해 주세요. 부적절한 언어 사용 시 제재가 있을 수 있습니다."
        />

        <label htmlFor="gameTag">태그할 게임</label>
        <input
          id="gameTag"
          type="text"
          value={gameTag}
          onChange={(e) => setGameTag(e.target.value)}
          placeholder="태그할 게임이름을 적어주세요"
        />

        <label htmlFor="image">이미지 업로드</label>
        <input id="image" type="file" onChange={handleImageChange} />

        <button type="submit">게시글 작성</button>
      </form>
    </div>
  );
}

export default CreatePost;

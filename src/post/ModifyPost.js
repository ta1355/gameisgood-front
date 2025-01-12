import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ModifyPost.module.css";

function ModifyPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [game, setGame] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const maxSize = 5 * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png"];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8080/post/${id}`);
        if (!response.ok) {
          throw new Error("데이터를 가져오지 못했습니다.");
        }
        const json = await response.json();
        setPost(json);
        setTitle(json.title);
        setDetail(json.detail);
        setGame(json.game);
        setImage(json.image);
      } catch (e) {
        console.error("데이터 로딩 실패:", e);
        setError("게시글을 로드하는 중에 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    // 유효성 검사
    if (title.trim() === "") {
      alert("제목을 입력해주세요.");
      return;
    }

    if (title.length > 100) {
      alert("제목은 100자 이하로 입력해주세요.");
      return;
    }

    if (detail.trim() === "") {
      alert("내용을 입력해주세요.");
      return;
    }

    if (detail.length > 500) {
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

    const formData = new FormData();
    formData.append("title", title);
    formData.append("detail", detail);
    formData.append("game", game);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`http://localhost:8080/post/${id}`, {
        method: "PATCH",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("게시글이 성공적으로 수정되었습니다.");
        navigate(`/post/${id}`);
      } else if (response.status === 403) {
        alert("게시글 수정 권한이 없습니다.");
      } else {
        throw new Error("게시글 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("게시글 수정 중 오류 발생:", error);
      setError("게시글 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!post)
    return <div className={styles.error}>게시글을 찾을 수 없습니다.</div>;

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

        <label htmlFor="detail">내용</label>
        <textarea
          id="detail"
          rows="4"
          cols="50"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="내용을 작성해주세요. 타인에게 불쾌감을 줄 수 있는 언어나 비하적인 표현은 삼가해 주세요. 부적절한 언어 사용 시 제재가 있을 수 있습니다."
        />

        <label htmlFor="game">태그할 게임</label>
        <input
          id="game"
          type="text"
          value={game}
          onChange={(e) => setGame(e.target.value)}
          placeholder="태그할 게임이름을 적어주세요"
        />

        <label htmlFor="image">이미지 업로드</label>
        <input id="image" type="file" onChange={handleImageChange} />

        <button type="submit">게시글 수정</button>
      </form>
    </div>
  );
}

export default ModifyPost;

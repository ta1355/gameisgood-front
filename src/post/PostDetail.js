import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./PostDetail.module.css"; // CSS Module 불러오기

function Detail() {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const getPost = async () => {
    try {
      const response = await fetch(`http://localhost:8080/post/${id}`);
      if (!response.ok) {
        throw new Error("데이터를 가져오지 못했습니다.");
      }
      const json = await response.json();
      setPost(json);
    } catch (e) {
      console.error("데이터 로딩 실패:", e);
      setError("게시글을 로드하는 중에 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getPost();
    }
  }, [id]);

  // 로딩, 에러, 데이터 없을 때의 상태 처리
  if (loading) {
    return <h1 className={styles.loadingText}>로딩중...</h1>;
  }

  if (error) {
    return <h1 className={styles.errorMessage}>{error}</h1>; // 에러 메시지 표시
  }

  if (!post) {
    return <h1 className={styles.errorMessage}>게시글을 찾을 수 없습니다.</h1>; // 포스트가 없을 경우
  }

  // post가 존재할 때만 imageUrl을 설정
  const imageUrl = post.image ? `http://localhost:8080${post.image}` : null;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.postBox}>
        <div className={styles.titleSection}>
          <div className={styles.titleContainer}>
            <h2 className={styles.postTitle}>{post.title}</h2>
            <h3 className={styles.gameName}>{post.game}</h3>
          </div>
          <p className={styles.createDate}>
            {new Date(post.createDateTime).toLocaleString()}
          </p>
        </div>

        {/* 이미지 섹션 */}
        <div className={styles.imageSection}>
          {imageUrl && (
            <img className={styles.postImage} src={imageUrl} alt={post.title} />
          )}
          <p className={styles.postDetail}>{post.detail}</p>
        </div>
      </div>
    </div>
  );
}

export default Detail;

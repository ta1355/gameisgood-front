import { useNavigate } from "react-router-dom";
import styles from "./Posts.module.css"; // CSS Module 불러오기

function Posts({
  id,
  title,
  detail,
  createDateTime,
  deletedDateTime,
  likeCount,
  image,
  user,
  comments,
  game,
}) {
  const navigate = useNavigate();

  const formattedDate = new Date(createDateTime).toLocaleString();
  const formattedDeletedDate = deletedDateTime
    ? new Date(deletedDateTime).toLocaleString()
    : null;

  const handleTitleClick = () => {
    navigate(`/post/${id}`);
  };

  return (
    <div className={styles.post}>
      <h2 onClick={handleTitleClick} style={{ cursor: "pointer" }}>
        {title}
      </h2>
      <p>{detail}</p>

      {/* 포스트 정보 가로로 배치 */}
      <div className={styles.postInfo}>
        <p>
          <strong>게임:</strong> {game}
        </p>
        <p>
          <strong>추천수:</strong> {likeCount}
        </p>
        <p>
          <strong>작성일:</strong> {formattedDate}
        </p>
        {formattedDeletedDate && (
          <p className={styles.deletedDate}>
            <strong>삭제일:</strong> {formattedDeletedDate}
          </p>
        )}
      </div>

      <p>
        <strong>유저:</strong>{" "}
        {user === "없음" ? "없음" : user.name || "정보 없음"}
      </p>
    </div>
  );
}

export default Posts;

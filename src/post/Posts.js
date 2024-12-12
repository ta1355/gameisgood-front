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

  // 날짜 포맷 함수
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Intl.DateTimeFormat("ko-KR", options).format(new Date(date));
  };

  const formattedDate = formatDate(createDateTime);
  const formattedDeletedDate = deletedDateTime
    ? formatDate(deletedDateTime)
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
        <strong>유저: </strong>
        {user === "없음" || !user ? "없음" : user || "정보 없음"}
      </p>
    </div>
  );
}

export default Posts;

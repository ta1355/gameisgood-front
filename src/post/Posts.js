import { useNavigate } from "react-router-dom";
import styles from "./Posts.module.css";

function Posts({
  id,
  title,
  detail,
  createDateTime,
  deletedDateTime,
  likeCount,
  viewCount,
  image,
  username,
  comments,
  game,
}) {
  const navigate = useNavigate();

  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
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
    <div className={styles.post} onClick={handleTitleClick}>
      <h2>{title}</h2>
      <p>{detail}</p>
      <div className={styles.postInfo}>
        <span>게임: {game}</span>
        <span>추천수: {likeCount}</span>
        <span>조회수: {viewCount}</span>
        <span>작성일: {formattedDate}</span>
        {formattedDeletedDate && <span>삭제일: {formattedDeletedDate}</span>}
        <span>
          작성자:{" "}
          {username === "없음" || !username ? "없음" : username || "정보 없음"}
        </span>
      </div>
    </div>
  );
}

export default Posts;

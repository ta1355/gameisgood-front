import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./PostDetail.module.css";

function Detail() {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { id } = useParams();

  const getPost = async () => {
    try {
      const response = await fetch(`http://localhost:8080/post/${id}`);
      if (!response.ok) {
        throw new Error("데이터를 가져오지 못했습니다.");
      }
      const json = await response.json();
      setPost(json);
      setLiked(json.liked);
      if (json.comments && json.comments.length > 0) {
        setComments(json.comments);
      } else {
        await getComments();
      }
    } catch (e) {
      console.error("데이터 로딩 실패:", e);
      setError("게시글을 로드하는 중에 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/posts/${id}/comments`
      );
      if (!response.ok) {
        throw new Error("댓글을 불러오지 못했습니다.");
      }
      const commentsData = await response.json();
      setComments(commentsData);
    } catch (e) {
      console.error("댓글 로딩 실패:", e);
      setError("댓글을 불러오는 중에 오류가 발생했습니다.");
    }
  };

  const incrementViewCount = async () => {
    try {
      await fetch(`http://localhost:8080/post/${id}/view`, { method: "POST" });
    } catch (e) {
      console.error("조회수 증가 실패:", e);
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("로그인 정보가 없습니다.");
      return;
    }
    if (liked) {
      alert("이미 좋아요를 누르셨습니다.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/postlike/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setLiked(true);
        setPost((prevPost) => ({
          ...prevPost,
          likeCount: prevPost.likeCount + 1,
        }));
      } else {
        throw new Error("좋아요 처리에 실패했습니다.");
      }
    } catch (error) {
      alert("이미 좋아요를 누르셨습니다.");
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("로그인 정보가 없습니다.");
      return;
    }
    if (!newComment.trim()) {
      setError("댓글을 입력하세요.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/posts/${id}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ detail: newComment }),
        }
      );
      if (response.ok) {
        const addedComment = await response.json();
        setComments((prevComments) => [addedComment, ...prevComments]);
        setNewComment("");
      } else {
        throw new Error("댓글 작성에 실패했습니다.");
      }
    } catch (error) {
      setError("댓글 작성 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (id) {
      getPost();
      incrementViewCount();
    }
  }, [id]);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!post)
    return <div className={styles.error}>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.postBox}>
        <div className={styles.titleSection}>
          <div className={styles.titleContainer}>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <span className={styles.gameName}>{post.game}</span>
          </div>
          <p className={styles.createDate}>
            작성일: {new Date(post.createDateTime).toLocaleString()}
          </p>
          <p className={styles.viewCount}>조회수: {post.viewCount}</p>
        </div>

        {post.image && (
          <div className={styles.imageSection}>
            <img
              src={post.image}
              alt="게시글 이미지"
              className={styles.postImage}
            />
          </div>
        )}

        <div className={styles.detailSection}>
          <p className={styles.postDetail}>{post.detail}</p>
        </div>

        <div className={styles.likeSection}>
          <button
            onClick={handleLike}
            disabled={liked}
            className={styles.likeButton}
          >
            {liked ? "이미 좋아요를 누르셨습니다" : "좋아요"}
          </button>
        </div>

        <h2>댓글</h2>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="댓글을 입력하세요"
          />
          <button type="submit">댓글 작성</button>
        </form>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <p>{comment.detail}</p>
              <p>작성자: {comment.username}</p>
              <p>{new Date(comment.createDateTime).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Detail;

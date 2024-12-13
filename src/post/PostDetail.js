import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./PostDetail.module.css"; // CSS Module 불러오기

function Detail() {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // 댓글 상태 추가
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false); // 좋아요 상태 추가
  const [newComment, setNewComment] = useState(""); // 새 댓글 상태 추가
  const { id } = useParams();

  const getPost = async () => {
    try {
      const response = await fetch(`http://localhost:8080/post/${id}`);
      if (!response.ok) {
        throw new Error("데이터를 가져오지 못했습니다.");
      }
      const json = await response.json();
      setPost(json);
      setLiked(json.liked); // 서버에서 좋아요 상태를 받아와서 설정

      // 댓글이 있을 경우에만 댓글을 가져옴
      if (json.comments && json.comments.length > 0) {
        setComments(json.comments); // 이미 댓글이 포함되어 있을 수 있음
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
      setComments(commentsData); // 댓글 데이터를 상태에 저장
    } catch (e) {
      console.error("댓글 로딩 실패:", e);
      setError("댓글을 불러오는 중에 오류가 발생했습니다.");
    }
  };

  const handleLike = async () => {
    const token = localStorage.getItem("jwtToken"); // 또는 sessionStorage 사용

    if (!token) {
      setError("로그인 정보가 없습니다.");
      return;
    }

    if (liked) {
      // 이미 좋아요를 눌렀을 경우
      alert("이미 좋아요를 누르셨습니다.");
      return; // 좋아요 상태일 때는 요청을 보내지 않도록 리턴
    }

    try {
      const response = await fetch(`http://localhost:8080/postlike/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰을 헤더에 추가
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
        // 그 외 오류
        throw new Error("좋아요 처리에 실패했습니다.");
      }
    } catch (error) {
      alert("이미 좋아요를 누르셨습니다.");
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value); // 새 댓글 상태 업데이트
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 새로 고침 방지
    const token = localStorage.getItem("jwtToken"); // JWT 토큰 확인

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
        `http://localhost:8080/posts/${id}/comments`, // 백엔드의 댓글 생성 API 호출
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 포함
            "Content-Type": "application/json", // 요청 본문은 JSON 형식
          },
          body: JSON.stringify({ detail: newComment }), // detail로 변경
        }
      );

      if (response.ok) {
        const addedComment = await response.json(); // 서버에서 응답 받은 댓글 데이터
        setComments((prevComments) => [addedComment, ...prevComments]); // 새 댓글을 기존 댓글 목록에 추가
        setNewComment(""); // 댓글 입력란 초기화
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
      getComments();
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

        {/* 좋아요 버튼 섹션 */}
        <div className={styles.likeSection}>
          {liked ? (
            <button
              className={styles.likeButton}
              onClick={() => alert("이미 좋아요를 누르셨습니다.")}
            >
              이미 좋아요를 누르셨습니다
            </button>
          ) : (
            <button className={styles.likeButton} onClick={handleLike}>
              좋아요 ({post.likeCount})
            </button>
          )}
        </div>

        {/* 댓글 섹션 */}
        <div className={styles.commentSection}>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className={styles.commentBox}>
                <p>{comment.detail}</p> {/* 서버에서 받은 detail 필드로 변경 */}
                <p className={styles.commentAuthor}>
                  작성자: {comment.username}
                </p>
                <p className={styles.commentDate}>
                  {new Date(comment.createDateTime).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>댓글이 없습니다.</p>
          )}
        </div>

        {/* 댓글 작성 폼 */}
        <div className={styles.commentForm}>
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={handleCommentChange}
              placeholder="댓글을 작성하세요..."
              className={styles.commentInput}
            />
            <button type="submit" className={styles.submitCommentButton}>
              댓글 작성
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Detail;

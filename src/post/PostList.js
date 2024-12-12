import { useEffect, useState } from "react";
import Posts from "./Posts"; // Posts 컴포넌트 불러오기
import styles from "./PostList.module.css"; // CSS Module 불러오기
import { useNavigate } from "react-router-dom";

function PostList() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const getList = async () => {
    try {
      const response = await fetch(`http://localhost:8080/post`);
      const json = await response.json();

      console.log(json);
      setList(json); // 데이터를 받아서 상태로 설정
      setLoading(false);
    } catch (e) {
      console.log("오류:" + e);
      setLoading(false);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const handleTitleClick = () => {
    navigate(`/post/create`);
  };

  // jwtToken이 로컬 스토리지에 있는지 확인
  const isAuthenticated = localStorage.getItem("jwtToken");

  return (
    <div className={styles.postListContainer}>
      {loading ? (
        <h1 className={styles.loadingText}>로딩중...</h1>
      ) : (
        <div>
          {list.length === 0 ? (
            <h1 className={styles.noResultsMessage}>검색 결과가 없습니다.</h1>
          ) : (
            <div className={styles.gameList}>
              {list.map((post) => (
                <Posts
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  detail={post.detail}
                  createDateTime={post.createDateTime}
                  deletedDateTime={post.deletedDateTime}
                  likeCount={post.likeCount}
                  image={post.image || "없음"}
                  user={post.username || "없음"}
                  comments={post.comments}
                  game={post.game}
                />
              ))}
            </div>
          )}
          {/* jwtToken이 있을 때만 "게시글 등록" 버튼을 표시 */}
          {isAuthenticated && (
            <div className={styles.buttonContainer}>
              <button onClick={handleTitleClick}>게시글 등록</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PostList;

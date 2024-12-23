import { useEffect, useState } from "react";
import Posts from "./Posts";
import styles from "./PostList.module.css";
import { useNavigate } from "react-router-dom";

function PostList() {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const getList = async (page) => {
    try {
      const response = await fetch(
        `http://localhost:8080/post?page=${page}&size=10`
      );
      const data = await response.json();
      setList(data.content);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (e) {
      console.log("오류:" + e);
      setLoading(false);
    }
  };

  useEffect(() => {
    getList(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleTitleClick = () => {
    navigate(`/post/create`);
  };

  const isAuthenticated = localStorage.getItem("jwtToken");

  return (
    <div className={styles.postListContainer}>
      {loading ? (
        <div className={styles.loadingText}>Loading...</div>
      ) : list.length === 0 ? (
        <div className={styles.noResultsMessage}>게시글이 없습니다.</div>
      ) : (
        <div className={styles.gameList}>
          {list.map((post) => (
            <Posts key={post.id} {...post} />
          ))}
          <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={
                  currentPage === i
                    ? styles.activePageButton
                    : styles.pageButton
                }
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className={styles.writeButtonContainer}>
        {isAuthenticated && <button onClick={handleTitleClick}>글쓰기</button>}
      </div>
    </div>
  );
}

export default PostList;

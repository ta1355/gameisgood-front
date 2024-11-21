import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./GameList.module.css";

function GameList({
  id,
  name,
  discounted,
  discountPercent,
  currency,
  largeCapsuleImage,
  smallCapsuleImage,
  windowsAvailable,
  macAvailable,
  linuxAvailable,
  streamingVideoAvailable,
  discountExpiration,
  headerImage,
  headline,
  formattedOriginalPrice,
  formattedFinalPrice,
}) {
  return (
    <div className={styles.game}>
      <img src={largeCapsuleImage} alt={name} className={styles.game__image} />
      <div className={styles.game__details}>
        <h2 className={styles.game__title}>{name}</h2>
        {headline && <p className={styles.game__headline}>{headline}</p>}
        <p className={styles.game__price}>
          가격: <span>{formattedFinalPrice}</span> ({discountPercent}% 할인)
        </p>

        <div className={styles.game__discount}>
          {discounted ? "할인 중!" : "할인 없음"}
        </div>

        <div className={styles.game__platforms}>
          <p className={styles.game__platform}>
            Windows: {windowsAvailable ? "실행 가능" : "실행 불가"}
          </p>
          <p className={styles.game__platform}>
            Mac: {macAvailable ? "실행 가능" : "실행 불가"}
          </p>
          <p className={styles.game__platform}>
            Linux: {linuxAvailable ? "실행 가능" : "실행 불가"}
          </p>
        </div>

        <Link to={`/test/${id}`} className={styles.game__link}>
          자세히 보기
        </Link>
      </div>
    </div>
  );
}

GameList.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  discounted: PropTypes.bool.isRequired,
  discountPercent: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  largeCapsuleImage: PropTypes.string.isRequired,
  smallCapsuleImage: PropTypes.string.isRequired,
  windowsAvailable: PropTypes.bool.isRequired,
  macAvailable: PropTypes.bool.isRequired,
  linuxAvailable: PropTypes.bool.isRequired,
  streamingVideoAvailable: PropTypes.bool.isRequired,
  discountExpiration: PropTypes.number.isRequired,
  headerImage: PropTypes.string.isRequired,
  headline: PropTypes.string,
  formattedOriginalPrice: PropTypes.string.isRequired,
  formattedFinalPrice: PropTypes.string.isRequired,
};

export default GameList;

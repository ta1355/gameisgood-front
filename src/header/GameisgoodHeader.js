import { useState } from "react";
import styles from "./Header.module.css";

function Header() {
  return (
    <div>
      <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
        <div className="container-fluid">
          <a className={styles.navbarBrand} href="#">
            GameisGood
          </a>
          <button
            className={`navbar-toggler ${styles.navbarToggler}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span
              className={`navbar-toggler-icon ${styles.navbarTogglerIcon}`}
            ></span>
          </button>
          <div
            className={`collapse navbar-collapse ${styles.navbarCollapse}`}
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  홈
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  로그인
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  메뉴
                </a>
                <ul
                  className={`dropdown-menu ${styles.dropdownMenu}`}
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      href="#"
                    >
                      인기순
                    </a>
                  </li>
                  <li>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      href="#"
                    >
                      최신순
                    </a>
                  </li>
                  <li>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      href="#"
                    >
                      기타
                    </a>
                  </li>
                  <li>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      href="#"
                    >
                      이건 뭘 해야할까
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      href="#"
                    >
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            <form className="d-flex">
              <input
                className={`form-control me-2 ${styles.formControl}`}
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                className={`btn btn-outline-success ${styles.btnOutlineSuccess}`}
                type="submit"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;

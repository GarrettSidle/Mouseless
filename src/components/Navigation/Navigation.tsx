import { Component } from "react";
import "./Navigation.css";
import { getSessionId, clearSessionId } from "../../utils/cookies";
import { getRequest } from "../../utils/api";

interface SessionResponse {
  session_id: string;
  username: string;
  created_at: string;
}

const navLinks = [
  {
    title: "Home",
    link: "/Home",
    target: "",
  },
  {
    title: "Problems",
    link: "/Editor",
    target: "",
  },
  {
    title: "Shortcuts",
    link: "/Shortcuts",
    target: "",
  },
];

export class navigation extends Component<
  {},
  {
    navUnfolded: boolean;
    currentPath: string;
    username: string | null;
    dropdownOpen: boolean;
  }
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      navUnfolded: false,
      currentPath: window.location.pathname,
      username: null,
      dropdownOpen: false,
    };
  }

  componentDidMount() {
    window.addEventListener("popstate", this.handlePathChange);
    this.updateCurrentPath();
    this.checkAuthStatus();
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.handlePathChange);
    // Close dropdown when clicking outside
    document.removeEventListener("click", this.handleClickOutside);
  }

  checkAuthStatus = async () => {
    const sessionId = getSessionId();
    if (sessionId) {
      try {
        const response = await getRequest<SessionResponse>({
          endpoint: "/api/auth/validate",
        });
        this.setState({ username: response.username });
      } catch (error) {
        // Session invalid, clear it
        clearSessionId();
        this.setState({ username: null });
      }
    }
  };

  handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".user-dropdown")) {
      this.setState({ dropdownOpen: false });
      document.removeEventListener("click", this.handleClickOutside);
    }
  };

  toggleDropdown = () => {
    const newState = !this.state.dropdownOpen;
    this.setState({ dropdownOpen: newState });

    if (newState) {
      // Add listener when opening dropdown
      setTimeout(() => {
        document.addEventListener("click", this.handleClickOutside);
      }, 0);
    } else {
      document.removeEventListener("click", this.handleClickOutside);
    }
  };

  handleSignOut = () => {
    clearSessionId();
    this.setState({ username: null, dropdownOpen: false });
    window.location.href = "/Home";
  };

  handlePathChange = () => {
    this.updateCurrentPath();
  };

  updateCurrentPath = () => {
    this.setState({ currentPath: window.location.pathname });
  };

  togglenav = () => {
    this.setState((prevState) => ({
      navUnfolded: !prevState.navUnfolded,
    }));
  };

  handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    e.preventDefault();
    window.history.pushState({}, "", link);
    this.setState({ currentPath: link, navUnfolded: false });
    // Trigger popstate event to notify App component
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  public render() {
    const { navUnfolded, currentPath } = this.state;

    return (
      <div className={navUnfolded ? "nav-wrapper enabled" : "nav-wrapper"}>
        <nav className="navigation">
          <div className="nav-container">
            <a
              href="/Home"
              className="nav-brand"
              onClick={(e) => this.handleLinkClick(e, "/Home")}
            >
              <span className="brand-text">Mouseless</span>
            </a>

            <div className={`nav-links ${navUnfolded ? "mobile-open" : ""}`}>
              {navLinks.map((navLink) => {
                const isActive =
                  currentPath === navLink.link ||
                  (navLink.link === "/Home" && currentPath === "/");
                return (
                  <a
                    key={navLink.title}
                    href={navLink.link}
                    className={`nav-link ${isActive ? "active" : ""}`}
                    onClick={(e) => this.handleLinkClick(e, navLink.link)}
                  >
                    {navLink.title}
                  </a>
                );
              })}
            </div>

            <div className="nav-account">
              {this.state.username ? (
                <div className="user-dropdown">
                  <button
                    className="user-menu-button"
                    onClick={this.toggleDropdown}
                  >
                    <span className="user-greeting">
                      Hello {this.state.username}
                    </span>
                    <svg
                      className={`dropdown-arrow ${
                        this.state.dropdownOpen ? "open" : ""
                      }`}
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 4L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {this.state.dropdownOpen && (
                    <div className="dropdown-menu">
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          this.setState({ dropdownOpen: false });
                          // Navigate to account page (placeholder for now)
                          window.location.href = "/Home";
                        }}
                      >
                        Account
                      </button>
                      <button
                        className="dropdown-item"
                        onClick={this.handleSignOut}
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <a
                    href="/Login?page=signIn"
                    className="nav-login"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = "/Login?page=signIn";
                    }}
                  >
                    Login
                  </a>
                  <a
                    href="/Login?page=signUp"
                    className="nav-signup"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = "/Login?page=signUp";
                    }}
                  >
                    Sign Up
                  </a>
                </>
              )}
            </div>

            <button
              className={`hamburger ${navUnfolded ? "active" : ""}`}
              onClick={this.togglenav}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>
      </div>
    );
  }
}

export default navigation;

import { Component } from "react";
import "./Navigation.css";

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
  { navUnfolded: boolean; currentPath: string }
> {
  constructor(props: {}) {
    super(props);
    this.state = {
      navUnfolded: false,
      currentPath: window.location.pathname,
    };
  }

  componentDidMount() {
    window.addEventListener("popstate", this.handlePathChange);
    this.updateCurrentPath();
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.handlePathChange);
  }

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
              <span className="brand-icon">⌨️</span>
              <span className="brand-text">Mouseless</span>
            </a>

            <div className={`nav-links ${navUnfolded ? "mobile-open" : ""}`}>
              {navLinks.map((navLink) => {
                const isActive = currentPath === navLink.link || 
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

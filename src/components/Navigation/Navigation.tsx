import { Component } from "react";

import "./Navigation.css";


const navLinks = [
  {
    title: "Home",
    link: "/Home",
    target: ""
  },
  {
    title: "Problems",
    link: "/Editor",
    target: ""
  },
  {
    title: "Shortcuts",
    link: "/Shortcuts",
    target: ""
  },

]
export class navigation extends Component<{}, { navUnfolded: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      navUnfolded: false,
    };
  }

  togglenav = () => {
    this.setState((prevState) => ({
      navUnfolded: !prevState.navUnfolded,
    }));
  };


  public render() {
    return (
      <div className={this.state.navUnfolded ? "enabled" : ""}>
        <nav className="navigation">
          <div className="nav-objects">
            <a href="/Home" className="nav-brand">Mouseless.us</a>
            <button className="hamburger" onClick={() => { this.togglenav() }}>☰</button>
            <div className="nav-links">
              {navLinks.map((navLink) => (
                <a key={navLink.title} target={navLink.target} href={navLink.link}>{navLink.title.toLocaleUpperCase()}</a>
              ))}
            </div>
            <div className="nav-account">
              <a href="/Login?page=signIn">LOGIN</a>
              <a href="/Login?page=signUp">SIGN UP</a>
              <div>HELLO GARRETT</div>
            </div>
          </div>
        </nav>
      </div>
    );
  }


}
export default navigation;

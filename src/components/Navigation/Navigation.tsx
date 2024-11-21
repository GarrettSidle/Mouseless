import { Component } from "react";

import "./Navigation.css";


const NavLinks = [0]
export class Navigation extends Component<{}, { navUnfolded: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      navUnfolded: false,
    };
  }

  toggleNav = () => {
    this.setState((prevState) => ({
      navUnfolded: !prevState.navUnfolded,
    }));
  };


  public render() {
    return (
      <div className="Navigation">
      </div>
    );
  }


}
export default Navigation;

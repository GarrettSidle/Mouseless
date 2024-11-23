import { Component } from "react";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Editor from "./pages/Editor/Editor";
import Login from "./pages/Login/Login";


interface RouterState {
  currentPath: string;
}

class App extends Component<{}, RouterState> {
  constructor(props: any) {
    super(props);
    this.state = {
      currentPath: window.location.pathname, // Get the current path
    };
  }

  navigateTo = (path: any) => {
    window.history.pushState({}, "", path);
    this.setState({ currentPath: path });
  };

  componentDidMount() {
    window.onpopstate = () => {
      this.setState({ currentPath: window.location.pathname });
    };
  }

  componentWillUnmount() {
    window.onpopstate = null;
  }

  render() {
    let ComponentToRender;

    switch (this.state.currentPath) {
      case "/":
        ComponentToRender = Editor;
        break;
      case "/Editor":
        ComponentToRender = Editor;
        break;
      case "/Login":
        ComponentToRender = Login;
        break;
      default:
        ComponentToRender = () => <div>404 Not Found</div>;
    }

    return (
      <div className="App">
        <Navigation />
        <ComponentToRender />
      </div>
    );
  }
}

export default App;


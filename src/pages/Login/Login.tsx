import { Component } from "react";
import "./Login.css";

interface LoginFormState {
  isSignUp: boolean; 
  email: string;
  password: string;
}

export class Login extends Component<{}, LoginFormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isSignUp: false, 
      email: '',
      password: '',
    };
  }

  // Handle form input changes
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      ...prevState, 
      [name]: value, 
    }));
  };


  // Toggle between Sign Up and Sign In
  toggleForm = () => {
    this.setState((prevState) => ({
      isSignUp: !prevState.isSignUp,
    }));
  };

  // Handle form submission (for both Sign In and Sign Up)
  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Logic for submitting form (e.g., validation, API calls)
    console.log('Submitted:', this.state.email, this.state.password);
  };

  public render() {
    const { isSignUp, email, password } = this.state;

    return (
      <div className="login-page">
        <div className="login-container">
          <h1>{isSignUp ? "Sign Up" : "Sign In"}</h1>

          <form onSubmit={this.handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={this.handleInputChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
          </form>

          <p className="toggle-form">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <span onClick={this.toggleForm} className="link">
                  Sign In
                </span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span onClick={this.toggleForm} className="link">
                  Sign Up
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    );
  }
}

export default Login;

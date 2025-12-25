import { Component } from "react";
import "./Login.css";
import { postRequest } from "../../utils/api";

interface LoginFormState {
  isSignUp: boolean;
  email: string;
  password: string;
}

export class Login extends Component<{}, LoginFormState> {
  constructor(props: {}) {
    super(props);
    const urlParams = new URLSearchParams(window.location.search);
    const isSignUp = urlParams.get("page") === "signUp";

    this.state = {
      isSignUp: isSignUp,
      email: "",
      password: "",
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
    console.log("Submitted:", this.state.email, this.state.password);
  };

  private async handleLogin() {
    try {
      const response = await postRequest<{ id: string }>({
        endpoint: "https://api.example.com/create-user",
        data: {
          password: "",
          email: "john@example.com",
        },
      });
      console.log("User created with ID:", response.id);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  }

  public render() {
    const { isSignUp, email, password } = this.state;

    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-title">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
          </div>

          <form onSubmit={this.handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                placeholder="you@example.com"
                onChange={this.handleInputChange}
                required
                autoComplete="email"
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
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>

            <button
              type="submit"
              className="login-button"
              onClick={() => {
                this.handleLogin();
              }}
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <p className="toggle-form">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={this.toggleForm}
                  className="toggle-link"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={this.toggleForm}
                  className="toggle-link"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    );
  }
}

export default Login;

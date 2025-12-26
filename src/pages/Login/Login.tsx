import { Component } from "react";
import "./Login.css";
import { postRequest } from "../../utils/api";
import { setSessionId } from "../../utils/cookies";

interface LoginFormState {
  isSignUp: boolean;
  username: string;
  password: string;
  error: string | null;
  isLoading: boolean;
}

interface RegisterResponse {
  id: number;
  username: string;
  created_at: string;
}

interface LoginResponse {
  session_id: string;
  created_at: string;
}

export class Login extends Component<{}, LoginFormState> {
  constructor(props: {}) {
    super(props);
    const urlParams = new URLSearchParams(window.location.search);
    const isSignUp = urlParams.get("page") === "signUp";

    this.state = {
      isSignUp: isSignUp,
      username: "",
      password: "",
      error: null,
      isLoading: false,
    };
  }

  // Handle form input changes
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
      error: null, // Clear error on input change
    }));
  };

  // Toggle between Sign Up and Sign In
  toggleForm = () => {
    this.setState((prevState) => ({
      isSignUp: !prevState.isSignUp,
      error: null,
      username: "",
      password: "",
    }));
  };

  // Handle form submission (for both Sign In and Sign Up)
  handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    this.setState({ isLoading: true, error: null });

    try {
      if (this.state.isSignUp) {
        await this.handleRegister();
      } else {
        await this.handleLogin();
      }
    } catch (error: any) {
      this.setState({
        error: error.message || "An error occurred. Please try again.",
        isLoading: false,
      });
    }
  };

  private async handleRegister() {
    const { username, password } = this.state;

    // Validation
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      this.setState({ error: "Username cannot be empty", isLoading: false });
      return;
    }

    if (trimmedUsername.length < 3) {
      this.setState({
        error: "Username must be at least 3 characters",
        isLoading: false,
      });
      return;
    }

    if (password.length < 3) {
      this.setState({
        error: "Password must be at least 3 characters",
        isLoading: false,
      });
      return;
    }

    try {
      const response = await postRequest<RegisterResponse>({
        endpoint: "/api/auth/register",
        data: {
          username: trimmedUsername,
          password: password,
        },
      });

      console.log("User registered:", response.username);

      // After successful registration, automatically log in
      await this.handleLogin();
    } catch (error: any) {
      this.setState({
        error:
          error.message || "Registration failed. Username may already exist.",
        isLoading: false,
      });
    }
  }

  private async handleLogin() {
    const { username, password } = this.state;

    // Validation
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      this.setState({ error: "Username cannot be empty", isLoading: false });
      return;
    }

    if (!password) {
      this.setState({ error: "Password cannot be empty", isLoading: false });
      return;
    }

    try {
      const response = await postRequest<LoginResponse>({
        endpoint: "/api/auth/login",
        data: {
          username: trimmedUsername,
          password: password,
        },
      });

      // Save session ID to cookie
      setSessionId(response.session_id);
      console.log("Logged in successfully, session saved");

      // Redirect to home page
      window.location.href = "/Home";
    } catch (error: any) {
      this.setState({
        error: error.message || "Invalid username or password",
        isLoading: false,
      });
    }
  }

  public render() {
    const { isSignUp, username, password, error, isLoading } = this.state;

    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-title">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={this.handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                placeholder="Enter your username"
                onChange={this.handleInputChange}
                required
                autoComplete="username"
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading
                ? "Please wait..."
                : isSignUp
                ? "Create Account"
                : "Sign In"}
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

import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "./PageNav";
import Button from "./Button";
import { useAuth } from "../contexts/FakeAuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register, clearError, authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    if (isRegistering) {
      register({ name, email, password });
      return;
    }

    login(email, password);
  }

  function toggleMode() {
    setIsRegistering((current) => !current);
    clearError();
  }

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        {isRegistering && (
          <div className={styles.row}>
            <label htmlFor="name">Full name</label>
            <input
              type="text"
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        )}

        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">
            {isRegistering ? "Create account" : "Login"}
          </Button>
        </div>

        <button type="button" className={styles.toggle} onClick={toggleMode}>
          {isRegistering ? "Already have an account? Login" : "Create an account"}
        </button>

        {authError && <p className={styles.error}>{authError}</p>}
      </form>
    </main>
  );
}

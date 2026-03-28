const REPO_URL = "https://github.com/mcsharland/hn-skill-viewer";

export function Footer() {
  return (
    <footer className="footer">
      <p className="footer__text">
        Built for{" "}
        <a href="https://hockey-nation.com" target="_blank" rel="noopener noreferrer" className="footer__link">
          Hockey Nation
        </a>{" "}.{" "}
        If you're interested in how it works, a more in depth explanation can be found{" "}
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="footer__link">
          on my GitHub
        </a>
        .
      </p>
    </footer>
  );
}

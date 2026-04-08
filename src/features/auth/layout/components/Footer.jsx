// Footer simple con branding del proyecto.
export const Footer = () => (
  <footer className="bg-dark text-light py-4 mt-auto border-top border-success">
    <div className="container text-center">
      <p className="mb-1 text-success fw-bold">Morty!</p>
      <p className="small text-muted mb-0">
        © 2026 Ciudadela de Ricks - Creado con React & Bootstrap
      </p>
      <div className="mt-2 d-flex justify-content-center flex-wrap gap-3">
        <i className="bi bi-github"></i>
        <i className="bi bi-twitter"></i>
      </div>
    </div>
  </footer>
);

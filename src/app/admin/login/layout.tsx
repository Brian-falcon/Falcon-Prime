/**
 * Layout mínimo para /admin/login: solo renderiza el contenido (formulario).
 * No depende de sesión ni DB para que el login siempre se muestre.
 */
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

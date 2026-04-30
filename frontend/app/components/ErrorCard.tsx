export default function ErrorCard({ message }: { message?: string }) {
  return (
    <div className="alert alert-error">
      <strong>Error al cargar los datos.</strong>{' '}
      {message ?? 'No se pudo conectar con el servidor. Verifica que el backend esté activo.'}
    </div>
  );
}

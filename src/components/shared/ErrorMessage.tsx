interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <p className="text-sm font-medium text-destructive" role="alert">
      {message}
    </p>
  );
}

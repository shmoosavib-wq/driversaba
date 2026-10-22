import { Container, Icon, ToastButton } from "./style";

export default function Toaster({
  type = "warning",
  closeable = true,
  onClick = null,
  buttonText = null,
  text,
}) {
  const icon = type === ("positive" || "warning") ? "check" : "warning";

  return (
    <Container>
      <Icon src={`/images/icons/toast/${icon}.svg`} alt={icon} />
      {text}
      {!closeable && <ToastButton onClick={onClick}>{buttonText}</ToastButton>}
    </Container>
  );
}

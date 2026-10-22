import { useStyletron } from "baseui";

export default function useTheme() {
  const [_css, theme] = useStyletron();

  return theme;
}

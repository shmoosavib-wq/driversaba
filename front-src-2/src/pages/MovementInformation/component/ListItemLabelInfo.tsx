import { ListItemLabel } from "baseui/list";

import theme from "@/theme";

interface PropsType {
  label?: React.ReactNode;
  desc?: React.ReactNode;
}

export default function ListItemLabelInfo({ label, desc }: PropsType) {
  return (
    <ListItemLabel
      overrides={{
        LabelRoot: {
          style: {
            padding: "0 !important",
            margin: "0 !important",
          },
        },
        LabelContent: {
          style: {
            color: theme.colors.Gray400,
            fontSize: "12px",
            fontWeight: "600",
          },
        },
        LabelDescription: {
          style: {
            color: "#2D2D2D",
            fontSize: "12px",
            fontWeight: "600",
            padding: "12px 0",
          },
        },
      }}
      description={desc}>
      {label}
    </ListItemLabel>
  );
}

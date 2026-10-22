import { ListItem, ListItemLabel } from "baseui/list";

import Image from "@/components/global/Image";
import theme from "@/theme";

const listItemIcon = (imgSrc: string) => {
  return <Image src={imgSrc} alt="icon" />;
};

interface ListItemInfoType {
  imgSrc?: string;
  label?: string;
}

export default function ListItemInfo({ imgSrc, label }: ListItemInfoType) {
  return (
    <ListItem
      overrides={{
        ArtworkContainer: {
          style: {
            width: "20px",
          },
        },
        Content: {
          style: {
            padding: "0 !important",
            margin: "0 !important",
            border: "none",
            height: "0px !important",
            minHeight: "0 !important",
          },
        },
      }}
      artwork={() => listItemIcon(imgSrc)}>
      <ListItemLabel
        overrides={{
          LabelContent: {
            style: {
              color: theme.colors.Blue,
              paddingRight: "6px",
            },
          },
        }}>
        {label}
      </ListItemLabel>
    </ListItem>
  );
}

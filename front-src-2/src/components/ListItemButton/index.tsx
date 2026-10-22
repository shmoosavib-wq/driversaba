import { ListItem, ListItemLabel, ARTWORK_SIZES } from "baseui/list";

import Typography from "../Typography";
import Image from "../global/Image";

const arrowIcon = () => {
  return <Image src="/cargoStatus/arrow.svg" alt="arrow" />;
};

const listItemLabelIcon = (imgSrc: string) => {
  return <Image src={imgSrc} alt="label-icon" />;
};

interface PropsType {
  onClick?: () => void;
  label: string;
  imgSrc?: string;
  description?: string;
  noBorder?: boolean;
  endEnhancer?: any;
  overridesCustom?: any;
}

export default function ListItemButton({
  onClick,
  label,
  imgSrc,
  description,
  endEnhancer = null,
  noBorder = false,
  overridesCustom = null,
}: PropsType) {
  return (
    <ListItem
      onClick={onClick}
      overrides={{
        Root: {
          style: {
            border: noBorder ? "none" : "1px solid #e8e8e8",
            borderRadius: "8px",
          },
          props: {
            type: "button",
          },
        },
        Content: {
          style: {
            paddingRight: "0px",
            paddingLeft: "14px",
            border: "none",
          },
          ...overridesCustom,
        },
      }}
      artwork={imgSrc ? () => listItemLabelIcon(imgSrc) : null}
      // Medium is aliased to Small when sublist
      artworkSize={ARTWORK_SIZES.MEDIUM}
      endEnhancer={endEnhancer !== null ? () => endEnhancer : arrowIcon}
      sublist>
      <ListItemLabel
        overrides={{
          LabelSublistContent: {
            style: {
              fontSize: "14px",
              fontWeight: "600",
            },
          },
        }}
        sublist>
        {description ? (
          <div>
            <Typography type="LabelMedium">{label}</Typography>
            <Typography type="ParagraphMedium">{description}</Typography>
          </div>
        ) : (
          label
        )}
      </ListItemLabel>
    </ListItem>
  );
}

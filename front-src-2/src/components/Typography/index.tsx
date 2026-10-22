import { Block, BlockProps } from "baseui/block";

const TAGS = {
  HeadingLarge: "p",
  HeadingMedium: "p",
  HeadingSmall: "p",
  HeadingXSmall: "p",
  LabelXLarge: "p",
  LabelLarge: "p",
  LabelMedium: "p",
  LabelSmall: "p",
  ParagraphXLarge: "p",
  ParagraphLarge: "p",
  ParagraphMedium: "p",
  ParagraphSmall: "p",
  ParagraphXSmall: "p",
};

type TypographyTypes =
  | "HeadingLarge"
  | "HeadingMedium"
  | "HeadingSmall"
  | "HeadingXSmall"
  | "LabelXLarge"
  | "LabelLarge"
  | "LabelMedium"
  | "LabelSmall"
  | "ParagraphXLarge"
  | "ParagraphLarge"
  | "ParagraphMedium"
  | "ParagraphSmall"
  | "ParagraphXSmall";

interface Props extends Omit<BlockProps, "children"> {
  title?: React.ReactNode;
  type?: TypographyTypes;
  children?: any;
  width?: string;
  dir?: string;
}

export default function Typography({
  type = "ParagraphSmall",
  title,
  color = "contentPrimary",
  children,
  width = null,
  ...rest
}: Props) {
  const Tag = TAGS[type] || "p";

  return (
    <Block
      overrides={{
        Block: {
          style: {
            width: width ? width : null,
            whiteSpace: width && "nowrap",
            overflow: width && "hidden",
            textOverflow: width && "ellipsis",
          },
        },
      }}
      $style={{
        fontFamily: "IRANSansX",
      }}
      // @ts-ignore
      as={Tag}
      font={type}
      color={color}
      {...rest}>
      {title}
      {children}
    </Block>
  );
}

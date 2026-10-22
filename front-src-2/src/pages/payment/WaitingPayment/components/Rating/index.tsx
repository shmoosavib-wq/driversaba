import { StarRating } from "baseui/rating";

import Image from "@/components/global/Image";
import {
  NamesContainer,
  RatingContainer,
  RatingDetial,
  Text,
} from "../../style";
import RandomColors from "@/components/RandomColors";
import Typography from "@/components/Typography";

export default function Rating({ setValue, value, title, subTitle, imaSrc }) {
  return (
    <RatingContainer>
      <RatingDetial>
        {imaSrc ? (
          <Image src={imaSrc} />
        ) : (
          <RandomColors
            fullName={subTitle}
            width="40px"
            height="40px"
            fontSize="16px"
          />
        )}
        <NamesContainer>
          <Typography type="LabelSmall" color="#A6A6A6">
            {title}
          </Typography>
          <Text>{subTitle}</Text>
        </NamesContainer>
      </RatingDetial>

      <StarRating
        numItems={5}
        onChange={(data) => setValue(data.value)}
        size={22}
        value={value}
        overrides={{
          Item: {
            style: () => ({
              width: "12%",
              direction: "ltr",
            }),
          },
          Root: {
            style: () => ({
              direction: "ltr",
              alignSelf: "center",
            }),
          },
        }}
      />
    </RatingContainer>
  );
}

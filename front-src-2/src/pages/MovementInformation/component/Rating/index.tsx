import { StarRating } from "baseui/rating";

export default function Rating({ rate }: { rate: number }) {
  return (
    <StarRating
      numItems={5}
      size={10}
      value={rate}
      readOnly
      overrides={{
        Root: {
          style: () => ({
            width: "80%",
            direction: "ltr",
            display: "flex",
            justifyContent: "end",
            zIndex: "-1",
          }),
        },
      }}
    />
  );
}

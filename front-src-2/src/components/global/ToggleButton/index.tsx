import { Checkbox, STYLE_TYPE, LABEL_PLACEMENT } from "baseui/checkbox";

import { useFilter } from "@/store";

export default function ToggleButton({ children = null }) {
  const Ischecked = useFilter((state) => state.Ischecked);
  const setIsChecked = useFilter((state) => state.setIsChecked);
  return (
    <Checkbox
      checked={Ischecked}
      checkmarkType={STYLE_TYPE.toggle}
      onChange={(e) => setIsChecked(e.target.checked)}
      isIndeterminate
      labelPlacement={LABEL_PLACEMENT.right}
      overrides={{
        Root: {
          style: () => ({
            direction: "ltr",
          }),
        },

        Toggle: {
          style: ({ $checked }) => ({
            backgroundColor: $checked ? "#01ACBC" : "#fff",
            transition: "background-color .5s",
          }),
        },
      }}>
      {children}
    </Checkbox>
  );
}

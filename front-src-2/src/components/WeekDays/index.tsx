import { useState } from "react";
import { Tabs, Tab } from "baseui/tabs-motion";
import { useQuery } from "react-query";

import theme from "@/theme";
import { getWeekDays } from "@/services/driver/driver-api";
import { useCargo } from "@/store";

import "./style.css";

export default function WeekDays() {
  const [activeKey, setActiveKey] = useState<React.Key>(0);
  // zustand
  const { setValue } = useCargo((state) => state);

  const { data: days } = useQuery(["WeekDays"], getWeekDays);

  return (
    <>
      {days && (
        <Tabs
          overrides={{
            TabHighlight: {
              style: () => ({
                backgroundColor: theme.colors.Blue,
              }),
            },
          }}
          activeKey={activeKey}
          onChange={({ activeKey }) => setActiveKey(activeKey)}>
          {days?.map((day, idx) => (
            <Tab
              key={idx}
              overrides={{
                Tab: {
                  props: {
                    className: "activeTab",
                  },
                },
              }}
              // @ts-ignore
              onClick={() => setValue(day?.DateTime?.split(" ")[0])}
              title={day.PersianDay}
              disabled={!day.DoesLoadExist}></Tab>
          ))}
        </Tabs>
      )}
    </>
  );
}

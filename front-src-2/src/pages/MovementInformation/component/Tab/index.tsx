import { useState } from "react";
import { Tabs, Tab } from "baseui/tabs-motion";
import { useNavigate } from "react-router-dom";

import theme from "@/theme";

import "./style.css";

const TabItems = [
  { id: "cargo", title: "بار" },
  { id: "payment", title: "پرداختی" },
  { id: "file", title: "فایل ها" },
  { id: "dateTime", title: "تاریخ و زمان" },
  { id: "myVehicle", title: "ناوگان" },
  { id: "driver", title: "رانندگان" },
];

export default function MovementTab() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState<React.Key>(0);

  return (
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
      {TabItems.map((i, idx) => (
        <Tab
          key={idx}
          overrides={{
            Tab: {
              props: {
                className: "TabInfo",
              },
            },
          }}
          // @ts-ignore
          // onClick={() => navigate(`#${i.id}`)}
          title={<a href={`#${i.id}`}>{i.title}</a>}
          //   disabled={!day.DoesLoadExist}
        />
      ))}
    </Tabs>
  );
}

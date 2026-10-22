import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { BottomNavigation, NavItem } from "baseui/bottom-navigation";
import styled from "styled-components";

import "./styles.css";

import { LayoutData } from "./formtools/constants";

export default () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const ActiveTab = searchParams.get("t") || "list";
  const ActiveIndex = useMemo(() => {
    const item = LayoutData.find((i) => i.slug === ActiveTab);
    if (item) return item.id;

    return 0;
  }, [ActiveTab]);

  return (
    <LayoutContainer>
      <BottomNavigation
        overrides={{
          SelectorList: {
            style: { height: "var(--bottom-tab-size)" },
            props: {
              className: "bottom-tab",
            },
          },
        }}
        activeKey={ActiveIndex}
        onChange={({ activeKey }) => {
          const slug = LayoutData[activeKey].slug;
          setSearchParams({ t: slug });
        }}>
        {LayoutData.map((item) => (
          <NavItem
            overrides={{
              Selector: {
                props: {
                  className: item.id === ActiveIndex ? "bottom-tab-active" : "",
                },
              },
              Panel: {
                style: {
                  overflow: "hidden",
                },
              },
            }}
            title={item.title}
            icon={item.icon}
            key={item.id}>
            <item.component />
          </NavItem>
        ))}
      </BottomNavigation>
    </LayoutContainer>
  );
};

const LayoutContainer = styled.section`
  width: 100%;
  height: 100dvh;
  background-color: #fff;
`;

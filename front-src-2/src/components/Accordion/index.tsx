import { Accordion, Panel } from "baseui/accordion";

import styled from "styled-components";

export default function AccordionKit({ title, content }) {
  return (
    <AccordionContainer>
      <Accordion
        aria-expanded="false"
        overrides={{
          Header: {
            style: () => ({
              borderTopRightRadius: "9.6px",
              borderTopLeftRadius: "9.6px",
              borderBottomRightRadius: "9.6px",
              borderBottomLeftRadius: "9.6px",
              position: "relative",
            }),
          },
          Content: {
            style: () => ({
              borderBottomRightRadius: "9.6px",
              borderBottomLeftRadius: "9.6px",
              paddingBottom: "15px",
              paddingTop: "10px",
            }),
          },
          PanelContainer: {
            style: () => ({
              border: `1.2px solid #e8e8e8`,
              borderRadius: "9.6px",
            }),
          },
          ToggleIcon: {
            style: () => ({
              position: "absolute",
              top: "8px",
              left: "8px",
            }),
          },
        }}
        accordion>
        <Panel title={title}>{content}</Panel>
      </Accordion>
    </AccordionContainer>
  );
}

export const AccordionContainer = styled.div`
  width: 100%;
`;

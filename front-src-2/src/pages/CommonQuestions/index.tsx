import { Accordion, Panel } from "baseui/accordion";
import styled from "styled-components";

import Navbar from "@/layout/Navbar";
import { CommonQuestionsData } from "@/data/common-question";
import "./style.css";

export default function CommonQuestions() {
  return (
    <Navbar title="پرسش های متداول" isSupport={false}>
      <Container>
        <Accordion>
          {CommonQuestionsData.map((i, idx) => (
            <Panel
              overrides={{
                Content: {
                  style: {
                    paddingTop: "8px",
                    paddingBottom: "24px",
                  },
                },
                Header: {
                  props: {
                    className: "active",
                  },
                },
              }}
              key={idx}
              title={i.title}>
              {i.desc}
            </Panel>
          ))}
        </Accordion>
      </Container>
    </Navbar>
  );
}

const Container = styled.div`
  margin: 0 12px;
`;

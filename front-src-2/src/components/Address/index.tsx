import styled from "styled-components";

import Typography from "../Typography";

export default function Address({ title, children }) {
  return (
    <Wrapper>
      <Typography type="LabelMedium" title={title} />
      <AddressContainer>
        <Typography type="ParagraphMedium" title={children} />
      </AddressContainer>
    </Wrapper>
  );
}

const AddressContainer = styled.div`
  padding: 16px 24px 16px 24px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  margin-top: 10px;
`;
const Wrapper = styled.div`
  width: 100%;
`;

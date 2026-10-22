import styled from "styled-components";

interface ColorsContainerType {
  color: React.CSSProperties["backgroundColor"];
  width: string;
  height: string;
  fontSize: string;
}
export const ColorsContainer = styled.div<ColorsContainerType>`
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;

  font-size: ${({ fontSize }) => fontSize && fontSize};
  width: ${({ width }) => width && width};
  height: ${({ height }) => height && height};
  background-color: ${({ color }) => color && color};
`;

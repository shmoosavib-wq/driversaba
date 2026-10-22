import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
`;
export const Wrapper = styled.div`
  padding: 20px 16px 0px 16px;
`;
export const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 0;
  padding: 0 16px 16px 16px;
  height: calc(
    100dvh - 60px - 74px
  ); // 60px ===> nav height & 74px ===> layout height
  overflow-y: auto;
  max-width: 768px;
  margin: 0 auto;
`;

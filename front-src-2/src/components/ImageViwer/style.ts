import styled from "styled-components";

export const ActionWrapper = styled.div`
  display: flex;

  color: aliceblue;
  justify-content: space-between;
  width: 100%;
  height: 26px;
`;
export const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  width: 100%;
  background-color: #fff;
  flex-wrap: wrap;
  justify-content: center;
  gap: 28px;
  padding: 16px;
  z-index: 1;
`;
export const Image = styled.img`
  height: 85%;
  width: 90%;
  border-radius: 8px;
  margin: auto;
  border: 1px solid #e8e8e8;
  object-fit: contain;
`;

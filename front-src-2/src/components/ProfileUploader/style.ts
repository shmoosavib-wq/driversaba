import styled from "styled-components";

export const Input = styled.input`
  position: absolute;
  display: none;
`;

export const ProfileImage = styled.img<{ hasPic?: boolean }>`
  border-radius: ${(props) => (props.hasPic ? "50%" : "0")};
  margin: auto;
  width: 50%;
  height: 60%;
  border: ${(props) => (props.hasPic ? "2px solid black" : "none")};
`;
export const ProfileImageContainer = styled.div`
  width: 30%;
  margin-top: 5%;
`;

import styled from "styled-components";

export const NavContainer = styled.div`
  background-color: #fff;
  width: 100%;
  height: var(--nav-height);

  // position: fixed;
  // top: 0;
  // left: 0;
  // right: 0;
`;

export const NavTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
`;

export const NavItems = styled.div`
  display: flex;
  align-items: center;
  gap: 0 5px;
`;

export const DropDownContainer = styled.div`
  padding: 8px 14px;
`;

export const TextTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

export const TextSupport = styled.div`
  font-size: 12px;
  font-weight: 600;
`;

export const SupportImg = styled.img`
  width: 24px;
  height: 24px;
`;

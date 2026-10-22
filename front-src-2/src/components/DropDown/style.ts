import styled from "styled-components";

import { device } from "@/styles/BreakPoints";

export const Header = styled.div<{ isMobile?: boolean }>`
  margin: auto;
  text-align: center;
  border-bottom: 1.8px solid #d9d9d9;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  height: ${(props) => (props.isMobile ? "1.75rem" : "3rem")};
  line-height: ${(props) => (props.isMobile ? "0" : "3")};
  position: fixed;
  background-color: #fff;
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  padding: 12px 0 24px 0;
`;
export const LoadingContainer = styled.div`
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
`;
export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  direction: rtl;
`;

export const ErrorImg = styled.img`
  margin-left: 12px;
`;

export const Item = styled.li`
  text-align: right;
  padding-top: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eeeeee;
  margin-right: 1.875rem;
  font-size: 1rem;
  font-weight: 600;

  &:last-child {
    border-bottom: none;
  }
`;
export const List = styled.ul`
  margin-top: 1.875rem;
`;
export const DropDownWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

interface DropDownBodyType {
  isError: any;
}
export const DropDownBody = styled.input<DropDownBodyType>`
  padding-block: 0.3125rem;
  font-size: 0.875rem;
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 0.5rem;
  text-align: right;
  width: 100%;
  height: 48px;
  padding: 10px;
  background: url(images/vector.svg) no-repeat scroll 10px #e8e8e8;
  padding-left: 30px;
  outline: none;
  border: ${({ isError }) => isError && "2px solid #de1135"};
  &:focus-visible {
    border: 2px solid #276ef1;
  }
  @media ${device.md} {
    height: 56px;
    font-size: 16px;
  }
`;

export const SearchContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0 8px 0;
`;

export const SearchInput = styled.input`
  width: 90%;
  height: 40px;
  border-radius: 50px;
  color: #5e5e5e;
  outline: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  padding-right: 46px;
  background: url(images/search-icon.svg) no-repeat calc(100% - 14px) #f3f3f3;
`;

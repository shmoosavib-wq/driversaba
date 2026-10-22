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
`;
export const ManualItem = styled.li`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  gap: 16px;
  text-align: right;
  padding-top: 16px;
  border-bottom: 1px solid #eeeeee;
  font-size: 1rem;
  font-weight: 600;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export const ManualImage = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
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
`;

export const List = styled.ul`
  margin-top: 1.875rem;
`;

export const DropDownWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

interface LabelType {
  disabled?: boolean;
}
export const Label = styled.label<LabelType>`
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  direction: rtl;

  @media ${device.md} {
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
  }
  margin-right: 6px;

  color: ${({ disabled }) => (disabled ? "#a6a6a6" : "#2d2d2d")};
`;

interface DropDownBodyType {
  isError?: any;
}
export const DropDownBody = styled.input<DropDownBodyType>`
  padding-block: 0.3125rem;
  font-size: 14px;
  font-weight: 600;
  margin-top: 8px;
  border-radius: 999px;
  text-align: right;
  width: 100%;
  height: 48px;
  padding: 10px;
  background: url(images/way.svg) no-repeat scroll calc(100% - 20px) center
    #f3f3f3;
  padding-right: 52px;
  color: #5e5e5e;
  outline: none;
  position: relative;

  &::placeholder {
    color: #5e5e5e;
  }

  border: ${({ isError }) => isError && "2px solid #de1135"};
`;

export const IconContainer = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-25%);
  cursor: pointer;
`;

export const InputClear = styled.img<{ showDeleteButton: boolean }>`
  width: 20px;
  height: 20px;
  display: ${({ showDeleteButton }) => (showDeleteButton ? "block" : "none")};
`;

import styled, { css } from "styled-components";
import { animated } from "react-spring";

import { device } from "@/styles/BreakPoints";

export const HeadContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 8px 8px;
`;

export const CropperTitle = styled.p`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;

  @media ${device.md} {
    font-size: 14px;
    font-weight: 600;
  }
`;

interface CropperMainSectionType {
  isError: boolean;
}
export const CropperMainSection = styled.div<CropperMainSectionType>`
  margin: 0 auto;
  position: relative;
  border-radius: 7px;
  width: 100%;
  height: 8em;
  border-style: dashed;
  border-width: 2px;
  display: flex;
  justify-content: end;
  padding: 10px 0;

  @media ${device.md} {
    height: 120px;
  }

  border-color: ${({ isError }) => (isError ? "red" : "#d9d9d9")};
`;

interface ShowImageType {
  cropData?: string;
}
export const ShowImage = styled.img<ShowImageType>`
  width: ${(props) => (props.cropData ? "30%" : "32px")};
  height: ${(props) => (props.cropData ? "82%" : "32px")};
  object-fit: ${(props) => (props.cropData ? "contain" : "center")};
  margin-right: 10px;
  position: absolute;
  right: 0;
`;

interface CropDataType {
  cropData?: string;
}
export const ChoseFileContainer = styled.div<CropDataType>`
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px 0;
  justify-content: center;

  ${(props) =>
    props.cropData &&
    css`
      justify-content: flex-end;
      @media ${device.md} {
        justify-content: center;
      }
    `}

  width: ${(props) => (props.cropData ? "60%" : "100%")};
`;

export const FileTitle = styled.p<CropDataType>`
  font-size: 11px;
  font-weight: 600;
  text-align: right;

  @media ${device.xs} {
    font-size: 13px;
  }
`;

export const ChoseFileButton = styled.button<CropDataType>`
  height: 42px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #d9d9d9;
  border-radius: 36px;

  width: ${(props) => (props.cropData ? "167px" : "100px;")};
`;

export const InputChoseFile = styled.input`
  position: absolute;
  display: none;
`;

export const CropperButtonsContainer = styled.div`
  display: flex;
  width: 90%;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
`;

export const RecordButton = styled.button`
  // position: absolute;
  // left: 40px;
  // bottom: 20px;
  font-weight: 600;
`;

export const CancellationButton = styled.button`
  // position: absolute;
  // right: 40px;
  // bottom: 20px;
  font-weight: 600;
`;

export const Overlay = styled(animated.div)`
  position: fixed;
  z-index: 9;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
`;

export const ModalContainer = styled(animated.div)`
  position: fixed;
  display: block;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 60%;
  padding: 15px;
  text-align: center;
  font-size: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: #fff;
  color: #4a5568;
  z-index: 10;
  border-radius: 10px;

  @media ${device.md} {
    width: 60%;
  }

  @media ${device.lg} {
    width: 50%;
  }
`;

export const ModalTitle = styled.p`
  padding: 8px;
  font-weight: 600;
`;

export const ProgressContainer = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px 0;
  margin: 0 auto;
`;

export const ProgressTitle = styled.p`
  font-size: 12px;
  font-weight: 600;
`;

export const ErrorImg = styled.img``;

import { Spinner, SpinnerProps } from "baseui/spinner";
import styled from "styled-components";

interface LoadingProps extends SpinnerProps {
  containerStyle?: React.CSSProperties;
}

export default function Loading({ containerStyle, ...rest }: LoadingProps) {
  return (
    <LoadingContainer style={containerStyle}>
      <Spinner $size="64px" $borderWidth="4px" $color="#01ACBC" {...rest} />
      در حال بارگذاری...
    </LoadingContainer>
  );
}

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px 0;
  margin: 0 auto;
`;

import { Link } from "react-router-dom";

import ListItemButton from "@/components/ListItemButton";

import { ButtonItems, SuppurtItems } from "./formTools/constants";

import {
  ButtonContainer,
  DescriptionSection,
  SupportContainer,
  SupportItem,
  SupportWrapper,
  Typography,
  Icon,
} from "./style";

export function Support() {
  return (
    <SupportWrapper>
      <SupportContainer>
        <DescriptionSection>
          {SuppurtItems.map((item) => (
            <SupportItem>
              <Icon src={item.src} alt={item.alt} />
              <Typography> {item.text}</Typography>
            </SupportItem>
          ))}
        </DescriptionSection>
        <ButtonContainer>
          {ButtonItems.map((item) => (
            <Link to={item.link} style={{ width: "100%" }}>
              <ListItemButton imgSrc={item.src} label={item.text} />
            </Link>
          ))}
        </ButtonContainer>
      </SupportContainer>
    </SupportWrapper>
  );
}

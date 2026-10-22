import { useNavigate } from "react-router-dom";

import ModalKit from "../Modal";
import ButtonKit from "@/components/Button";
import Typography from "@/components/Typography";

import { ModalButtonContainer, ModalContainer } from "./style";

export default function Alert({
  isOpen,
  setIsOpen,
  imgSrc,
  description,
  buttonText,
  refuse = false,
  doNavigate = true,
  navigateRoute = "/identity",
}) {
  const navigate = useNavigate();
  const OnClick = () => {
    setIsOpen(false);
    doNavigate === true && navigate(navigateRoute);
  };
  return (
    <ModalKit
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}>
      <ModalContainer>
        <img src={imgSrc} alt="modal-icon" />
        <Typography type="ParagraphLarge">{description}</Typography>
        <ModalButtonContainer>
          <ButtonKit
            width="100%"
            height="50px"
            theme="black"
            text={buttonText}
            onClick={OnClick}
          />
          {refuse && (
            <ButtonKit
              width="100%"
              height="50px"
              theme="red"
              text="انصراف"
              onClick={() => setIsOpen(false)}
            />
          )}
        </ModalButtonContainer>
      </ModalContainer>
    </ModalKit>
  );
}

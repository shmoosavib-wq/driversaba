import { RWebShare } from "react-web-share";

import ButtonKit from "../Button";
import Typography from "../Typography";

import { ActionWrapper, Image, Container } from "./style";

const handleDownload = (imgsrc) => {
  const url = imgsrc;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";

  link.download = "file"; // Get the file name from the image URL
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return;
  //   fetch(imgsrc)
  //     .then((response) => response.blob())
  //     .then((blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const link = document.createElement("a");
  //       link.href = url;
  //       // link.download = imgsrc.split("/").pop(); // Get the file name from the image URL
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //       window.URL.revokeObjectURL(url);
  //     })
  //     .catch((error) => console.error("Error downloading image:", error));
};

export default function ImageViwer({ setOpenImg, imgsrc, title }) {
  return (
    <Container>
      <ActionWrapper>
        <div
          onClick={() => {
            setOpenImg(false);
          }}>
          <img src="/images/loadState/sendVoucher/close.svg" alt="close" />
        </div>
        <Typography title={title} type="LabelMedium" />
        <RWebShare
          data={{
            text: "برای مشاهده عکس روی لینک زیر کلیک کنید",
            url: imgsrc,
            title: "صبا بار",
          }}>
          <img src="/images/loadState/sendVoucher/share.svg" alt="share" />
        </RWebShare>
      </ActionWrapper>
      <Image src={imgsrc} />
      {/* <ButtonKit
        theme="black"
        width="90%"
        onClick={() => handleDownload(imgsrc)}>
        دانلود
      </ButtonKit> */}
    </Container>
  );
}

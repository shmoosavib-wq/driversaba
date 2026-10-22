import React, {
  useState,
  createRef,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import { useSpring } from "react-spring";
import Cropper from "react-cropper";
import "react-image-crop/dist/ReactCrop.css";
import "cropperjs/dist/cropper.css";
import { ProgressBar } from "baseui/progress-bar";
import { useField } from "formik";

import ButtonKit from "../Button";

import {
  ChoseFileButton,
  ChoseFileContainer,
  CropperButtonsContainer,
  CropperMainSection,
  FileTitle,
  InputChoseFile,
  ModalContainer,
  ModalTitle,
  Overlay,
  ProgressContainer,
  ProgressTitle,
  ShowImage,
  CropperTitle,
  ErrorImg,
  HeadContainer,
} from "./style";

interface PropsType {
  cropMode?: boolean;
  field?: string;
  height?: number;
  width?: number;
  volume?: number;
  cropText?: string;
  title?: string;
  name: string;
  value?: string | number;
  aspectRatio?: number;
}

const CropperImage = ({
  cropMode = true, // default to true for backward compatibility
  height,
  width,
  name,
  value,
  volume,
  aspectRatio = 1,
  cropText = "",
  title = "",
}: PropsType) => {
  const [file, setSelectedFile] = useState<any>(null);
  const [imageToCrop, setImageToCrop] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [field, meta, helpers] = useField({ name, value });

  let error = meta.touched && meta.error ? meta.error : false;

  const [image, setImage] = useState<any>();
  const [cropData, setCropData] = useState<any>();
  const cropperRef = createRef<any>();

  const convertBase64ToFile = (base64Image: string) => {
    const byteString = atob(base64Image.split(",")[1]);
    const mimeString = base64Image.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new File([intArray], "croppedImage.png", { type: mimeString });
  };

  const getCropData = () => {
    if (cropperRef.current) {
      const base64Image = cropperRef.current.cropper
        .getCroppedCanvas()
        .toDataURL();
      setCropData(base64Image);

      const croppedFile = convertBase64ToFile(base64Image);
      helpers.setValue(croppedFile);
    }
  };

  const pickerRef = useRef<HTMLInputElement>(null);

  const handleClick = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!modalVisible) {
      pickerRef.current?.click();
    }
  };

  const [progress, setProgress] = useState(0);

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    let files: FileList | null = e.target.files;

    if (files && files.length === 1) {
      setProgress(0);

      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;

        if (typeof imageData === "string") {
          if (cropMode) {
            setModalVisible(true);
            setImageToCrop(imageData);
          } else {
            // Directly set the image without cropping
            setCropData(imageData);
            const fileData = convertBase64ToFile(imageData);
            helpers.setValue(fileData);
          }
        }
      };
      reader.readAsDataURL(files[0]);

      const maxSize = volume! * 1024 * 1024;
      if (files[0].size > maxSize) {
        // Handle the error for max size exceeded
        helpers.setError(`File size should be less than ${volume} MB.`);
      }
    } else {
      helpers.setError("Please select a single file.");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedFile(null);
    setImageToCrop(null);
  };

  const modalSpringProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  return (
    <>
      <HeadContainer>
        <CropperTitle>{title}</CropperTitle>
        {error && (
          <ErrorImg src="/images/icons/inputIcon/erroricon.svg" alt="error" />
        )}
      </HeadContainer>
      {/* @ts-ignore */}
      <CropperMainSection isError={error}>
        {progress > 0 && progress < 100 ? (
          <ProgressContainer>
            <ProgressTitle>... در حال بارگذاری</ProgressTitle>
            <ProgressBar
              value={progress}
              overrides={{
                BarProgress: {
                  style: ({ $theme }) => ({
                    backgroundColor: $theme.colors.black,
                  }),
                },
              }}
            />
          </ProgressContainer>
        ) : (
          <>
            {cropData ? (
              <>
                <ShowImage
                  src={cropData ?? "images/icons/profile/upload.svg"}
                  cropData={cropData}
                  alt="card"
                />
                <ChoseFileContainer cropData={cropData}>
                  <FileTitle>{cropText}</FileTitle>
                  <ChoseFileButton cropData={cropData} onClick={handleClick}>
                    {cropData ? "بارگذاری مجدد فایل" : "انتخاب فایل"}
                  </ChoseFileButton>
                </ChoseFileContainer>
              </>
            ) : (
              <ChoseFileContainer>
                <FileTitle cropData={cropData}>{cropText}</FileTitle>
                <ChoseFileButton cropData={cropData} onClick={handleClick}>
                  انتخاب فایل
                </ChoseFileButton>
              </ChoseFileContainer>
            )}
          </>
        )}

        <InputChoseFile
          name={name}
          ref={pickerRef}
          type="file"
          accept="image/jpeg, image/png, image/gif, image/bmp, image/webp, image/svg+xml" // قبول کردن عکس هایی با این قرمت ها
          onChange={(e) => handleImage(e)}
          onClick={() => (pickerRef.current!.value = "")}
        />

        {cropMode && imageToCrop && (
          <>
            <Overlay />
            <ModalContainer style={modalSpringProps}>
              <ModalTitle>لطفا کادر مورد نظر خود را انتخاب کنید</ModalTitle>
              <Cropper
                src={imageToCrop}
                zoomTo={0.5}
                initialAspectRatio={aspectRatio}
                viewMode={0}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                cropBoxResizable={true}
                style={{ height: "74%", top: "inherit" }}
                responsive={true}
                ref={cropperRef}
                autoCropArea={3}
                checkOrientation={false}
                guides={true}
              />
              <br />
              <CropperButtonsContainer>
                <ButtonKit
                  text="لغو"
                  theme="red"
                  width="100px"
                  height="35px"
                  onClick={() => closeModal()}
                />
                <ButtonKit
                  text="ثبت"
                  type="button"
                  theme="black"
                  width="100px"
                  height="35px"
                  onClick={() => {
                    let currentProgress = 0;
                    const interval = setInterval(() => {
                      currentProgress += 10;
                      setProgress(currentProgress);
                      if (currentProgress >= 100) {
                        clearInterval(interval);
                      }
                    }, 100);
                    closeModal();
                    getCropData();
                  }}
                />
              </CropperButtonsContainer>
            </ModalContainer>
          </>
        )}
      </CropperMainSection>
    </>
  );
};

export default CropperImage;

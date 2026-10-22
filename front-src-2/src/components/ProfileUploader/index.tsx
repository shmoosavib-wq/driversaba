import { useEffect, useRef, useState } from "react";

import { useGetFetchQuery } from "@/hooks/useGetFetchQuery";

import { Input, ProfileImage, ProfileImageContainer } from "./style";

export default function ProfileUploader({ onChange, field }) {
  const [pic, setPic] = useState(null);
  const identityInfo = useGetFetchQuery("IDENTITY");
  const pickerRef = useRef(null);

  useEffect(() => {
    if (identityInfo) {
      setPic(identityInfo[field]);
    }
  }, [identityInfo]);

  const handleClick = () => {
    pickerRef.current.click();
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setPic(URL.createObjectURL(file));
    if (onChange) onChange(file, field);
  };
  return (
    <ProfileImageContainer onClick={handleClick}>
      <ProfileImage
        src={pic ? pic : "/images/authentcaion/verification/upload.svg"}
        hasPic={!!pic}
        className={`${pic ? "w-full h-full object-contain" : "object-center w-8 h-8 m-auto"}`}
        alt="card"
      />
      <Input
        name={field}
        ref={pickerRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleImage(e)}
        className="absolute hidden"
      />
    </ProfileImageContainer>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query";

import ButtonKit from "@/components/Button";
import BottomSheet from "@/components/global/BottomSheet";
import { removeEquipment } from "@/services/equipment/equipment-api";

import {
  ContentContainer,
  ContentItems,
  ContentItem,
  ContentValue,
  ContentLabel,
  ButtonFlex,
  SheetContainer,
  SheetTitle,
  SheetText,
  SheetButton,
} from "./style";

interface PropsType {
  item: {
    EquipmentSmartNumber: string;
    FuelType: any;
    YearOfConstruction: string;
    TransportEquipmentId: number;
    MovementNumber: number;
  };
}

export default function Content({ item }: PropsType) {
  const queryClient = useQueryClient();
  const refetch = () => queryClient.invalidateQueries("Fleets");
  const { mutate: deleteCargo, isLoading } = useMutation(
    (data: number) => removeEquipment(data),
    {
      onSuccess: () => {
        refetch();
        setIsOpen(false);
      },
    }
  );
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const driverInfo = [
    { value: item.EquipmentSmartNumber, label: "شماره هوشمند ناوگان" },
    { value: item.FuelType?.label, label: "سوخت" },
    { value: item.YearOfConstruction, label: "سال ساخت" },
    { value: item.MovementNumber, label: "تعداد سیرها" },
  ];

  return (
    <ContentContainer>
      <ContentItems>
        {driverInfo.map((i: any) => (
          <ContentItem>
            <ContentLabel>{i.label}</ContentLabel>
            <ContentValue>{i.value}</ContentValue>
          </ContentItem>
        ))}
        <ButtonFlex>
          <ButtonKit
            width="100%"
            height="48px"
            onClick={() =>
              navigate("/editVehicle", {
                state: item,
              })
            }
            text={"ویرایش ناوگان"}
            theme="blue"
          />
          <ButtonKit
            width="100%"
            height="48px"
            onClick={() => setIsOpen(true)}
            text={"حذف ناوگان"}
            theme="red"
          />
        </ButtonFlex>
      </ContentItems>
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <SheetContainer>
          <SheetTitle>
            مطمئن هستید که می خواهید ناوگان خود را حذف کنید؟
          </SheetTitle>
          <SheetText>این عمل غیر قابل بازگشت خواهد بود</SheetText>
          <SheetButton>
            <ButtonKit
              width="100%"
              height="48px"
              onClick={() => setIsOpen(false)}
              text={"انصراف"}
            />
            <ButtonKit
              width="100%"
              height="48px"
              text={"حذف ناوگان"}
              theme="secondaryRed"
              onClick={() => {
                deleteCargo(item.TransportEquipmentId);
              }}
              isLoading={isLoading}
            />
          </SheetButton>
        </SheetContainer>
      </BottomSheet>
    </ContentContainer>
  );
}

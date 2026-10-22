import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Checkbox } from "baseui/checkbox";
import { Tag } from "baseui/tag";
import styled from "styled-components";
import { Accordion, Panel } from "baseui/accordion";

import ListItemButton from "../ListItemButton";
import BottomSheet from "../global/BottomSheet";
import { getAllFleets } from "@/services/equipment/equipment-api";
import { Header } from "../DropDown/style";
import ButtonKit from "../Button";
import Typography from "../Typography";
import { useFilter } from "@/store";
import Loading from "../Loading";

export default function MultySelect() {
  const { data, isLoading } = useQuery("ALLFLEETS", getAllFleets);
  const equipmentIdSelected = useFilter((state) => state.equipmentIdSelected);
  const setEquipmentIdSelected = useFilter(
    (state) => state.setEquipmentIdSelected
  );

  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    if (data) {
      const allEquipmentIds = data
        .flatMap((fleet) => fleet?.EquipmentClasses)
        .map((equipment) => equipment?.EquipmentClassId);
      setIsAllSelected(
        allEquipmentIds.length > 0 &&
          allEquipmentIds.every((id) => equipmentIdSelected.includes(id))
      );
    }
  }, [data, equipmentIdSelected]);

  const handleCheckboxChange = (id) => {
    const newSelectedIds = equipmentIdSelected.includes(id)
      ? equipmentIdSelected.filter((selectedId) => selectedId !== id)
      : [...equipmentIdSelected, id];

    setEquipmentIdSelected(newSelectedIds);

    if (data) {
      const allEquipmentIds = data
        .flatMap((fleet) => fleet?.EquipmentClasses)
        .map((equipment) => equipment?.EquipmentClassId);
      setIsAllSelected(
        newSelectedIds.length > 0 &&
          allEquipmentIds.every((id) => newSelectedIds.includes(id))
      );
    }
  };

  const handleTagRemove = (id) => {
    const newSelectedIds = equipmentIdSelected.filter(
      (selectedId) => selectedId !== id
    );
    setEquipmentIdSelected(newSelectedIds);
    setIsAllSelected(false);
  };

  const handleAllCheckboxChange = () => {
    if (isAllSelected) {
      setEquipmentIdSelected([]);
      setIsAllSelected(false);
    } else {
      const allEquipmentIds = data
        .flatMap((fleet) => fleet?.EquipmentClasses)
        .map((equipment) => equipment?.EquipmentClassId);
      setEquipmentIdSelected(allEquipmentIds);
      setIsAllSelected(true);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ListItemButton
        label="ناوگان"
        imgSrc="/cargo/filter/truck.svg"
        noBorder
        onClick={() => setIsOpen(true)}
        endEnhancer={
          equipmentIdSelected.length > 0 ? (
            <Typography type="ParagraphMedium" color="#01ACBC">
              {equipmentIdSelected.length} مورد انتخاب شده
            </Typography>
          ) : null
        }
      />
      <BottomSheet
        height="60%"
        closeable={true}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}>
        <Header isMobile={true}>انتخاب ناوگان ها</Header>

        {isLoading ? (
          <Loading />
        ) : (
          <>
            {" "}
            <TagContainer>
              {isAllSelected ? (
                <Tag
                  key="all"
                  overrides={{
                    Root: {
                      style: () => ({
                        padding: "20px 5px 20px 5px",
                      }),
                    },
                    Action: {
                      style: () => ({
                        padding: "4px",
                        borderRadius: "50%",
                        backgroundColor: "black",
                        color: "#ffff",
                        marginRight: "8px",
                      }),
                    },
                  }}
                  onActionClick={() => setEquipmentIdSelected([])}>
                  همه ناوگان ها
                </Tag>
              ) : (
                Array.isArray(equipmentIdSelected) &&
                equipmentIdSelected.map((id) => {
                  const selectedEquipment = data
                    ?.flatMap((fleet) => fleet?.EquipmentClasses)
                    ?.find((equipment) => equipment?.EquipmentClassId === id);
                  return (
                    <Tag
                      key={id}
                      overrides={{
                        Root: {
                          style: () => ({
                            padding: "20px 5px 20px 5px",
                          }),
                        },
                        Action: {
                          style: () => ({
                            padding: "4px",
                            borderRadius: "50%",
                            backgroundColor: "black",
                            color: "#ffff",
                            marginRight: "8px",
                          }),
                        },
                      }}
                      onActionClick={() => handleTagRemove(id)}>
                      {selectedEquipment?.EquipmentClassTitle}
                    </Tag>
                  );
                })
              )}
            </TagContainer>
            <AccordionContainer>
              <Checkbox
                checked={isAllSelected}
                onChange={handleAllCheckboxChange}
                overrides={{
                  Root: {
                    style: () => ({
                      gap: "10px",
                      padding: "20px 20px 20px 0px",
                      borderBottom: "1px solid #eeeeee",
                    }),
                  },
                  Label: {
                    style: () => ({
                      fontSize: "16px",
                      fontWeight: "400",
                    }),
                  },
                }}>
                همه ناوگان ها
              </Checkbox>
              {data?.map((i, idx) => (
                <Accordion
                  key={idx}
                  overrides={{
                    Content: {
                      style: () => ({
                        padding: "0px 16px 0px 16px",
                      }),
                    },
                  }}>
                  <Panel title={i.EquipmentTypeTitle}>
                    {i?.EquipmentClasses?.map((j, jdx) => (
                      <Checkbox
                        key={jdx}
                        checked={equipmentIdSelected.includes(
                          j?.EquipmentClassId
                        )}
                        onChange={() =>
                          handleCheckboxChange(j?.EquipmentClassId)
                        }
                        overrides={{
                          Root: {
                            style: () => ({
                              gap: "10px",
                              padding: "20px 0px 20px 0px",
                              borderTop: "1px solid #eeeeee",
                            }),
                          },
                          Label: {
                            style: () => ({
                              fontSize: "16px",
                              fontWeight: "400",
                            }),
                          },
                        }}>
                        {j.EquipmentClassTitle}
                      </Checkbox>
                    ))}
                  </Panel>
                </Accordion>
              ))}
            </AccordionContainer>
            <ButtonContainer>
              <ButtonKit
                theme="black"
                width="90%"
                onClick={() => setIsOpen(false)}>
                تایید
              </ButtonKit>
            </ButtonContainer>
          </>
        )}
      </BottomSheet>
    </>
  );
}

const TagContainer = styled.div`
  display: flex;
  gap: 8px;
  padding-top: 50px;
  overflow: auto;
  &::-webkit-scrollbar {
    height: 0px;
  }
`;

export const ButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 22px 0px 10px 0px;
  background-color: #fff;
  border-top: 1px solid #eeeeee;
`;

const AccordionContainer = styled.div`
  height: calc(100% - 37px - 73px);
  overflow-y: auto;
`;

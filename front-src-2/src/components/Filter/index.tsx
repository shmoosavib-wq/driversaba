import { Form, Formik } from "formik";
import styled, { keyframes } from "styled-components";

import ButtonKit from "../Button";
import Typography from "../Typography";
import Image from "../global/Image";
import ListItemButton from "../ListItemButton";
import ToggleButton from "../global/ToggleButton";
import DropDown from "../DropDown";
import { useFilter } from "@/store";

import MultySelect from "./MultySelect";

export default function Filter({
  setOpenFilterPage,
  setFilterParams,
  setPreviousList,
}) {
  const goodTypesNames = useFilter((state) => state.goodTypesNames);
  const setGooodTypesNames = useFilter((state) => state.setGooodTypesNames);
  const { resetFilters } = useFilter((state) => state);
  const filterParams = useFilter((state) => state);

  function setFilter() {
    setFilterParams({
      GoodId: filterParams.goodTypesId,
      HasTip: filterParams.Ischecked,
      DriverEquipmentIdList: filterParams.equipmentIdSelected || null,
    });
  }
  function removeFilter() {
    setFilterParams({
      GoodId: null,
      HasTip: false,
      DriverEquipmentIdList: [],
    });
  }

  return (
    <Formik
      initialValues={{
        GoodTypes: "",
      }}
      onSubmit={() => {}}>
      <Form>
        <Container>
          <FilterNav>
            <FilterTitle>
              <Image
                src="/icons/arrow-left.svg"
                onClick={() => {
                  setOpenFilterPage(false);
                }}
              />
              <Typography type="LabelLarge">فیلترها</Typography>
            </FilterTitle>
            <div
              onClick={() => {
                removeFilter();
                resetFilters();
                setOpenFilterPage(false);
              }}>
              <Typography color="#DE1135" type="ParagraphMedium">
                حذف همه فیلترها
              </Typography>
            </div>
          </FilterNav>
          <ItemContainer>
            <DropDown
              setGooodTypesNames={setGooodTypesNames}
              title="نوع کالا"
              searchAble
              shortURL="GoodTypes"
              name="GoodTypes"
              customDropDownBody={
                <ListItemButton
                  endEnhancer={
                    goodTypesNames ? (
                      <Typography type="ParagraphMedium" color="#01ACBC">
                        {goodTypesNames}
                      </Typography>
                    ) : null
                  }
                  label="نوع بار"
                  imgSrc="/cargo/filter/box.svg"
                  noBorder
                />
              }
            />
            <MultySelect />
            <Tip>
              <TipTitle>
                <Image src="/cargo/filter/money.svg" />
                <Typography type="LabelMedium">انعام دار</Typography>
              </TipTitle>
              <ToggleButton />
            </Tip>
          </ItemContainer>
          <ButtonContainer>
            <ButtonKit
              width="90%"
              theme="black"
              onClick={() => {
                setFilter();
                setPreviousList(null);
                setOpenFilterPage(false);
              }}>
              <Typography type="LabelLarge" color="#fff">
                اعمال فیلترها
              </Typography>
            </ButtonKit>
          </ButtonContainer>
        </Container>
      </Form>
    </Formik>
  );
}

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const Tip = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
  padding: 16px;
  width: 100%;
  align-items: center;
`;
export const TipTitle = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
export const FilterNav = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1.8px solid #d9d9d9;
`;
export const ItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 16px;
`;
export const FilterTitle = styled.div`
  display: flex;
  gap: 10px;
`;
export const Container = styled.div`
  background-color: #ffff;
  position: fixed;
  z-index: 1;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  animation: ${slideUp} 0.3s ease-out forwards;
`;
export const ButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  text-align: center;
  padding-bottom: 10px;
`;

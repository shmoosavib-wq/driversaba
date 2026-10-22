import { useEffect, useState } from "react";

import API from "@/services/api-manager";
import BottomSheet from "../global/BottomSheet/index";
import ModalKit from "../global/Modal/index";
import { SearchContainer, SearchInput } from "../DropDown/style";
import { useFilter } from "@/store";

import {
  DropDownBody,
  DropDownWrapper,
  Header,
  Item,
  List,
  TitleContainer,
  Label,
  IconContainer,
  InputClear,
  ManualItem,
  ManualImage,
} from "./style";

export default function CityDropDown({
  title,
  shortURL,
  placeHolder,
  label = "",
  name = "",
  options = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [searchItems, setSearchItems] = useState([]);
  const [items, setItems] = useState([]);
  const isMobile = window.innerWidth <= 767;
  const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);
  const { SetGeographicCoordinatesAroundMe, setAddressId } = useFilter(
    (state) => state
  );
  useEffect(() => {
    if (shortURL) {
      API.get(`/DropDown/${shortURL}`).then((response) => {
        const data = response.data.Content;
        const manualOption = {
          label: "اطراف من",
          value: "manual",
          image: "/images/cargo/filter/gps.svg",
        };
        const updatedItems = [manualOption, ...data];
        setItems(updatedItems);
        setSearchItems(updatedItems);
      });
    } else {
      const manualOption = {
        label: "اطراف من",
        value: "manual",
        image: "/images/payment/spot.svg",
      };
      const updatedItems = [manualOption, ...options];
      setItems(updatedItems);
      setSearchItems(updatedItems);
    }
  }, [shortURL]);

  const handleChange = (item) => {
    setSelectedLabel(item.label);
    if (item.value === "manual") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            SetGeographicCoordinatesAroundMe(`${latitude}/${longitude}`);
          },
          (error) => {
            console.error("Error getting location:", error);
            // Handle the error accordingly, e.g., show an error message
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        // Handle the error accordingly, e.g., show an error message
      }
    } else {
      setAddressId(item.value);
    }
    setIsOpen(false);
    setShowDeleteButton(true);
  };

  const Container = isMobile ? BottomSheet : ModalKit;

  const filterDataHandler = (e) => {
    const searchValue = e.target.value;
    const filteredItems = searchItems.filter((item) =>
      item.label.toLowerCase().includes(searchValue.toLowerCase())
    );
    setItems(filteredItems);
  };

  return (
    <DropDownWrapper id="path-selection">
      <TitleContainer>
        <Label>{label}</Label>
      </TitleContainer>
      <div style={{ position: "relative" }}>
        <DropDownBody
          readOnly
          placeholder={placeHolder}
          onClick={() => {
            setIsOpen(true);
          }}
          value={selectedLabel}
          name={name}
        />
        {showDeleteButton && (
          <IconContainer
            onClick={() => {
              setSelectedLabel("");
              setShowDeleteButton(false);
              setAddressId(null);
              SetGeographicCoordinatesAroundMe(null);
            }}>
            <InputClear
              showDeleteButton={showDeleteButton}
              src="/images/icons/inputIcon/close.svg"
              alt="close"
            />
          </IconContainer>
        )}
      </div>

      <Container
        closeable={true}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}>
        <Header isMobile={isMobile}>{title}</Header>
        <List>
          <SearchContainer>
            <SearchInput onChange={filterDataHandler} placeholder="جستجو ..." />
          </SearchContainer>
          {items.map((item) =>
            item.value === "manual" ? (
              <ManualItem key={item.value} onClick={() => handleChange(item)}>
                {item.image && <ManualImage src={item.image} alt="manual" />}
                {item.label}
              </ManualItem>
            ) : (
              <Item key={item.value} onClick={() => handleChange(item)}>
                {item.label}
              </Item>
            )
          )}
        </List>
      </Container>
    </DropDownWrapper>
  );
}

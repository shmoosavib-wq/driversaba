import { cloneElement, useState } from "react";
import { useField } from "formik";

import API from "@/services/api-manager";
import BottomSheet from "../global/BottomSheet";
import ModalKit from "../global/Modal";
import { Label } from "../Input/style";
import Loading from "../Loading";
import { useFilter } from "@/store";

import {
  DropDownBody,
  DropDownWrapper,
  Header,
  Item,
  List,
  TitleContainer,
  ErrorImg,
  SearchContainer,
  SearchInput,
  LoadingContainer,
} from "./style";

interface DropDownT {
  title: string;
  shortURL?: string;
  placeHolder?: string;
  label?: string;
  name?: string;
  searchAble?: boolean;
  options?: any[];
  setGooodTypesNames?: any;
  customDropDownBody?: any;
}
export default function DropDown({
  title,
  setGooodTypesNames = () => {},
  shortURL,
  placeHolder,
  customDropDownBody,
  label = "",
  name = "",
  options = [],
  searchAble = false,
}: DropDownT) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const isMobile = window.innerWidth <= 767;
  const [data, setData] = useState();
  const [field, meta, helpers] = useField({ name });
  const [selectedLabel, setSelectedLabel] = useState(field.value?.label || "");
  if (field.value?.value) {
    helpers.setValue(field.value?.value);
  }
  const setGooodTypesId = useFilter((state) => state.setGooodTypesId);

  const fetchData = async () => {
    if (shortURL) {
      try {
        const response = await API.get(`/DropDown/${shortURL}`);
        let data = response.data.Content;
        setItems(data);
        setSearchItems(data);
        setData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    } else {
      setItems(options);
    }
  };

  const handleChange = (item) => {
    setSelectedLabel(item.label);
    setGooodTypesNames(item.label);
    setGooodTypesId(item.value);
    helpers.setValue(item.value, item.label);
    setIsOpen(false);
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
    <DropDownWrapper>
      <TitleContainer>
        <Label>{label}</Label>
        {meta.touched && meta.error && (
          <ErrorImg src="/images/icons/inputIcon/erroricon.svg" alt="error" />
        )}
      </TitleContainer>
      {customDropDownBody ? (
        cloneElement(customDropDownBody, {
          onClick: () => {
            console.log("click");
            fetchData();
            setIsOpen(true);
          },
        })
      ) : (
        <DropDownBody
          readOnly
          placeholder={placeHolder}
          onClick={() => {
            fetchData();
            setIsOpen(true);
            helpers.setTouched(true);
          }}
          value={selectedLabel}
          isError={meta.touched && meta.error}
          name={name}
        />
      )}

      <Container
        height="60%"
        closeable={true}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setItems(data);
        }}>
        <Header isMobile={isMobile}>{title}</Header>

        <List>
          {searchAble && (
            <SearchContainer>
              <SearchInput
                onChange={filterDataHandler}
                placeholder="جستجو ..."
              />
            </SearchContainer>
          )}
          {loading && (
            <LoadingContainer>
              <Loading />
            </LoadingContainer>
          )}
          {items.map((item) => (
            <Item key={item.value} onClick={() => handleChange(item)}>
              {item.label}
            </Item>
          ))}
        </List>
      </Container>
    </DropDownWrapper>
  );
}

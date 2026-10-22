import { Link } from "react-router-dom";

import Navbar from "@/layout/Navbar";
import Typography from "@/components/Typography";
import ListItemButton from "@/components/ListItemButton";
import EducationItems from "@/data/education";

import { EducationContainer, Item, ItemContainer } from "./style";

export default function Education() {
  return (
    <Navbar title="آموزش و راهنمایی" isSupport={false}>
      <EducationContainer>
        <Typography title="همه ی موضوعات" type="HeadingXSmall" />

        <ItemContainer>
          {EducationItems.map((i, idx) => (
            <Link key={idx} to={`/education/${i.id}`}>
              <Item>
                <ListItemButton
                  label={i.title}
                  noBorder
                  overridesCustom={{
                    style: {
                      paddingRight: 0,
                      paddingLeft: 0,
                      border: "none",
                    },
                  }}
                />
              </Item>
            </Link>
          ))}
        </ItemContainer>
      </EducationContainer>
    </Navbar>
  );
}

import { Navigate, useParams } from "react-router-dom";
import styled from "styled-components";

import EducationItems from "@/data/education";
import Typography from "@/components/Typography";
import Image from "@/components/global/Image";
import { Navabr } from "@/layout";

export default function EducationDetail() {
  const { id } = useParams();
  const Category = EducationItems.find((i) => i.id === id);

  if (!Category) return <Navigate replace to="/404" />;

  return (
    <Navabr title={`آموزش ${Category.title}`} isSupport={false}>
      <DetailContainer>
        <Typography type="HeadingXSmall">{Category.title}</Typography>

        {Category.items.map((i, idx) => (
          <ItemContainer key={idx}>
            {i.text && <Typography type="ParagraphMedium">{i.text}</Typography>}
            {i.img && <Image src={`/education/${Category.id}/${i.img}`} />}
          </ItemContainer>
        ))}
      </DetailContainer>
    </Navabr>
  );
}

const DetailContainer = styled.div`
  height: calc(100dvh - 60px);
  overflow-y: auto;
  padding: 0 16px;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px 0;
  padding: 12px 0;
`;

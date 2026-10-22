import styled from "styled-components";

import Typography from "@/components/Typography";

export default function Table({ titles, items }) {
  return (
    <Container>
      <TableContainer>
        <thead>
          <tr>
            {titles.map((i, idx) => (
              <TableHeader key={idx}>
                <Typography type="LabelMedium">{i}</Typography>
              </TableHeader>
            ))}
          </tr>
        </thead>

        {items.map((i, idx) => (
          <TableRow key={idx} isOdd={idx % 2 !== 0}>
            <TableData>
              <Typography type="ParagraphMedium">{i.FullName}</Typography>
            </TableData>
            <TableData>
              <Typography type="ParagraphMedium"> {i.Count}</Typography>
            </TableData>
          </TableRow>
        ))}
      </TableContainer>
    </Container>
  );
}

export const Container = styled.div`
  border-radius: 8px;
  border: 1px solid #f3f3f3;
  max-height: 200px;
  overflow: auto;
`;

export const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden; /* This ensures the border-radius is applied correctly */
`;

export const TableHeader = styled.th`
  border: 1px solid #e8e8e8;
  padding: 16px;
  text-align: right;
`;

export const TableData = styled.td`
  border: 1px solid #e8e8e8;
  padding: 16px;
`;

export const TableRow = styled.tr<{ isOdd?: boolean }>`
  background-color: ${(props) => (props.isOdd ? "#F3F3F3" : "white")};
`;

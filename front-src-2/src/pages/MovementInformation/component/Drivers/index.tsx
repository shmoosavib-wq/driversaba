import styled from "styled-components";

export default function Drivers({
  FirstDriverFullName,
  FirstDriverNationalCode,
  SecondDriverFullName,
  SecondDriverNationalId,
}) {
  return (
    <TableContainer>
      <Table>
        {FirstDriverFullName && FirstDriverNationalCode && (
          <Tr>
            <Th>راننده اول</Th>
            <Td>{FirstDriverFullName}</Td>
            <Td>{FirstDriverNationalCode}</Td>
          </Tr>
        )}
        {SecondDriverFullName && SecondDriverNationalId && (
          <Tr>
            <Th>راننده دوم</Th>
            <Td>{SecondDriverFullName}</Td>
            <Td>{SecondDriverNationalId}</Td>
          </Tr>
        )}
      </Table>
    </TableContainer>
  );
}

const TableContainer = styled.div`
  width: 100%;
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Tr = styled.tr`
  padding: 8px;
  text-align: left;
  background-color: #fff;
  border: 1px solid #e8e8e8;
`;

const Th = styled.td`
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  padding: 16px 8px 16px 16px;
`;

const Td = styled.td`
  border: 1px solid #e8e8e8;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  padding: 16px;
`;

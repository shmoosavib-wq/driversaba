import { Formik, Form } from "formik";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import { InputKit } from "@/components";
import ButtonKit from "@/components/Button";
import { getRemittanceRequestInfo } from "@/services/sabaService/saba-service-api";
import { useSabaServiceValue } from "@/store";

import { initialValues, validationSchema } from "../formTools/form";

export default function RemittanceNumber({ setNextPage, setRemittanceInfo }) {
  const { setSabaServiceValue } = useSabaServiceValue((state) => state);

  const [remittanceNumber, setRemittanceNumber] = useState(null);

  const { data, status, isLoading } = useQuery(
    ["Second-Driver", remittanceNumber],
    () => getRemittanceRequestInfo(remittanceNumber),
    {
      enabled: !!remittanceNumber, // This query will not execute until the remittanceNumber exists
    }
  );

  const onSubmit = (val) => {
    setRemittanceNumber(val.RemittanceNumber);
    setSabaServiceValue({ RemittanceRequestId: val.RemittanceNumber });
  };

  useEffect(() => {
    if (status === "success") {
      setRemittanceInfo(data);

      setNextPage(true);
    }
  }, [status, data]);

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={validationSchema}>
      <Form>
        <Container>
          <InputKit
            name="RemittanceNumber"
            label="شماره حواله"
            placeholder="مثلا 0012345678"
            type="tel"
          />
          <ButtonKit
            text="بررسی شماره حواله"
            theme="blue"
            width="100%"
            isLoading={isLoading}
            height="48px"
            type="submit"
          />
        </Container>
      </Form>
    </Formik>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 0 16px;
  height: calc(100dvh - 190px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

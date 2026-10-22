import { useQuery } from "react-query";
import { RWebShare } from "react-web-share";

import Loading from "@/components/Loading";
import Typography from "@/components/Typography";
import Image from "@/components/global/Image";
import Table from "@/components/global/Table";
import { getInviteData } from "@/services/driver/driver-api";

import {
  Container,
  InventionItemsWrapper,
  Invitation,
  InvitationTable,
  IventionItemContainer,
  LabelContainer,
  Link,
  LinkContainer,
  VariantContainer,
} from "./style";

const titles = ["نام راننده", "تعداد"];

function InvitationLink({ data }) {
  return (
    <LinkContainer>
      <Link>
        <Typography color="#A6A6A6">{`${window.location.origin}/?ref=${data?.ReferralId}`}</Typography>
      </Link>
      <RWebShare
        data={{
          text: `${data?.InviteContent}`,
          url: `${window.location.origin}/?ref=${data?.ReferralId}`,
          title: "دعوت از دوستان",
        }}>
        <VariantContainer>
          <Typography type="ParagraphMedium">ارسال دعوت نامه</Typography>
          <Image src="/invite/send.svg" />
        </VariantContainer>
      </RWebShare>
    </LinkContainer>
  );
}

function InventionItem({ label, value, img }) {
  return (
    <IventionItemContainer>
      <LabelContainer>
        <Image src={img} />
        <Typography type="LabelMedium">{label}</Typography>
      </LabelContainer>
      <span>
        <Typography type="ParagraphMedium">{value}</Typography>
      </span>
    </IventionItemContainer>
  );
}

export default function Invite() {
  const { data, isLoading } = useQuery("IVITEDATA", getInviteData);

  return (
    <Container>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Invitation>
            <Image src="/invite/gift.svg" alt="gift" />
            <Typography type="ParagraphMedium">
              با دعوت دوستان خود به صبابار از طریق لینک زیر ، تا 10 سیر اول آنها
              ، به ازای هر سیر 500,000 تومان جایزه بگیرید
            </Typography>
          </Invitation>

          <InvitationLink data={data} />

          <InventionItemsWrapper>
            <InventionItem
              img="/invite/people.svg"
              label="تعداد افراد دعوت شده"
              value={`${data?.InvitedPeopleCount} نفر`}
            />
            <InventionItem
              img="/invite/doneCommition.svg"
              label="پاداش تسویه شده"
              value={`${data?.PaidBonus} تومان`}
            />
            <InventionItem
              img="/invite/waitingCommition.svg"
              label="پاداش تسویه نشده"
              value={`${data?.UnPaidBonus} تومان`}
            />
          </InventionItemsWrapper>
          <InvitationTable>
            <Typography type="LabelMedium" color="#01ACBC" width="100%">
              سیر های دعوت شدگان
            </Typography>
            {data.MySuccessfulInvitations.length === 0 ? (
              <Typography margin="auto">
                شما تاکنون هیچ دعوت موفقی نداشته اید
              </Typography>
            ) : (
              <Table titles={titles} items={data.MySuccessfulInvitations} />
            )}
          </InvitationTable>
        </>
      )}
    </Container>
  );
}

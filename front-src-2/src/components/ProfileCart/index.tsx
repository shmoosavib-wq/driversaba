import { CartContainer, CartImg, CartDescription } from "./style";

interface PropsType {
  item: {
    imgSrc: string;
    desc: string;
  };
}

const ProfileCart = ({ item }: PropsType) => {
  return (
    <CartContainer>
      <CartImg src={item.imgSrc} alt={item.desc} />
      <CartDescription>{item.desc}</CartDescription>
    </CartContainer>
  );
};

export default ProfileCart;

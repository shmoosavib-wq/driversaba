import { ColorsContainer } from "./style";

const persianAlphabet = [
  "ا",
  "ب",
  "پ",
  "ت",
  "ث",
  "ج",
  "چ",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "ژ",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ک",
  "گ",
  "ل",
  "م",
  "ن",
  "و",
  "ه",
  "ی",
];

const colors = [
  "#0E8345",
  "#FFC727",
  "#DE1135",
  "#004FAB",
  "#000000",
  "#01ACBC",
];

interface PropsType {
  fullName: string;
  width: string;
  height: string;
  fontSize: string;
}

const RandomColors = ({ fullName, width, height, fontSize }: PropsType) => {
  let colorsLenght = colors.length;
  const persianAlphabetlenght = persianAlphabet.length;

  const userFirstLetter = fullName?.split(" ")[0].charAt(0);

  const groupedLetters = {};
  for (let i = 0; i < persianAlphabetlenght; i++) {
    const colorIndex = i % colorsLenght;
    const color = colors[colorIndex];
    if (!groupedLetters[color]) {
      groupedLetters[color] = [];
    }
    groupedLetters[color].push(persianAlphabet[i]);
  }

  const getColorForFirstLetter = (userFirstLetter, groupedLetters) => {
    for (const color in groupedLetters) {
      if (groupedLetters[color].includes(userFirstLetter)) {
        return color;
      }
    }
    return null;
  };

  const colorForFirstLetter = getColorForFirstLetter(
    userFirstLetter,
    groupedLetters
  );

  

  return (
    <ColorsContainer
      width={width}
      height={height}
      fontSize={fontSize}
      color={colorForFirstLetter}>
      {userFirstLetter}
    </ColorsContainer>
  );
};

export default RandomColors;

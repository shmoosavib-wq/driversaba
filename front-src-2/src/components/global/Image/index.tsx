interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  basePath?: string;
}

export default function Image({
  basePath = "/images",
  src,
  ...props
}: ImageProps) {
  return (
    <img
      loading="lazy"
      alt="img"
      src={basePath ? basePath + src : src}
      {...props}
    />
  );
}

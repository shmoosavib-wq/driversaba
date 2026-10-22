import { Fragment } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/styles/slider.css";

const settings = {
  className: "slider",
  centerMode: true,
  infinite: true,
  centerPadding: "60px",
  slidesToShow: 3,
  speed: 500,
};

export default function ProfilePicker({ formik, field }) {
  return (
    <div className="slider-container">
      <Slider {...settings} afterChange={(c) => formik.setFieldValue(field, c)}>
        {Array(6)
          .fill(null)
          .map((item, idx) => (
            <Fragment key={idx}>
              <img
                src={`/images/check.svg`}
                loading="lazy"
                alt="check"
                className="check"
              />
              <img
                src={`/images/shadow.svg`}
                loading="lazy"
                alt="shadow"
                className="avatar-shadow"
              />
              <img
                src={`/images/avatar/${idx + 1}.svg`}
                loading="lazy"
                alt={`avatar-${idx + 1}`}
                height={250}
                width={250}
                className="avatar"
              />
            </Fragment>
          ))}
      </Slider>
    </div>
  );
}

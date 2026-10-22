import {
  ProgressSteps,
  NumberedStep,
  ORIENTATION,
} from "baseui/progress-steps";
import "./style.css";

export function ProgressStepsContainer({ current, steps, fontSize }) {
  // محاسبه محدوده استپ‌ها برای نمایش
  let startIndex, endIndex;

  if (current <= 1) {
    startIndex = 0;
    endIndex = 3;
  } else if (current >= steps.length - 2) {
    startIndex = steps.length - 3;
    endIndex = steps.length;
  } else {
    startIndex = current - 1;
    endIndex = current + 2;
  }

  return (
    <ProgressSteps
      current={current} // حفظ ایندکس استپ فعلی بدون تغییر
      orientation={ORIENTATION.horizontal}
      overrides={{
        Root: {
          style: {
            direction: "rtl",
          },
        },
      }}>
      {steps.map((step, index) => (
        <NumberedStep
          title={step.title}
          key={step.id}
          overrides={{
            Title: {
              style: {
                fontFamily: "IRANSansX",
                fontSize: fontSize,
                fontWeight: 600,
                textAlign: "center",

                display:
                  index >= startIndex && index < endIndex ? "block" : "none",
              },
            },
            Root: {
              style: {
                display:
                  index >= startIndex && index < endIndex ? "flex" : "none",
                flexDirection: "column",
                alignItems: "center",
              },
            },
            Tail: {
              style: {
                display:
                  index >= startIndex && index < endIndex - 1
                    ? "block"
                    : "none",
                marginRight: "-48px",
                marginLeft: "-50px",
              },
            },
            Icon: {
              props: {
                className: "icon-style",
              },
              style: {
                fontFamily: "IRANSansX",
                width: "24px",
                height: "24px",
                marginTop: "12px",
                fontSize: "10.67px",
                fontWeight: 500,
                textAlign: "center",
              },
            },
          }}>
          {step.content}
        </NumberedStep>
      ))}
    </ProgressSteps>
  );
}

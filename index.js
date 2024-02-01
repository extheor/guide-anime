export default function guide() {
  const maskEl = document.createElement("div");
  const nextStepEl = document.createElement("div");
  const minx = "minx";
  const maskBg = "mask_bg";
  const tTime = "t_time";
  const pointKeys = ["ltx", "lty", "rtx", "rty", "rbx", "rby", "lbx", "lby"];

  const css = {
    mask: {
      display: "none",
      transition: `all var(--${tTime})`,
      width: "100vw",
      height: "100vh",
      background: `var(--${maskBg})`,
      position: "absolute",
      top: 0,
      left: 0,
      clipPath: `polygon(0% 0%, 0% 100%, var(--${minx}) 100%,
        var(--${pointKeys[0]}) var(--${pointKeys[1]}),
        var(--${pointKeys[2]}) var(--${pointKeys[3]}),
        var(--${pointKeys[4]}) var(--${pointKeys[5]}),
        var(--${pointKeys[6]}) var(--${pointKeys[7]}),
        var(--${minx}) 100%, 100% 100%, 100% 0%)`,
    },
    nextStep: {
      transition: `all var(--${tTime})`,
      color: "#fff",
      position: "absolute",
      left: `calc(var(--${pointKeys[2]}) + 10px)`,
      top: `calc(var(--${pointKeys[3]}) + (var(--${pointKeys[5]}) - var(--${pointKeys[3]})) / 2 - 12px)`,
    },
  };

  for (const key in css.mask) {
    maskEl.style[key] = css.mask[key];
  }
  for (const key in css.nextStep) {
    nextStepEl.style[key] = css.nextStep[key];
  }

  maskEl.appendChild(nextStepEl);
  document.body.appendChild(maskEl);

  // 步骤列表
  let steps = [];
  let stepText = "下一步";
  let lastStepText = "完成";
  let tTimeVal = 1;

  // 初始化mask背景
  document.documentElement.style.setProperty(
    `--${maskBg}`,
    "rgba(0, 0, 0, 0.5)"
  );
  // 初始化过渡时长
  document.documentElement.style.setProperty(`--${tTime}`, `${tTimeVal}s`);

  return {
    setOptions: (options) => {
      if (Object.prototype.toString.call(options.steps) === "[object Array]") {
        let existEl = true;
        options.steps.forEach((item, index) => {
          if (item && item.element) {
            const el = document.querySelector(item.element);

            if (!el) {
              existEl = false;
              options.steps[index] = null;
            } else {
              const x = el.offsetLeft;
              const y = el.offsetTop;
              const w = el.offsetWidth;
              const h = el.offsetHeight;

              if (
                Object.prototype.toString.call(item.point) === "[object Object]"
              ) {
                pointKeys.some((k) => {
                  if (!item.point[k]) {
                    console.warn(`请按照规范定义point对象，正确格式：{
                      ltx: "",
                      lty: "",
                      rtx: "",
                      rty: "",
                      rbx: "",
                      rby: "",
                      lbx: "",
                      lby: ""
                    }`);

                    // 使用默认坐标值
                    item.point = {
                      [pointKeys[0]]: x + "px",
                      [pointKeys[1]]: y + "px",
                      [pointKeys[2]]: x + w + "px",
                      [pointKeys[3]]: y + "px",
                      [pointKeys[4]]: x + w + "px",
                      [pointKeys[5]]: y + h + "px",
                      [pointKeys[6]]: x + "px",
                      [pointKeys[7]]: y + h + "px",
                    };

                    return true;
                  }
                });
              } else {
                // 使用默认坐标值
                item.point = {
                  [pointKeys[0]]: x + "px",
                  [pointKeys[1]]: y + "px",
                  [pointKeys[2]]: x + w + "px",
                  [pointKeys[3]]: y + "px",
                  [pointKeys[4]]: x + w + "px",
                  [pointKeys[5]]: y + h + "px",
                  [pointKeys[6]]: x + "px",
                  [pointKeys[7]]: y + h + "px",
                };
              }
            }
          } else {
            console.warn("请配置步骤元素");
          }
        });
        steps = options.steps.filter(Boolean);

        !existEl && console.warn("请检查配置的元素是否存在");
      }

      Object.prototype.toString.call(options.maskBg) === "[object String]" &&
        document.documentElement.style.setProperty(
          `--${maskBg}`,
          options.maskBg
        );

      Object.prototype.toString.call(options.stepText) === "[object String]" &&
        (stepText = options.stepText);
      Object.prototype.toString.call(options.lastStepText) ===
        "[object String]" && (lastStepText = options.lastStepText);

      const tTimeType = Object.prototype.toString.call(options.tTime);
      if (tTimeType === "[object String]") {
        document.documentElement.style.setProperty(`--${tTime}`, options.tTime);
        tTimeVal = options.tTime.slice(0, -1);
      }
      if (tTimeType === "[object Number]") {
        document.documentElement.style.setProperty(
          `--${tTime}`,
          options.tTime + "s"
        );
        tTimeVal = options.tTime;
      }
      // if(Object.prototype.toString.call(options.stepText) === "[object String]") {
      //   stepText = options.stepText
      // }
      // if(Object.prototype.toString.call(options.lastStepText) === "[object String]") {
      //   lastStepText = options.lastStepText
      // }
    },
    start: () => {
      // 第几步的索引值
      let stepIndex = 0;

      maskEl.style.display = "block";

      if (!steps || steps.length === 0) {
        throw new Error("未配置正确的步骤元素");
      }

      if (stepIndex === steps.length - 1) {
        nextStepEl.textContent = lastStepText;
      } else {
        nextStepEl.textContent = stepText;
      }

      function execStep() {
        const step = steps[stepIndex];

        function setPoint(cssVar, value) {
          document.documentElement.style.setProperty(cssVar, value);
        }

        for (const key in step.point) {
          setPoint(`--${key}`, step.point[key]);
        }
        if (!Reflect.has(step.point, `--${minx}`)) {
          setPoint(`--${minx}`, step.point[pointKeys[0]]);
        }
      }

      // 节流的过期时间
      let expireTime = 0;
      nextStepEl.addEventListener("click", nextStepClick);
      function nextStepClick() {
        // 节流
        if (+new Date() - expireTime < tTimeVal * 1000) return;
        expireTime = +new Date();

        const lastStepIndex = steps.length - 1;
        if (stepIndex === lastStepIndex) {
          maskEl.style.opacity = 0;
          e.target.removeEventListener("click", nextStepClick);
          return;
        }

        stepIndex++;
        // 如果是最后一步，则不显示“下一步”
        if (stepIndex === lastStepIndex) {
          nextStepEl.textContent = lastStepText;
        }
        execStep();
      }

      // 监听过渡动画结束事件
      maskEl.addEventListener("transitionend", transitionEnd);
      function transitionEnd(e) {
        if (e.propertyName === "opacity") {
          e.target.style.display = "none";
          e.target.removeEventListener("transitionend", transitionEnd);
        }
      }
      execStep();
    },
  };
}

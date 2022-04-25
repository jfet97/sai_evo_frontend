import { Exercise } from "./models/interfaces";
/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from "lodash/debounce";
import moment from "moment";
import "moment/locale/it";
import { getTranslatedString as _ } from "./i18n";
import { ErrorMessage } from "./interfaces";
import router from "./router";
import store from "./store";
import { SharedState } from "./store/types";
import { ExerciseState } from "./models";

const EDITOR_DEBOUNCE_TIME_MS = 1500;
const EDITOR_DEBOUNCE_MAX_WAIT_MS = 4000;

const SEARCH_DEBOUNCE_TIME_MS = 500;
const SEARCH_DEBOUNCE_MAX_WAIT_MS = 1000;

const STUDENT_DEBOUNCE_TEXT_TIME_MS = 5000;
const STUDENT_DEBOUNCE_TEXT_MAX_WAIT_MS = 10000;

export const logOut = (): void => {
  store.commit("shared/resetToken");
  router.push({
    name: "Login",
  });
};

export const redirectToMainView = (): void => {
  if (router.currentRoute.value.query.redirect) {
    router.push(router.currentRoute.value.query.redirect as string);
  } else if ((store.state as { shared: SharedState }).shared.user.is_teacher) {
    router.push("/teacher/courses");
  } else {
    router.push("/student/courses");
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getDebouncedForFilter = (callback: any) =>
  debounce(callback, SEARCH_DEBOUNCE_TIME_MS, {
    maxWait: SEARCH_DEBOUNCE_MAX_WAIT_MS,
  });

export const getFormattedTimestamp = (
  timestamp: string,
  dateOnly = false,
  reduced = false
): string => {
  moment().locale("it");
  return (
    moment(timestamp)
      //.calendar()
      .format(
        reduced
          ? "DD MMM YYYY" + (dateOnly ? "" : ", HH:mm")
          : "DD MMMM YYYY" + (dateOnly ? "" : `, [${_("misc.at")}] HH:mm`)
      )
  );
};

export const rippleEffect = (
  event: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentTarget: any;
    pageX: number;
    clientX: number;
    pageY: number;
    clientY: number;
  },
  rippleClass = "ripple-primary"
): void => {
  //console.log('EVENT', event)
  const btn = event.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;

  //console.log('parent', btn.offsetParent)
  const parentPosition = getComputedStyle(btn.offsetParent).position;
  let ancestor = btn.offsetParent;
  const ancestors = [];
  while (ancestor) {
    // console.log(
    //   "ancestor position",
    //   getComputedStyle(ancestor).position,
    //   "offsetparent",
    //   getOffset(ancestor),
    //   "parent scroll",
    //   ancestor.scrollHeight
    // );
    ancestors.push(ancestor);
    ancestor = ancestor.offsetParent;
  }

  const offsetX =
    parentPosition === "fixed" ||
    parentPosition === "absolute" ||
    ancestors.some(
      (a) =>
        getComputedStyle(a).position === "fixed" ||
        getComputedStyle(a).position === "absolute"
    )
      ? event.clientX
      : event.pageX;
  const offsetY =
    parentPosition === "fixed" ||
    parentPosition === "absolute" ||
    ancestors.some(
      (a) =>
        getComputedStyle(a).position === "fixed" ||
        getComputedStyle(a).position === "absolute"
    )
      ? event.clientY
      : event.pageY;

  const { offsetTop, offsetLeft } = getOffset(btn);
  //console.log("top left", offsetTop, offsetLeft);

  //const {top, left} = this.getOffset(btn)
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${offsetX - (offsetLeft + radius)}px`;
  circle.style.top = `${offsetY - (offsetTop + radius)}px`;
  circle.classList.add("ripple");
  circle.classList.add(rippleClass);

  const ripple = btn.getElementsByClassName("ripple")[0];
  //console.log('ripple', ripple, 'offsetY', offsetY)
  if (ripple) {
    ripple.remove();
  }

  btn.appendChild(circle);
};

const getOffset = (el: {
  offsetLeft: number;
  offsetTop: number;
  scrollLeft: number;
  scrollTop: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  offsetParent: any;
}) => {
  let _x = 0;
  let _y = 0;
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { offsetTop: _y, offsetLeft: _x };
};

export const getErrorData = (e: any, useAsIs = false): ErrorMessage => {
  if (useAsIs) {
    return { title: e };
  }
  if (e.response) {
    return {
      icon: "error_outline",
      title: _("errors." + e.response.status),
    };
  } else if (e.request) {
    return {
      title: _("errors.no_connection"),
      icon: "cloud_off",
    };
  } else {
    return {
      title: _("errors.unknown_error"),
    };
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setPageWideError = (e: any) => {
  const sharedState = (store.state as { shared: SharedState }).shared;
  sharedState.pageWideErrorData = getErrorData(e);
  throw e;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setErrorNotification = (e: any, useAsIs = false) => {
  console.error("EEEE", e);

  store.commit("shared/setErrorNotificationData", {
    data: getErrorData(e, useAsIs),
  });
};

// export const typesetTex = () => {
//   console.log("typesetting");
//   (window as any).MathJax.typeset();
// };

export function forceFileDownload(response: { data: BlobPart }, title: string) {
  console.log(title);
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", title);
  document.body.appendChild(link);
  link.click();
}

export const formatExerciseText = (text: string): string => {
  return text.replace(/```([^`]*)```/g, "<pre>$1</pre>");
};

export const getExerciseTitle = (exercise: Exercise): string =>
  (exercise?.label ?? "").trim().length > 0
    ? (exercise.label as string)
    : _("exercise_preview.unnamed_exercise");

export const getClonedExercise = (exercise: Exercise): Exercise => ({
  ...exercise,
  label: exercise.label + " " + _("exercise.clone_label"),
  state: ExerciseState.DRAFT,
});

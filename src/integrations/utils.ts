import { CLOZE_SEPARATOR } from "./../const";
import { Exercise, ExerciseType } from "@/models";
import { MoodleCategory, MoodleQuestion } from "./interfaces";

const parseString = require("xml2js").parseString;

export const xmlToJson = async (xml: string): Promise<any> =>
  new Promise((resolve, reject) => {
    parseString(xml, (err: any, result: any) =>
      err ? reject(err) : resolve(result)
    );
  });

export const getTagsFromMoodleCategory = (category: MoodleCategory): string[] =>
  category[0].text[0].split("$course$/")[1].split("/");

export const getExerciseTypeFromMoodleQuestion = (
  q: MoodleQuestion
): ExerciseType | undefined => {
  const questionType = q.$.type;
  if (questionType === "truefalse") {
    return ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE;
  }
  if (questionType === "multichoice") {
    return JSON.parse(q.single[0])
      ? ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE
      : ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE;
  }
  if (questionType === "cloze") {
    return ExerciseType.COMPLETION;
  }
  return undefined;
};

const clozeSubQuestionRegex =
  /\{(\d*\s*):(MULTICHOICE|MC):(=?([^#}]*)\s*#?\s*([^~}]*\s*)?)+\}/g;

export const getMoodleClozeQuestionsAsExercises = (
  q: MoodleQuestion
): Exercise[] => {
  const answerRegex = /(=?)\s*(%[-\d]+%)?([^~]+)/;

  const ret = [] as Exercise[];
  let childCount = 0;

  const matches = q.questiontext[0].text[0].matchAll(clozeSubQuestionRegex);
  for (const match of matches) {
    const childWeight = match[1];

    const child: Exercise = {
      id: "",
      text: "",
      exercise_type: ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE,
      choices: [],
      child_weight: childWeight ? parseFloat(childWeight) : undefined,
    };
    const answers = match[3].split("~");
    for (const answer of answers) {
      console.log(answer);
      const answerMatch = answer.match(answerRegex) as RegExpMatchArray;
      const isCorrectAnswer = answerMatch[1] === "=";
      const answerScore = (answerMatch[2] ?? "").replace(/%/g, ""); // TODO check validity
      const answerText = answerMatch[3] as string;

      child.choices?.push({
        text: answerText,
        id: "",
        correctness_percentage: isCorrectAnswer
          ? 100
          : parseFloat(answerScore) || 0,
      });
    }
    childCount++;
    ret.push(child);
  }
  ret.forEach((e) => {
    if (typeof e.child_weight === "undefined") {
      e.child_weight = 100 / childCount;
    }
  });
  return ret;
};

export const processMoodleQuestionText = (q: MoodleQuestion): string => {
  // TODO add images, process cloze etc.
  // <img src="data:image/jpeg;base64," />
  const fileNamesAndContents = (q.questiontext[0].file ?? []).map((f) => ({
    name: f.$.name,
    content: f._,
  }));
  const ret = q.questiontext[0].text[0];

  const imgRegex = /<img[^>]+src="?([^"\s]+)"?[^>]*\/?>/g;
  return ret
    .replace(clozeSubQuestionRegex, CLOZE_SEPARATOR)
    .replace(
      imgRegex,
      (_, src: string) =>
        `<img src="data:image/jpeg;base64,${
          fileNamesAndContents.find(
            (f) => f.name === src.substring("@@PLUGINFILE@@/".length)
          )?.content ?? ""
        }" />`
    );
};

import { ADT, matchI } from "ts-adt";
import { constants, MapFromUntaggedConstants } from "ts-consts";

export enum ExerciseType {
  MULTIPLE_CHOICE_SINGLE_POSSIBLE,
  MULTIPLE_CHOICE_MULTIPLE_POSSIBLE,
  OPEN_ANSWER,
  COMPLETION,
  AGGREGATED,
  JS,
  ATTACHMENT,
  C,
}

interface ExerciseSolutionsFields {
  solutions: string[]; // ExerciseSolution[]
}

interface ExerciseTeacherFields extends Lockable, Orderable {
  label: string;
  state: string; //TODO ExerciseState
  private_tags: string[]; // TODO Tag[];
}

interface BaseExerciseFields {
  id: string;
  text: string;
  public_tags: string[]; // TODO use Tag and use empty array if absent
  child_weight: number; // TODO put to 1 if absent
}

interface MultipleChoiceRadioExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE;
  choices: string[]; // TODO ExerciseChoice[]
}

interface MultipleChoiceCheckboxExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE;
  choices: string[]; // TODO ExerciseChoice[]
}

interface JSExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.JS;
  requires_typescript: boolean;
  testcases: unknown[]; // TODO JSTestCase[]
}

interface CExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.C;
  testcases: unknown[]; // TODO CTestCase[]
}

interface OpenAnswerExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.OPEN_ANSWER;
}

interface AttachmentExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.ATTACHMENT;
}

interface ClozeExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.COMPLETION;
  sub_exercises: Exercise[];
}

interface AggregatedExercise extends BaseExerciseFields {
  exercise_type: ExerciseType.AGGREGATED;
  sub_exercises: Exercise[];
}

/* with solutions */

interface MultipleChoiceRadioExerciseWithSolutions
  extends MultipleChoiceRadioExercise,
    ExerciseSolutionsFields {}

interface MultipleChoiceCheckboxExerciseWithSolutions
  extends MultipleChoiceCheckboxExercise,
    ExerciseSolutionsFields {}

interface JSExerciseWithSolutions extends JSExercise, ExerciseSolutionsFields {}

interface CExerciseWithSolutions extends CExercise, ExerciseSolutionsFields {}

interface OpenAnswerExerciseWithSolutions
  extends OpenAnswerExercise,
    ExerciseSolutionsFields {}

interface AttachmentExerciseWithSolutions
  extends AttachmentExercise,
    ExerciseSolutionsFields {}

interface ClozeExerciseWithSolutions
  extends ClozeExercise,
    ExerciseSolutionsFields {}

interface AggregatedExerciseWithSolutions
  extends AggregatedExercise,
    ExerciseSolutionsFields {}

/* with teacher fields */

interface MultipleChoiceRadioExerciseWithTeacherFields
  extends MultipleChoiceRadioExerciseWithSolutions,
    ExerciseTeacherFields {}

interface MultipleChoiceCheckboxExerciseWithTeacherFields
  extends MultipleChoiceCheckboxExerciseWithSolutions,
    ExerciseTeacherFields {}

interface JSExerciseWithTeacherFields
  extends JSExerciseWithSolutions,
    ExerciseTeacherFields {}

interface CExerciseWithTeacherFields
  extends CExerciseWithSolutions,
    ExerciseTeacherFields {}

interface OpenAnswerExerciseWithTeacherFields
  extends OpenAnswerExerciseWithSolutions,
    ExerciseTeacherFields {}

interface AttachmentExerciseWithTeacherFields
  extends AttachmentExerciseWithSolutions,
    ExerciseTeacherFields {}

interface ClozeExerciseWithTeacherFields
  extends ClozeExerciseWithSolutions,
    ExerciseTeacherFields {}

interface AggregatedExerciseWithTeacherFields
  extends AggregatedExerciseWithSolutions,
    ExerciseTeacherFields {}

/* ----------------- */

const ExercisesTypesMap = constants("exercises", [
  "MultipleChoiceRadioExercise",
  "MultipleChoiceRadioExerciseWithSolutions",
  "MultipleChoiceRadioExerciseWithTeacherFields",
  "MultipleChoiceCheckboxExercise",
  "MultipleChoiceCheckboxExerciseWithSolutions",
  "MultipleChoiceCheckboxExerciseWithTeacherFields",
  "JSExercise",
  "JSExerciseWithSolutions",
  "JSExerciseWithTeacherFields",
  "CExercise",
  "CExerciseWithSolutions",
  "CExerciseWithTeacherFields",
  "OpenAnswerExercise",
  "OpenAnswerExerciseWithSolutions",
  "OpenAnswerExerciseWithTeacherFields",
  "AttachmentExercise",
  "AttachmentExerciseWithSolutions",
  "AttachmentExerciseWithTeacherFields",
  "ClozeExercise",
  "ClozeExerciseWithSolutions",
  "ClozeExerciseWithTeacherFields",
  "AggregatedExercise",
  "AggregatedExerciseWithSolutions",
  "AggregatedExerciseWithTeacherFields",
]).untagged;

type ExercisesTypesMap = typeof ExercisesTypesMap;

export type ExerciseTypesForADT = MapFromUntaggedConstants<
  ExercisesTypesMap,
  Record<
    ExercisesTypesMap["MultipleChoiceRadioExercise"],
    MultipleChoiceRadioExercise
  > &
    Record<
      ExercisesTypesMap["MultipleChoiceRadioExerciseWithSolutions"],
      MultipleChoiceRadioExerciseWithSolutions
    > &
    Record<
      ExercisesTypesMap["MultipleChoiceRadioExerciseWithTeacherFields"],
      MultipleChoiceRadioExerciseWithTeacherFields
    > &
    Record<
      ExercisesTypesMap["MultipleChoiceCheckboxExercise"],
      MultipleChoiceCheckboxExercise
    > &
    Record<
      ExercisesTypesMap["MultipleChoiceCheckboxExerciseWithSolutions"],
      MultipleChoiceCheckboxExerciseWithSolutions
    > &
    Record<
      ExercisesTypesMap["MultipleChoiceCheckboxExerciseWithTeacherFields"],
      MultipleChoiceCheckboxExerciseWithTeacherFields
    > &
    Record<ExercisesTypesMap["JSExercise"], JSExercise> &
    Record<
      ExercisesTypesMap["JSExerciseWithSolutions"],
      JSExerciseWithSolutions
    > &
    Record<
      ExercisesTypesMap["JSExerciseWithTeacherFields"],
      JSExerciseWithTeacherFields
    > &
    Record<ExercisesTypesMap["CExercise"], CExercise> &
    Record<
      ExercisesTypesMap["CExerciseWithSolutions"],
      CExerciseWithSolutions
    > &
    Record<
      ExercisesTypesMap["CExerciseWithTeacherFields"],
      CExerciseWithTeacherFields
    > &
    Record<ExercisesTypesMap["OpenAnswerExercise"], OpenAnswerExercise> &
    Record<
      ExercisesTypesMap["OpenAnswerExerciseWithSolutions"],
      OpenAnswerExerciseWithSolutions
    > &
    Record<
      ExercisesTypesMap["OpenAnswerExerciseWithTeacherFields"],
      OpenAnswerExerciseWithTeacherFields
    > &
    Record<ExercisesTypesMap["AttachmentExercise"], AttachmentExercise> &
    Record<
      ExercisesTypesMap["AttachmentExerciseWithSolutions"],
      AttachmentExerciseWithSolutions
    > &
    Record<
      ExercisesTypesMap["AttachmentExerciseWithTeacherFields"],
      AttachmentExerciseWithTeacherFields
    > &
    Record<ExercisesTypesMap["ClozeExercise"], ClozeExercise> &
    Record<
      ExercisesTypesMap["ClozeExerciseWithSolutions"],
      ClozeExerciseWithSolutions
    > &
    Record<
      ExercisesTypesMap["ClozeExerciseWithTeacherFields"],
      ClozeExerciseWithTeacherFields
    > &
    Record<ExercisesTypesMap["AggregatedExercise"], AggregatedExercise> &
    Record<
      ExercisesTypesMap["AggregatedExerciseWithSolutions"],
      AggregatedExerciseWithSolutions
    > &
    Record<
      ExercisesTypesMap["AggregatedExerciseWithTeacherFields"],
      AggregatedExerciseWithTeacherFields
    >
>;

export type Exercise = ADT<ExerciseTypesForADT>;

export type ExerciseWithSolutions = Extract<Exercise, ExerciseSolutionsFields>;
export type ExerciseWithSolutionsTypes = ExerciseWithSolutions["_type"];

export function isExerciseWithSolutions(
  exercise: Exercise
): exercise is ExerciseWithSolutions {
  return [
    ExercisesTypesMap.MultipleChoiceCheckboxExerciseWithSolutions,
    ExercisesTypesMap.MultipleChoiceRadioExerciseWithSolutions,
    ExercisesTypesMap.JSExerciseWithSolutions,
    ExercisesTypesMap.CExerciseWithSolutions,
    ExercisesTypesMap.AttachmentExerciseWithSolutions,
    ExercisesTypesMap.AggregatedExerciseWithSolutions,
    ExercisesTypesMap.ClozeExerciseWithSolutions,
    ExercisesTypesMap.OpenAnswerExerciseWithSolutions,
  ].includes(exercise._type);
}

type TeacherExercises = Extract<
  Exercise,
  {
    _type:
      | typeof ExercisesTypesMap.AggregatedExerciseWithTeacherFields
      | typeof ExercisesTypesMap.ClozeExerciseWithTeacherFields;
  }
>;

interface Orderable {
  _ordering?: number;
}

interface Lockable {
  locked_by?: unknown; // TODO User;
}

export interface IExerciseChoice {
  _ordering?: number;
  id: string;
  text: string;
  correctness?: number;
}

export type CodeExecutionResults = ADT<{
  running: {};
  internal_error: {};
  completed: {
    compilation_errors?: string;
    execution_error?: string;
    tests?: TestCaseExecutionResults[];
  };
}>;

export type TestCaseExecutionResults = ADT<{
  passed: { id: string };
  failed: { error?: string; stdout?: string; stderr?: string };
}>;

declare const t: TestCaseExecutionResults;

matchI(t)({
  failed: () => null,
  passed: () => null,
});

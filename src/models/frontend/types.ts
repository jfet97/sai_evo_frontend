import { ADT, matchI } from "ts-adt";
import { constants, InferUnion, MapFromUntaggedConstants } from "ts-consts";

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

// concept
// interface ProgrammingExercise extends BaseExerciseFields {
//   _type: "ProgrammingExercise"
//   language?: { tag: "JS", testcase:  } | { tag: "C", testcase:  } | 
// }

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

const enume = constants("ExerciseType", {
  MULTIPLE_CHOICE_SINGLE_POSSIBLE : 0,
  MULTIPLE_CHOICE_MULTIPLE_POSSIBLE : 1,
  OPEN_ANSWER: 2,
  COMPLETION: 3,
  AGGREGATED: 4,
  JS: 5,
  ATTACHMENT: 6,
  C: 7,
}).untagged

const ExerciseTypesMap = constants("exercises", [
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

type ExerciseTypesMap = typeof ExerciseTypesMap;
type ExerciseTypes = InferUnion<ExerciseTypesMap>


export type ExerciseTypesForADT = MapFromUntaggedConstants<
  ExerciseTypesMap,
  {
    [ExerciseTypesMap.MultipleChoiceRadioExercise]: MultipleChoiceRadioExercise
    [ExerciseTypesMap.MultipleChoiceRadioExerciseWithSolutions]: MultipleChoiceRadioExerciseWithSolutions
    [ExerciseTypesMap.MultipleChoiceRadioExerciseWithTeacherFields]: MultipleChoiceRadioExerciseWithTeacherFields
    [ExerciseTypesMap.MultipleChoiceCheckboxExercise]: MultipleChoiceCheckboxExercise
    [ExerciseTypesMap.MultipleChoiceCheckboxExerciseWithSolutions]: MultipleChoiceCheckboxExerciseWithSolutions
    [ExerciseTypesMap.MultipleChoiceCheckboxExerciseWithTeacherFields]: MultipleChoiceCheckboxExerciseWithTeacherFields
    [ExerciseTypesMap.JSExercise]: JSExercise
    [ExerciseTypesMap.JSExerciseWithSolutions]: JSExerciseWithSolutions
    [ExerciseTypesMap.JSExerciseWithTeacherFields]: JSExerciseWithTeacherFields
    [ExerciseTypesMap.CExercise]: CExercise
    [ExerciseTypesMap.CExerciseWithSolutions]: CExerciseWithSolutions
    [ExerciseTypesMap.CExerciseWithTeacherFields]: CExerciseWithTeacherFields
    [ExerciseTypesMap.OpenAnswerExercise]: OpenAnswerExercise
    [ExerciseTypesMap.OpenAnswerExerciseWithSolutions]: OpenAnswerExerciseWithSolutions
    [ExerciseTypesMap.OpenAnswerExerciseWithTeacherFields]: OpenAnswerExerciseWithTeacherFields
    [ExerciseTypesMap.AttachmentExercise]: AttachmentExercise
    [ExerciseTypesMap.AttachmentExerciseWithSolutions]: AttachmentExerciseWithSolutions
    [ExerciseTypesMap.AttachmentExerciseWithTeacherFields]: AttachmentExerciseWithTeacherFields
    [ExerciseTypesMap.ClozeExercise]: ClozeExercise
    [ExerciseTypesMap.ClozeExerciseWithSolutions]: ClozeExerciseWithSolutions
    [ExerciseTypesMap.ClozeExerciseWithTeacherFields]: ClozeExerciseWithTeacherFields
    [ExerciseTypesMap.AggregatedExercise]: AggregatedExercise
    [ExerciseTypesMap.AggregatedExerciseWithSolutions]: AggregatedExerciseWithSolutions
    [ExerciseTypesMap.AggregatedExerciseWithTeacherFields]: AggregatedExerciseWithTeacherFields
  }
>;

export type Exercise = ADT<ExerciseTypesForADT>;

export type ExerciseWithSolutions = Extract<Exercise, ExerciseSolutionsFields>;
export type ExerciseWithSolutionsTypes = ExerciseWithSolutions["_type"];

namespace Utils {

  type Cast<X, Y> = X extends Y ? X : Y

  // eslint-disable-next-line no-inner-declarations
  export function checkTupleHasUnionEls<U>() {
    return <N extends Narrowable, T extends readonly N[] | []>(tuple: TupleHasUnionEls<T, U>) => tuple
  }

  type Narrowable =
  | string
  | number
  | bigint
  | boolean
  | void
  | null
  | undefined


type TupleHasUnionEls<Tuple extends readonly any[], Union> = Tuple[number] extends Union ? [Union] extends [Tuple[number]] ? Tuple : "missing elements" : "extraneous elements"

}

export function isExerciseWithSolutions(
  exercise: Exercise
): exercise is ExerciseWithSolutions {

  const exerciseWithSolutionsTypes = Utils.checkTupleHasUnionEls<ExerciseWithSolutionsTypes>()([
    ExerciseTypesMap.MultipleChoiceRadioExerciseWithSolutions,
    ExerciseTypesMap.MultipleChoiceRadioExerciseWithTeacherFields,
    ExerciseTypesMap.MultipleChoiceCheckboxExerciseWithSolutions,
    ExerciseTypesMap.MultipleChoiceCheckboxExerciseWithTeacherFields,
    ExerciseTypesMap.JSExerciseWithSolutions,
    ExerciseTypesMap.JSExerciseWithTeacherFields,
    ExerciseTypesMap.CExerciseWithSolutions,
    ExerciseTypesMap.CExerciseWithTeacherFields,
    ExerciseTypesMap.OpenAnswerExerciseWithSolutions,
    ExerciseTypesMap.OpenAnswerExerciseWithTeacherFields,
    ExerciseTypesMap.AttachmentExerciseWithSolutions,
    ExerciseTypesMap.AttachmentExerciseWithTeacherFields,
    ExerciseTypesMap.ClozeExerciseWithSolutions,
    ExerciseTypesMap.ClozeExerciseWithTeacherFields,
    ExerciseTypesMap.AggregatedExerciseWithSolutions,
    ExerciseTypesMap.AggregatedExerciseWithTeacherFields,
  ])   

  return (exerciseWithSolutionsTypes as string[]).includes(exercise._type);
}

type TeacherExercises = Extract<
  Exercise,
  {
    _type:
      `${any}${"Teacher"}${any}`;
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

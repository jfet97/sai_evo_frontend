import {
	EventAccessRule,
	EventTimeLimitRule,
	ExerciseSolutionState,
	ExerciseTestCaseType,
	VoteType,
} from "./types";
import {
	EventState,
	EventType,
	ExerciseState,
	ExerciseType,
	EventTemplateRuleType,
	EventParticipationState,
	CoursePrivilege,
	ParticipationAssessmentProgress,
	AssessmentSlotState,
	AssessmentVisibility,
} from ".";

interface Orderable {
	_ordering?: number;
}

interface Lockable {
	locked_by?: User;
}

export interface User {
	id: string;
	email: string;
	full_name: string;
	first_name: string;
	last_name: string;
	is_teacher: boolean;
	course_privileges?: CoursePrivilege[];
	mat: string;
	course: string;
}

export interface Course {
	id: string;
	name: string;
	description?: string;
	privileges?: CoursePrivilege[];
	hidden?: boolean;
	creator?: User;

	// student fields
	participations?: EventParticipation[];
	unstarted_practice_events?: Event[];
	public_exercises_count?: number;
}

interface Vote {
	id: string;
	vote_type: VoteType;
	user?: User;
}

interface Post {
	id: string;
	content: string;
	user: User;
}

export interface ExerciseSolutionComment extends Post {}

export interface ExerciseSolutionVote extends Vote {}

export interface ExerciseSolution {
	id: string;
	user: User | null;
	content: string;
	state?: ExerciseSolutionState;
	score: number;
	//votes: ExerciseSolutionVote[];
	comments: ExerciseSolutionComment[];
	has_upvote?: boolean;
	has_downvote?: boolean;
	is_bookmarked: boolean;
}

export interface Exercise extends Orderable, Lockable {
	id: string;
	text: string;
	// solution?: string;
	solutions?: ExerciseSolution[];
	label?: string;
	child_weight?: number;
	exercise_type: ExerciseType | null; // TODO make non-nullable
	state?: ExerciseState;
	choices?: ExerciseChoice[];
	testcases?: ExerciseTestCase[];
	sub_exercises?: Exercise[];
	public_tags?: Tag[];
	private_tags?: Tag[];
	requires_typescript?: boolean;
}

export interface ExerciseChoice extends Orderable {
	id: string;
	text: string;
	correctness?: number;
}

// TODO make orderable
export interface ExerciseTestCase {
	id: string;
	code: string;
	text: string;
	stdin: string;
	expected_stdout: string;
	testcase_type: ExerciseTestCaseType;
}

export interface Tag {
	id?: string;
	name: string;
	public_exercises?: number;
	public_exercises_not_seen?: number;
}

export interface Event extends Lockable {
	id: string;
	name: string;
	instructions: string;
	creator?: string;
	begin_timestamp: string | null;
	end_timestamp: string | null;
	event_type: EventType;
	state: EventState;
	users_allowed_past_closure?: string[];
	template?: EventTemplate;
	exercises_shown_at_a_time: number | null;
	allow_going_back: boolean;
	participation_exists?: boolean;
	randomize_rule_order?: boolean;
	access_rule?: EventAccessRule;
	access_rule_exceptions?: string[];
	time_limit_rule?: EventTimeLimitRule;
	time_limit_seconds: number | null;
	time_limit_exceptions?: [string, number][];
	max_score?: number;
}

export interface EventTemplate {
	id?: string;
	name?: string;
	public?: boolean;
	creator?: string;
	rules: EventTemplateRule[];
}

export interface EventTemplateRuleSatisfying {
	count: number;
	example?: Exercise;
}

export interface EventTemplateRule extends Orderable {
	id: string;
	rule_type?: EventTemplateRuleType;
	exercises?: string[];
	clauses?: EventTemplateRuleClause[];
	amount: number;
	satisfying?: EventTemplateRuleSatisfying;
	weight: number;
}

export interface EventTemplateRuleClause {
	id: string;
	tags: Tag[];
}

export interface EventParticipation {
	id: string;
	event: Event; // TODO make optional
	user: User;
	state: EventParticipationState;
	slots: EventParticipationSlot[];
	score?: string;
	max_score?: number;
	last_slot_number?: number;
	begin_timestamp: string;
	end_timestamp?: string;
	current_slot_cursor?: number;
	bookmarked?: boolean;

	// student-only field to indicate whether the assessment has been published for this participation
	assessment_available?: boolean;

	// teacher-only fields
	assessment_progress?: ParticipationAssessmentProgress;
	visibility?: AssessmentVisibility;
	score_edited?: boolean;
}

export interface EventParticipationSlotSubmission {
	selected_choices: string[];
	answer_text: string; // TODO make optional
	execution_results?: CodeExecutionResults;
	attachment?:
		| {
				name: string;
				size: number;
				// TODO find a better way to retrieve the attachment
				// information needed to be able to make API call from
				// AttachmentExercise and download the attached file
				extras: {
					slot_id: string;
					participation_id: string;
				};
		  } // download representation
		| Blob; // upload representation
}

export interface EventParticipationSlotAssessment {
	score?: number | null;
	comment?: string;
	score_edited?: boolean;
	assessment_state?: AssessmentSlotState;
}

export interface EventParticipationSlot
	extends EventParticipationSlotSubmission,
		EventParticipationSlotAssessment {
	id: string;
	slot_number?: number;
	exercise: Exercise; // TODO make optional

	sub_slots: EventParticipationSlot[];

	seen_at?: string;
	answered_at?: string;
	is_first?: boolean;
	is_last?: boolean;
	weight?: number;
}

export interface CodeExecutionResults {
	state: "running" | "completed" | "internal_error";
	compilation_errors?: string;
	execution_error?: string;
	tests?: TestCaseExecutionResults[];
}

export interface TestCaseExecutionResults {
	id: string;
	passed: boolean;
	error?: string;
	stdout?: string;
	stderr?: string;
}

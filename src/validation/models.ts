import { helpers, required } from "@vuelidate/validators";
import {
	atLeastOneCorrectChoice,
	choicesRequiredIfMultipleChoiceExercise,
	courseNameUnique,
	idBasedRulePopulated,
	ruleTypeSet,
	tagBasedRulePopulated,
	tagBasedRuleSatisfied,
} from "./validators";

export const courseValidation = {
	name: {
		required,
		unique: courseNameUnique,
		$autoDirty: true,
	},
};

export const eventTemplateRuleValidation = {
	rule_type: {
		ruleTypeSet,
	},
	exercises: {
		idBasedRulePopulated,
	},
	clauses: {
		tagBasedRulePopulated,
	},
	satisfying: {
		tagBasedRuleSatisfied,
	},
};

export const eventTemplateValidation = {
	rules: {
		$each: helpers.forEach(eventTemplateRuleValidation),
		//$autoDirty: true,
		required,
	},
};

export const eventValidation = {
	name: {
		required,
		$autoDirty: true,
	},
	begin_timestamp: {
		required,
		$autoDirty: true,
	},
	end_timestamp: {
		required,
		$autoDirty: true,
	},
	template: {
		...eventTemplateValidation,
	},
};

export const exerciseChoiceValidation = {
	text: {
		required,
	},
};

export const baseExerciseValidation = {
	text: {
		required,
	},
	exercise_type: {
		required,
	},
	choices: {
		$each: helpers.forEach(exerciseChoiceValidation),
		choicesRequiredIfMultipleChoiceExercise,
		atLeastOneCorrectChoice,
	},
};

export const exerciseValidation = {
	...baseExerciseValidation,
	sub_exercises: {
		// $each: helpers.forEach(baseExerciseValidation as any),
	},
};

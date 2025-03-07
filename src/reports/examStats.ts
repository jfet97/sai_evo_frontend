import {
	EventParticipation,
	Exercise,
	EventParticipationSlot,
	ExerciseChoice,
	CodeExecutionResults,
	ExerciseTestCase,
} from "@/models";
import { getTranslatedString as _ } from "@/i18n";
import { DataFrequency } from ".";

// returns an array of pairs <s, f> where s is a score and f is the
// frequency with which that score appears among the given participations
export const getScoreFrequencyFromParticipations = (
	participations: EventParticipation[],
): DataFrequency<string>[] =>
	(
		participations
			.filter(p => typeof p.score !== "undefined" && p.score !== null)
			.map(p => p.score) as string[]
	)
		.reduce((a, s) => {
			const normalizedDatum = String(isNaN(parseFloat(s)) ? s : parseFloat(s));
			const record = a.find(r => r.datum == normalizedDatum);
			if (record) {
				record.frequency++;
			} else {
				a.push({ datum: normalizedDatum, frequency: 1 });
			}
			return a;
		}, [] as DataFrequency<string>[])
		// put numbers first, in ascending order; then non-numeric
		// values in ascending lexicographical order
		.sort((a, b) =>
			isNaN(parseFloat(a.datum))
				? isNaN(parseFloat(b.datum))
					? a.datum < b.datum
						? -1
						: 1
					: -1
				: isNaN(parseFloat(b.datum))
				? isNaN(parseFloat(a.datum))
					? a.datum < b.datum
						? -1
						: 1
					: -1
				: parseFloat(a.datum) < parseFloat(b.datum)
				? -1
				: 1,
		);

export const getTestCasePassingFrequencyFor = (
	exercise: Exercise,
	slots: EventParticipationSlot[],
): {
	scoreFrequency: DataFrequency<number>[];
	testCasePassingRate: Record<string, number>;
} => ({
	scoreFrequency: slots
		.flatMap(s => s.execution_results ?? ({ state: "completed" } as CodeExecutionResults))
		.reduce((a, e) => {
			const testCasesDetails = e.tests ?? [];
			const passedTestCases = testCasesDetails.filter(t => t.passed).length;
			const record = a.find(r => r.datum === passedTestCases);
			if (record) {
				record.frequency++;
			} else {
				a.push({ datum: passedTestCases, frequency: 1 });
			}
			return a;
		}, [] as DataFrequency<number>[])
		.sort((a, b) => (a.datum < b.datum ? -1 : 1)),
	testCasePassingRate: (exercise.testcases as ExerciseTestCase[]).reduce((d, t) => {
		// for each test case in the exercise, get slots
		// whose submission passed the test case
		d[t.id] = slots.filter(s => {
			const testCaseResults = (s.execution_results?.tests ?? []).find(
				rt => String(rt.id) === String(t.id),
			);
			return testCaseResults && testCaseResults.passed;
		}).length;
		return d;
	}, {} as Record<string, number>),
});

// returns an array of pairs <c, f> where c is an ExerciseChoice and
// f is the frequency with which it's been selected in the given slots
export const getChoiceSelectionFrequencyFor = (
	exercise: Exercise,
	slots: EventParticipationSlot[],
): DataFrequency<ExerciseChoice>[] =>
	slots
		.flatMap(s => s.selected_choices)
		.reduce((a, c) => {
			const choice = (exercise.choices ?? []).find(ch => ch.id == c) as ExerciseChoice;
			const record = a.find(r => r.datum.id == c);
			if (record) {
				record.frequency++;
			} else {
				a.push({ datum: choice, frequency: 1 });
			}
			return a;
		}, [] as DataFrequency<ExerciseChoice>[])
		.sort((a, b) => (String(a.datum.id) < String(b.datum.id) ? -1 : 1));

export const scoreChartOptions = {
	responsive: true,
	maintainAspectRatio: true,
	plugins: {
		legend: {
			display: false,
		},
	},
	scales: {
		x: {
			display: true,
			grid: { display: false },
			title: {
				display: true,
				text: _("event_participation_headings.grade"),
			},
		},
		y: {
			display: true,
			grid: { display: true },
			ticks: { stepSize: 2, beginAtZero: true },
		},
	},
};

export const passedTestCasesBarChartOptions = {
	...scoreChartOptions,
	scales: {
		...scoreChartOptions.scales,
		x: {
			...scoreChartOptions.scales.x,
			title: {
				display: true,
				text: _("misc.passed_tests"),
			},
		},
	},
};

export const exerciseChoicesBarChartOptions = {
	indexAxis: "y",
	responsive: true,
	maintainAspectRatio: true,
	plugins: {
		legend: {
			display: false,
		},
	},
	scales: {
		x: {
			display: true,
			grid: { display: false },
			ticks: { stepSize: 2, beginAtZero: true },
			title: {
				display: true,
				text: _("event_stats.selections"),
			},
		},
		y: {
			display: true,
			grid: { display: false },
			//ticks: { font: { size: 22 } },
		},
	},
};

export const scoreChartDatasetSettings = {
	backgroundColor: "#303f9fb3",
	maxBarThickness: 100,
};

export const exerciseChoiceDatasetSettings = {
	backgroundColor: "#10B981b3",
	maxBarThickness: 40,
};

// strips html off the given string as chart.js doesn't support html in labels,
// and breaks longer texts into multiple lines
export const makeLabelText = (text: string): string | string[] => {
	const processedText = text
		.replace(/(<([^>]+)>)/gi, "")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&amp;/g, "&");

	const MAX_LINE_LENGTH = 100;

	const LINE_LENGTH =
		processedText.length > MAX_LINE_LENGTH || processedText.length < MAX_LINE_LENGTH / 1.5
			? MAX_LINE_LENGTH
			: Math.ceil(processedText.length / 2);

	if (processedText.length < LINE_LENGTH) {
		return processedText;
	}
	// try to break at a point that makes the lines balanced in length
	// and break when encountering a space to avoid warping mid-word
	const breakPivot =
		processedText.length > MAX_LINE_LENGTH * 2
			? LINE_LENGTH
			: Math.floor(processedText.length / 2);
	const breakFirstLineAt = findNearestSpace(processedText, breakPivot);

	const remaining = processedText.slice(breakFirstLineAt);

	if (remaining.length <= LINE_LENGTH) {
		// two lines are enough, no need to break text into a third line
		return [processedText.slice(0, breakFirstLineAt), remaining];
	}

	const breakSecondLineAt = findNearestSpace(remaining, LINE_LENGTH);

	return [
		processedText.slice(0, breakFirstLineAt),
		remaining.slice(0, breakSecondLineAt),
		remaining.slice(breakSecondLineAt, LINE_LENGTH + breakSecondLineAt) +
			(remaining.slice(breakSecondLineAt).length > LINE_LENGTH ? "..." : ""),
	];
};

const findNearestSpace = (text: string, index: number): number => {
	let i = 0;
	while (i < text.length) {
		if (text.charAt(index - i) === " ") {
			return index - i;
		}
		if (text.charAt(index + i) === " ") {
			return index + i;
		}
		i++;
	}
	return -1;
};

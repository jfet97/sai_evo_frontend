import { ExerciseState, ExerciseType, EventState } from "@/models";

export const en = {
	dialog: {
		default_ok_text: "OK",
		default_cancel_text: "Cancel",
	},
	practice_template_editor: {
		begin_practice: "Start practice",
		add_rule: "Aggiungi esercizi",
		choose_exercises_text:
			"Select the tags you're interested in in order to create your practice session.",
		rule_amount_1: "How many exercises with tag",
		rule_amount_2: "do you want to see?",
	},
	programming_exercise: {
		open_text_popup: "Open as popup",
		tab_text: "Text",
		tab_testcases: "Test cases",
		tab_editor: "Editor",
		run_code: "Run",
		running_code: "Running your code...",
		execution_results: "Execution results",
		testcase: "Test case",
		testcase_stdin: "Standard input",
		testcase_expected_stdout: "Expected output",
		passed: "Passed",
		not_passed: "Failed",
		test_failed_with_error: "Execution aborted with the following error",
		test_failed_stdout: "Your program produced the following output",
		code_errored: "Execution aborted with the following error",
		compilation_errored: "Compilation failed producing the following error",
		no_testcases:
			"This exercise doesn't have any test cases. Try asking your teacher to add some.",
		results_ok_but_no_testcases:
			"Your code ran without producing errors. Unfortunately, this exercise doesn't have any test cases, so that's all we know.",
		internal_error:
			"An internal error occurred while attempting to run your code. Please, report this error to the teachers.",
		code_execution_will_appear_here:
			"The execution results for your code will appear here.",
	},
	event_states: {
		[EventState.DRAFT]: "Draft",
		[EventState.PLANNED]: "Planned",
		[EventState.OPEN]: "In progress",
		[EventState.CLOSED]: "Closed",
		[EventState.RESTRICTED]: "Restricted access",
	},
	event_states_descriptions: {
		[EventState.PLANNED]:
			"It's all set! The exam preview is visible to students, but they won't be able to access it until its begin timestamp.",
		[EventState.DRAFT]: "Exam won't be visible to students until you publish it.",
		[EventState.OPEN]: "",
		[EventState.CLOSED]: "",
	},
	event_editor: {
		name: "Nome",
		state_editor_title: "Publish",
		state: "Stato esame",
		current_state_is: "Exam is currently in state: ",
		state_is: "L'esame è",
		begin_timestamp: "Beings at",
		end_timestamp: "Ends at",
		instructions: "Istruzioni (opzionale)",
		editor_title: "Exam editor",
		flow_rules: "Regole di svolgimento",
		exercises_shown_at_a_time_label: "Numero di esercizi da mostrare per pagina",
		allow_going_back_label:
			"Permetti agli studenti di tornare indietro a un esercizio già visto",
		show_all_exercises_at_once: "Mostra tutti gli esercizi insieme",
		show_one_exercise_at_once: "Mostra solo un esercizio alla volta",
		publish: "Publish",
		revert_to_draft: "Torna a stato di bozza",
		event_planned_help_text: "L'esame verrà aperto agli studenti automaticamente in data",
		editing_open_event_title: "Modifica di un esame in corso",
		editing_open_event_body:
			"Stai modificando un esame già iniziato. Sei sicuro di volerlo modificare?",
		correct_errors_to_publish:
			"Prima di poter pubblicare l'esame, correggi i seguenti errori:",
		cannot_change_timestamp:
			"Non puoi modificare la data e ora di inizio dell'esame una volta pianificato. Per modificare questo campo, metti l'esame in stato di bozza.",
		this_is_the_link_to_the_event:
			"Ecco il link per accedere all'esame. Comunicalo agli studenti che parteciperanno.",
		edit_template_in_progress_warning:
			"Modificare il modello dell'esame quando questo è già iniziato può avere conseguenze imprevedibili. Gli studenti che hanno già iniziato l'esame non saranno interessati dalle modifiche. Procedi solo se sai cosa stai facendo.",
		currently_locked_by: "È in corso una modifica a questo esame da parte di",
		lock_stand_by: "L'editor verrà sbloccato non appena la modifica sarà conclusa.",
		tip_you_used_randomization:
			"Hai utilizzato alcune delle funzionalità di randomizzazione. Verifica che gli esami generati siano corretti.",
		generate_examples: "Genera esempi",
		generating_examples: "Generazione esempi...",
	},
	student_course_dashboard: {
		your_practice_events: "Le tue esercitazioni",
		new_practice_event: "Nuova esercitazione",
		exams_you_participated_in: "Esami a cui hai partecipato",
		review_submission: "Rivedi risposte",
		view_assessment: "Valutazione",
		resume: "Riprendi",
		assessment_available: "Sono stati pubblicati i voti relativi a questo esame",
		new_practice: "New practice session",
		resume_practice: "Resume practice",
		draft_practice: "Bozza esercitazione",
		pending: "In corso",
		practice_summary: "Riepilogo",
		no_public_exercises:
			"Non puoi iniziare un'esercitazione perché i docenti del corso non hanno ancora aggiunto esercizi",
	},
	exercise_preview: {
		unnamed_exercise: "Unnamed exercise",
	},
	exercise_editor: {
		exercise_tags: "Tags",
		exercise_editor_title: "Exercise editor",
		draft_notice: "Draft",
		choices_title: "Choices",
		exercise_label: "Exercise label",
		exercise_text: "Text",
		exercise_solution: "Solution (optional)",
		select_exercise_type: "Select type",
		exercise_type: "Type",
		exercise_state: "Visibility",
		exercise_public_tags: "Public tags",
		exercise_private_tags: "Private tags",
		choice_text: "Text",
		choice_score: "Score",
		choice_correctness: "Score",
		edit_non_draft_title: "Modifica di un esercizio non bozza",
		edit_non_draft_body:
			"Stai per modificare un esercizio non in stato di bozza. Potrebbe essere già presente in un esame o essere già stato visto dagli studenti. Sei sicuro di volerlo modificare?",
		new_choice: "New choice",
		new_testcase: "New test case",
		cannot_publish: "Non puoi ancora pubblicare questo esercizio",
		cannot_publish_body:
			"Per poter rimuovere lo stato di bozza, correggi i seguenti errori:",
		make_public_confirmation_title:
			"Sei sicuro di voler rendere questo esercizio pubblico?",
		make_public_confirmation_body:
			"Se rendi questo esercizio pubblico, tutti gli studenti potranno visualizzarlo in qualsiasi momento. Se vuoi utilizzare questo esercizio in un esame, rendilo privato.",
	},
	filter_results: {
		title: "Search exercises",
		more_filters: "More filters",
	},
	exercise_types: {
		[ExerciseType.MULTIPLE_CHOICE_SINGLE_POSSIBLE]: "Multiple choices, only one correct",
		[ExerciseType.MULTIPLE_CHOICE_MULTIPLE_POSSIBLE]:
			"Multiple choices, more than one correct",
		[ExerciseType.OPEN_ANSWER]: "Open answer",
		[ExerciseType.JS]: "JavaScript Exercise",
		[ExerciseType.COMPLETION]: "Cloze exercise",
		[ExerciseType.ATTACHMENT]: "Attachment answer",
		[ExerciseType.AGGREGATED]: "Composite exercise",
		[ExerciseType.C]: "C Exercise",
	},
	exercise_states: {
		[ExerciseState.PUBLIC]: "Public",
		[ExerciseState.PRIVATE]: "Exams only",
		[ExerciseState.DRAFT]: "Draft",
	},
	misc: {
		having_troubles_with_editor: "Having problems with the editor?",
		tags: "Tags",
		example: "Example",
		score: "Score",
		out_of: "out of",
		at: "at",
		edit: "Edit",
		select: "Select",
		preview: "Preview",
	},
	help_texts: {
		student_practice_rule_amount: "Quanti esercizi con questo tag vuoi vedere?",
		exercise_editor: {
			score_if_checked:
				"100% means correct answer. You can use negative values to apply a penalty",
			score_if_unchecked: "Punteggio se la risposta non viene selezionata",
			solution:
				"Se pubblichi questo esercizio, quando viene incluso in un'esercitazione creata da uno studente, la soluzione verrà mostrata al termine della stessa.",
			public_tags:
				"Se pubblichi questo esercizio, i tag pubblici potranno essere utilizzati dagli studenti per cercarlo quando compongono un'esercitazione",
			private_tags:
				"Questi tag non verranno mai mostrati agli studenti e possono essere utilizzati per organizzare gli esercizi e aggiungerli agli esami",
		},
		copy_exam_link: "Copy link",
		stats: "Statistiche esame",
		edit_score: "Modifica punteggio",
		edit_overall_grade: "Modifica voto",
		hidden_course: "Corso nascosto agli studenti",
	},
	event_preview: {
		unnamed_event: "Unnamed exam",
		monitor: "Monitora",
		results: "Risultati",
		editor: "Editor",
		close: "Close",
		still_open_for_some: "L'esame è ancora aperto per alcuni studenti.",
		copy_link: "Copia link per gli studenti",
		copied_link: "Copiato link per gli studenti",
	},
	cloud: {
		changes_saved_to_server: "All changes saved to server",
		saving: "Saving...",
		saved: "All changed saved!",
		error: "An error occurred while saving your changes",
	},
	event_template_editor: {
		add_more_rules: "Aggiungi più slot",
		editor_title: "Exam template",
		introduction_text:
			"Create the template for this exam. For each slot, you can decide whether to show the same exercise to all students or to use randomization criteria.",
		add_rule: "Add slot",
		confirm_delete_rule: "Sei sicuro di voler eliminare questo slot?",
		randomize_rule_order: "Randomize order of slots",
		rule_order_randomization_off:
			"Gli slot verranno assegnati agli studenti nell'ordine in cui sono disposti qui",
		rule_order_randomization_on:
			"Gli slot verranno assegnati agli studenti in ordine casuale",
	},
	event_template_rule_editor: {
		reset_slot_settings: "Reset slot",
		exercise_number: "Slot",
		choose_exercise: "Choose exercise",
		populate_slot_plural_title: "Select exercise(s) for slots",
		populate_slot_singular_title: "Select exercise(s) for slot",
		mode_selection_text: "Come vuoi scegliere l'esercizio per questo slot?",
		pick_single_exercise: "Seleziona un esercizio",
		pick_exercise_from_pool: "Pick exercise from a pool",
		pick_exercise_tag_based: "Seleziona esercizio in base ai tag",
		pick_single_exercise_help_text: "Tutti gli studenti vedranno lo stesso esercizio",
		pick_exercise_from_pool_help_text:
			"Each student will be shown an exercise randomly picked from the pool you define",
		pick_exercise_tag_based_help_text:
			"Ogni studente vedrà un esercizio scelto a caso con i tag selezionati",
		one_exercise_from_set_description:
			"Each student will be shown a randomly picked exercise among these:",
		tag_based_description: "Ogni studente vedrà un esercizio a caso che tra i tag ha:",
		same_exercise_for_everyone_description:
			"Tutti gli studenti vedranno questo esercizio:",
		tag_based_introduction:
			"Each student will see one exercise chosen randomly among those that meet the conditions defined here. An exercise is eligible if, for each group of tags defined, it contains at least one tag from that group.",
		tag_based_select_exercises: "Exercises will be eligible only if they have",
		tag_based_at_least_one: "at least one",
		tag_based_among: "among the following tags:",
		tag_based_and: "... and",
		tag_based_add_condition: "Aggiungi condizione",
		eligible_exercises: "Eligible exercises:",
	},
	event_participation_page: {
		exercise: "Exercise",
		of: "of",
		next_exercise: "Avanti",
		previous_exercise: "Indietro",
		skip_exercise: "Salta esercizio",
		turn_in: "Turn in",
		turn_in_dialog_title: "Sei sicuro di voler consegnare?",
		turn_in_dialog_text:
			"Una volta consegnato, non potrai più modificare le tue risposte.",
		turn_in_confirm_button: "Consegna",
		turned_in_text:
			"Fatto! Hai consegnato con successo. Qui sotto puoi rivedere le tue risposte. Quando vuoi, puoi chiudere questa pagina.",
		review_answers: "Revisione risposte",
		next_dialog_title: "Sei sicuro di voler passare al prossimo esercizio?",
		next_dialog_text:
			"Se vai avanti, non potrai più tornare indietro a questo esercizio.",
		next_dialog_confirm_button: "Vai avanti",
		participate: "Partecipa",
		exam_not_yet_begun: "L'esame non è ancora iniziato.",
		exam_is_over: "L'esame è terminato.",
		begin_timestamp: "Began on",
		turn_in_timestamp: "Turned in on",
	},
	event_assessment: {
		overall_score: "Grade",
		you_overrode_score:
			"You assigned a grade manually." +
			" If you edit the score of an exercise now, the overall grade won't be updated.",
		// " Se vuoi che il voto si aggiorni automaticamente in base ai punteggi degli esercizi, ripristina il voto di default.",
		all_participations_assesses:
			"Tutti gli esami sono stati corretti. Puoi pubblicare i risultati.",
		some_exams_require_manual_assessment:
			"Alcuni esercizi richiedono una correzione manuale. Prima di poter pubblicare i risultati, devi assegnare un punteggio agli esercizi che ancora non lo hanno.",
		exams_awaiting_assessment_are_marked:
			"Per assegnare un punteggio alle risposte non ancora valutate, clicca sull'icona",
		ready_to_publish_1:
			"I risultati sono pronti per essere pubblicati. Seleziona le righe che vuoi pubblicare e clicca su",
		ready_to_publish_2:
			"Le righe evidenziate in verde corrispondono a risultati già pubblicati.",
		all_published:
			"Tutti i risultati sono stati pubblicati e sono ora visibili agli studenti.",
		publish_results: "Pubblica i risultati",
		this_comment_is_private:
			"Questo commento verrà visualizzato dagli insegnanti ma non dallo studente",
		comment_for_student: "Feedback",
		student_will_see_this_comment:
			"Questo commento sarà visibile allo studente quando pubblicherai i risultati",
		this_exercise_requires_manual_assessment: "You have to assign a score manually.",
		some_sub_slots_pending:
			"Il punteggio mostrato è incompleto perché alcuni sotto-esercizi non hanno ancora ricevuto una valutazione.",
		some_slots_pending:
			"The grade shown is incomplete because you haven't yet assigned a score to some exercises.",
		default_score:
			"The grade shown is computed as the sum of the scores of each individual exercise." +
			" If you edit the score for an exercise, the overall grade will be updated automatically." +
			" You can override this grade by setting a value manually.",
		assessment_state: "Stato della correzione",
		confirm_assessment: "Save assessment",
		exercise: "esercizio",
		assess: "Valuta",
		assigned_score: "Score",
		your_assessment: "Assessment",
		text_answer_label: "Risposta dello studente",
		exercise_seen_at: "Visto:",
		exercise_answered_at: "Answered at:",
		viewing_participation_of: "You are viewing the participation to the exam of",
		viewing_practice_of: "Stai visualizzando un'esercitazione di",
		sub_slot_assessment_unavailable_open_full_1: "Apri la",
		sub_slot_assessment_unavailable_open_full_2: "partecipazione completa",
		sub_slot_assessment_unavailable_open_full_3:
			"all'esame per assegnare un punteggio a questo sotto-esercizio.",
		undo_overall_score_edit: "Vuoi ripristinare il voto originale?",
		undo_score_edit: "Vuoi ripristinare il punteggio originale per questo esercizio?",
		overall_score_instructions:
			"You can assign a grade manually to this student. The grade can be" +
			" a number or a string.",
	},
};

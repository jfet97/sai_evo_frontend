<template>
	<div>
		<div class="flex w-full mb-8">
			<Btn
				v-if="firstLoading || hasPrivileges([CoursePrivilege.MANAGE_EVENTS])"
				@click="onAddExam()"
				:loading="localLoading"
				class="ml-auto"
				:disabled="firstLoading"
				><span class="mr-1 text-base material-icons-outlined"> add </span>
				{{ $t("course_events.new_exam") }}</Btn
			>
		</div>
		<div v-if="!firstLoading" class="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2">
			<EventEditorPreview
				v-for="(exam, index) in exams"
				:key="exam + '-' + index"
				:event="exam"
				@close="onClose(exam)"
				@reopen="onReopen(exam)"
			></EventEditorPreview>
		</div>
		<div class="grid grid-cols-1 gap-4 mt-4 lg:grid-cols-2" v-else>
			<EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
			<EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
			<EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
			<EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
			<EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
			<EventEditorPreviewSkeleton></EventEditorPreviewSkeleton>
		</div>
		<div
			class="flex flex-col w-full text-center select-none mt-9"
			v-if="!firstLoading && exams.length === 0"
		>
			<p style="font-size: 10rem" class="material-icons-outlined opacity-10">
				assignment
			</p>
			<h2 class="opacity-40">{{ $t("course_events.no_exams") }}</h2>
		</div>
		<Dialog
			:warning="true"
			:showDialog="showCloseDialog"
			@no="showCloseDialog = false"
			@yes="closeExam()"
			:yesText="$t('course_events.close_for_everyone')"
			:noText="$t('dialog.default_cancel_text')"
		>
			<template v-slot:title>
				{{ $t("course_events.close_exam_for_everyone_title") }}
			</template>
			<template v-slot:body>
				<p>
					{{ $t("course_events.close_exam_for_everyone_body_1") }}
					<strong>{{ closingExam.name }}</strong>
					{{ $t("course_events.close_exam_for_everyone_body_2") }}
					{{ $t("course_events.close_exam_for_everyone_body_3") }}
					{{ $t("event_preview.monitor") }}.
				</p>
			</template>
		</Dialog>
		<Dialog
			:showDialog="showReopenDialog"
			@no="showReopenDialog = false"
			@yes="reopenExam()"
			:yesText="$t('course_events.reopen')"
			:noText="$t('dialog.default_cancel_text')"
		>
			<template v-slot:title>
				{{ $t("course_events.reopen_exam_title") }}
			</template>
			<template v-slot:body>
				<p>
					{{ $t("course_events.reopen_exam_body") }}
					<strong>{{ reopeningExam.name }}</strong
					>?
				</p>
			</template>
		</Dialog>
	</div>
</template>

<script lang="ts">
import EventEditorPreview from "@/components/teacher/EventEditor/EventEditorPreview.vue";
import { Event, EventState, CoursePrivilege, getBlankExam, EventType } from "@/models";
import Btn from "@/components/ui/Btn.vue";

import { defineComponent } from "@vue/runtime-core";
import { courseIdMixin, coursePrivilegeMixin, loadingMixin } from "@/mixins";
import Dialog from "@/components/ui/Dialog.vue";

import { createNamespacedHelpers } from "vuex";
import EventEditorPreviewSkeleton from "@/components/ui/skeletons/EventEditorPreviewSkeleton.vue";
import { EventSearchFilter } from "@/api/interfaces";
const { mapActions, mapGetters } = createNamespacedHelpers("teacher");

export default defineComponent({
	components: {
		EventEditorPreview,
		Btn,
		Dialog,
		EventEditorPreviewSkeleton,
	},
	name: "CourseExams",
	mixins: [courseIdMixin, loadingMixin, coursePrivilegeMixin],
	async created() {
		await this.withFirstLoading(
			async () =>
				await this.getEvents({
					courseId: this.courseId,
					filters: {
						event_type: EventType.EXAM,
					} as EventSearchFilter,
				}),
		);
	},

	data() {
		return {
			CoursePrivilege,
			buttonLoading: false,
			showCloseDialog: false,
			showReopenDialog: false,
			reopeningExam: null as Event | null,
			closingExam: null as Event | null,
		};
	},
	methods: {
		...mapActions(["partialUpdateEvent", "createEvent", "getEvents"]),
		onClose(event: Event) {
			this.showCloseDialog = true;
			this.closingExam = event;
		},
		onReopen(event: Event) {
			this.showReopenDialog = true;
			this.reopeningExam = event;
		},
		async closeExam() {
			await this.withLoading(
				async () =>
					await this.partialUpdateEvent({
						courseId: this.courseId,
						eventId: this.closingExam?.id,
						mutate: true,
						changes: {
							state: EventState.CLOSED,
							users_allowed_past_closure: [],
						},
					}),
				this.setErrorNotification,
				() => this.$store.commit("shared/showSuccessFeedback"),
			);
			this.closingExam = null;
			this.showCloseDialog = false;
		},
		async reopenExam() {
			await this.withLoading(
				async () =>
					await this.partialUpdateEvent({
						courseId: this.courseId,
						eventId: this.reopeningExam?.id,
						mutate: true,
						changes: {
							state: EventState.OPEN,
							users_allowed_past_closure: [],
						},
					}),
				this.setErrorNotification,
				() => this.$store.commit("shared/showSuccessFeedback"),
			);
			this.reopeningExam = null;
			this.showReopenDialog = false;
		},
		async onAddExam() {
			await this.withLocalLoading(async () => {
				const newExam = await this.createEvent({
					courseId: this.courseId,
					event: getBlankExam(),
				});
				// redirect to exam editor for newly created exam
				this.$router.push({
					name: "ExamEditor",
					params: { examId: newExam.id },
				});
			});
		},
	},
	computed: {
		...mapGetters(["exams"]),
	},
});
</script>

<style></style>

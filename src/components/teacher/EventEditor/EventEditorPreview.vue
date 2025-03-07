<template>
	<Card :marginLess="true" :filled="isDraft">
		<template v-slot:header>
			<div class="flex items-start w-full">
				<h4
					class="mt-1.25px mr-4"
					:class="{ 'text-muted': event.name.length === 0 }"
					style="
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						overflow: hidden;
					"
				>
					{{ previewTitle }}
				</h4>
				<div class="">
					<div
						class="mr-0 chip"
						:class="{
							'chip-primary':
								event.state === EventState.OPEN || event.state === EventState.RESTRICTED,
							'chip-light': event.state === EventState.CLOSED,
							'chip-success': event.state === EventState.PLANNED,
						}"
					>
						<div class="flex items-center">
							<MultiIcon
								:useTwoTone="event.state === EventState.PLANNED"
								:class="{
									'': event.state === EventState.PLANNED,
								}"
								class="w-6 mr-1 -mt-0.5"
								:icons="eventStateIcons"
							></MultiIcon>
							<p v-html="$t('event_states.' + event.state)"></p>
						</div>
					</div>
				</div>
			</div>
		</template>
		<template v-slot:body
			><div class="flex flex-col h-full">
				<div class="mt-1 space-y-1 text-sm mb-7">
					<div class="flex space-x-1" v-if="event.begin_timestamp">
						<p class="text-muted">{{ $t("event_editor.begin_timestamp") }}:</p>
						<Timestamp
							:reduced="buttonIconsOnly"
							:value="event.begin_timestamp"
						></Timestamp>
					</div>
					<div class="flex space-x-1" v-if="event.end_timestamp">
						<p class="text-muted">{{ $t("event_editor.end_timestamp") }}:</p>
						<Timestamp
							:reduced="buttonIconsOnly"
							:value="event.end_timestamp"
						></Timestamp>
					</div>
				</div>
				<div class="flex items-center mt-auto">
					<Btn
						class=""
						:size="'sm'"
						:variant="'danger'"
						:outline="true"
						v-if="
							allowClose && hasBegun && hasPrivileges([CoursePrivilege.MANAGE_EVENTS])
						"
						@click="$emit('close')"
						><span class="text-base material-icons-outlined"> block </span>
						<span class="ml-1" v-if="true || !buttonIconsOnly">{{
							$t("event_preview.close")
						}}</span></Btn
					>
					<Btn
						class=""
						:size="'sm'"
						:outline="true"
						v-if="
							canReopen && allowClose && hasPrivileges([CoursePrivilege.MANAGE_EVENTS])
						"
						@click="$emit('reopen')"
						><span class="text-base material-icons-outlined"> undo </span>
						<span class="ml-1" v-if="true || !buttonIconsOnly">{{
							$t("event_preview.reopen")
						}}</span></Btn
					>
					<div class="flex items-center ml-auto">
						<router-link
							class="m-auto"
							:to="{ name: 'ExamEditor', params: { examId: event.id } }"
						>
							<Btn
								:tooltip="buttonIconsOnly ? $t('misc.edit') : ''"
								:outline="buttonIconsOnly"
								:class="{ 'icon-btn-primary -ml-2': buttonIconsOnly }"
								:variant="buttonIconsOnly ? 'icon' : 'secondary'"
								v-if="hasPrivileges([CoursePrivilege.MANAGE_EVENTS])"
							>
								<span
									:class="[buttonIconsOnly ? 'text-xl' : 'text-base', 'material-icons']"
								>
									edit
								</span>
								<span class="ml-1.5" v-if="!buttonIconsOnly">{{
									$t("event_preview.editor")
								}}</span></Btn
							></router-link
						>
						<router-link
							v-if="hasBegun"
							:to="{ name: 'ExamProgress', params: { examId: event.id } }"
							><Btn
								:variant="buttonIconsOnly ? 'icon' : 'primary'"
								:outline="true"
								:tooltip="buttonIconsOnly ? $t('event_preview.monitor') : ''"
								v-if="hasPrivileges([CoursePrivilege.MANAGE_EVENTS])"
								><span
									:class="[
										buttonIconsOnly
											? 'text-xl material-icons'
											: 'text-base material-icons-outlined',
									]"
								>
									visibility
								</span>
								<span class="ml-1.5 hidden md:inline" v-if="!buttonIconsOnly">{{
									$t("event_preview.monitor")
								}}</span></Btn
							></router-link
						>
						<router-link
							:to="{ name: 'ExamResults', params: { examId: event.id } }"
							v-else-if="
								hasEnded && hasPrivileges([CoursePrivilege.ASSESS_PARTICIPATIONS])
							"
							><Btn
								:tooltip="buttonIconsOnly ? $t('event_preview.results') : ''"
								:outline="true"
								:variant="buttonIconsOnly ? 'icon' : 'primary'"
								><span style="font-size: 28px !important" class="material-icons-outlined">
									bar_chart
								</span>
								<span class="ml-1.5" v-if="!buttonIconsOnly">{{
									$t("event_preview.results")
								}}</span></Btn
							></router-link
						>
						<CopyToClipboard
							class=""
							v-if="!isDraft && !hasEnded"
							:value="permalink"
							:iconOnly="true"
							:title="$t('event_preview.copy_link')"
							:confirmationMessage="$t('event_preview.copied_link')"
							:tooltip="$t('help_texts.copy_exam_link')"
						></CopyToClipboard
						><!--:tooltip="$t('help_texts.copy_exam_link')"-->
					</div>
				</div>
			</div>
		</template>
	</Card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { PropType } from "vue";
import { Event, EventState, CoursePrivilege } from "@/models";
import Card from "@/components/ui/Card.vue";
import Timestamp from "@/components/ui/Timestamp.vue";
import { getTranslatedString as _ } from "@/i18n";
import { icons as eventStatesIcons } from "@/assets/eventStateIcons";
import MultiIcon from "@/components/ui/MultiIcon.vue";
import Btn from "@/components/ui/Btn.vue";
import { coursePrivilegeMixin } from "@/mixins";
import CopyToClipboard from "@/components/ui/CopyToClipboard.vue";

export default defineComponent({
	components: {
		Card,
		Timestamp,
		MultiIcon,
		Btn,
		CopyToClipboard,
	},
	name: "EventEditorPreview",
	mixins: [coursePrivilegeMixin],
	props: {
		event: {
			type: Object as PropType<Event>,
			required: true,
		},
		buttonIconsOnly: {
			type: Boolean,
			default: true,
		},
		allowClose: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			CoursePrivilege,
			EventState,
		};
	},
	computed: {
		previewTitle(): string {
			return (this.event?.name ?? "").trim().length > 0
				? (this.event.name as string)
				: _("event_preview.unnamed_event");
		},
		isDraft(): boolean {
			return this.event.state === EventState.DRAFT;
		},
		eventStateIcons() {
			return eventStatesIcons[this.event.state as EventState];
		},
		hasBegun() {
			return (
				this.event.state === EventState.OPEN || this.event.state === EventState.RESTRICTED
			);
		},
		canReopen() {
			return (
				this.hasEnded &&
				Math.abs(
					new Date().getTime() - new Date(this.event.begin_timestamp ?? "").getTime(),
				) /
					3600000 <
					24
			);
		},
		hasEnded() {
			return this.event.state === EventState.CLOSED;
		},
		halfClosed() {
			return this.event.state === EventState.RESTRICTED;
		},
		permalink(): string {
			return (
				window.location.origin +
				this.$router.resolve({
					name: "ExamParticipationPreview",
					params: { examId: this.event.id },
				}).fullPath
			);
		},
	},
});
</script>

<style></style>

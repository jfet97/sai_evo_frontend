<template>
	<div>
		<div class="mb-4 banner banner-light">
			<span class="material-icons-two-tone two-tone-primary">science</span>
			<div>
				<p>{{ $t("misc.experimental_feature_warning") }}</p>
			</div>
		</div>
		<div v-show="currentStep === 'initial'">
			<h3 class="mb-4">{{ $t("exercise_import.select_format") }}</h3>
			<div class="flex space-x-4">
				<div
					tabindex="0"
					@keydown.enter="onSelect(format.value)"
					@click="onSelect(format.value)"
					v-for="format in dataFormatsAsSelectableOptions"
					:class="{
						'outline-success  hover:bg-opacity-20 outline-4 border-transparent bg-success-light bg-opacity-10':
							selectedFormat === format.value,
						'hover:bg-light': selectedFormat !== format.value,
					}"
					:key="'format-' + format.value"
					v-wave
					class="transition-colors duration-100 cursor-pointer card card-border"
				>
					<div class="flex">
						<img
							class="mx-auto pointer-events-none select-none w-18"
							:src="format.description"
						/>
					</div>
					<div class="flex mt-4">
						<p class="mx-auto select-none">{{ format.content }}</p>
					</div>
				</div>
			</div>

			<div class="mt-8 mb-2" :class="{ invisible: selectedFormat === null }">
				<h3 class="mb-4">{{ $t("exercise_import.choose_file") }}</h3>
				<div>
					<input type="file" @change="onFileInputChange" />
				</div>
			</div>
		</div>
		<div v-show="currentStep === 'file_chosen'">
			<div class="flex flex-col w-full mt-10 space-y-6">
				<div class="relative flex self-start w-full space-x-4">
					<p class="text-lg">
						<strong>{{ exercises.length }}</strong>
						{{ $t("exercise_import.detected_exercises") }}
					</p>
					<Dropdown
						v-if="exercises.length > 0"
						class="self-start w-1/4 mb-auto -mt-3"
						id="imported-exercises-state-dropdown"
						:options="exerciseStateOptions"
						v-model="importedExercisesStateProxy"
						>{{ $t("exercise_import.imported_exercises_state") }}</Dropdown
					>
				</div>

				<div v-if="extras.tags?.length > 0">
					<h4 class="">
						<span
							style="margin-top: -2px; font-size: 18px; vertical-align: middle"
							class="mr-1 material-icons text-primary"
						>
							auto_awesome
						</span>
						{{ $t("exercise_import.extras_detected_tags") }}
					</h4>
					<p class="mb-2 text-muted">
						{{ $t("exercise_import.extras_detected_tags_description") }}
						<ArticleHandle :articleId="'what_are_tags_for'"></ArticleHandle>.
					</p>
					<Chipset
						v-if="exercises.length > 0"
						class="-ml-2"
						:options="tagsAsOptions"
						v-model="selectedTagsProxy"
					></Chipset>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div
						v-for="(exercise, index) in exercises"
						:key="'imported-exercise-' + index"
						class=""
					>
						<MinimalExercisePreview
							:selectable="false"
							:exercise="exercise"
						></MinimalExercisePreview>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { getTranslatedString } from "@/i18n";
import { DataFormat, getImportedData, ImportedExerciseData } from "@/integrations";
import { SelectableOption } from "@/interfaces";
import { loadingMixin } from "@/mixins";
import { Exercise, ExerciseState } from "@/models";
import { getFileContent } from "@/utils";
import { defineComponent, PropType } from "@vue/runtime-core";
import MinimalExercisePreview from "./ExerciseEditor/MinimalExercisePreview.vue";
import Dropdown from "../ui/Dropdown.vue";
import { exerciseStateOptions } from "@/const";
import Chipset from "../ui/Chipset.vue";
import ArticleHandle from "../shared/HelpCenter/ArticleHandle.vue";
export default defineComponent({
	name: "ExerciseImporter",
	props: {},
	mixins: [loadingMixin],
	watch: {
		exercises: {
			deep: true,
			handler(newVal) {
				this.$emit("updateExercises", newVal);
			},
		},
	},
	data() {
		return {
			DataFormat,
			selectedFormat: null as DataFormat | null,
			currentStep: "initial" as "initial" | "file_chosen",
			exercises: [] as Exercise[],
			extras: {} as Record<string, any>,
			exerciseStateOptions,
		};
	},
	methods: {
		async onFileInputChange(event: { target: HTMLInputElement }) {
			if (event.target.files === null || event.target.files.length === 0) {
				return;
			}
			try {
				const file = event.target.files[0];
				const fileContents = await getFileContent(file);
				const importedData: ImportedExerciseData = await getImportedData(
					fileContents,
					this.selectedFormat as DataFormat,
				);
				if ((importedData.errors?.length ?? 0) === 0) {
					this.exercises = importedData.data;
					this.extras = importedData.extras;
					this.currentStep = "file_chosen";
				} else {
					// TODO handle errors
					this.setErrorNotification(importedData.errors?.[0], true);
				}
			} catch (e) {
				this.setErrorNotification(e);
			}
		},
		onSelect(format: DataFormat) {
			if (format === this.selectedFormat) {
				this.selectedFormat = null;
			} else {
				this.selectedFormat = format;
			}
		},
		getImageUrl(imageName: string) {
			// eslint-disable-next-line no-undef
			return require("@/assets/" + imageName);
		},
	},
	computed: {
		tagsAsOptions(): SelectableOption[] {
			if ((this.extras.tags?.length ?? 0) === 0) {
				return [];
			}
			return (this.extras.tags as string[])
				.filter(t => t.length > 0)
				.map(t => ({
					value: t,
					content: t,
					icons: this.selectedTagsProxy.includes(t) ? ["done-sm"] : [],
				}));
		},
		dataFormatsAsSelectableOptions(): SelectableOption[] {
			return [
				{
					value: DataFormat.MOODLE_XML,
					content: getTranslatedString(
						"exercise_import.formats." + DataFormat.MOODLE_XML,
					),
					description: this.getImageUrl("icons/moodle.png"),
				},
				{
					value: DataFormat.EVO_JSON,
					content: getTranslatedString("exercise_import.formats." + DataFormat.EVO_JSON),
					description: this.getImageUrl("icons/json_evo.png"),
				},
			];
		},
		importedExercisesStateProxy: {
			get() {
				return this.exercises[0]?.state;
			},
			set(val: ExerciseState) {
				for (const e of this.exercises) {
					e.state = val;
				}
			},
		},
		selectedTagsProxy: {
			get() {
				return (this.exercises[0]?.public_tags ?? []).map(t => t.name);
			},
			set(val: string[]) {
				for (const e of this.exercises) {
					e.public_tags = val.map(v => ({ name: v }));
				}
			},
		},
	},
	components: { MinimalExercisePreview, Dropdown, Chipset, ArticleHandle },
});
</script>

<style></style>

<template>
	<Card class="h-80" :hoverable="false">
		<template v-slot:header>
			<div class="relative">
				<div class="absolute flex space-x-4">
					<div class="w-10 rounded-lg skeleton-unit"></div>
					<div class="w-32 md:w-64 skeleton-unit"></div>
				</div>
				<div class="flex items-center opacity-0">
					<span class="mr-2 material-icons-two-tone two-tone-primary">book</span>
					<h3>&nbsp;</h3>
				</div>
			</div>
		</template>
		<template v-slot:body>
			<div class="relative w-full h-full">
				<div class="absolute flex flex-col w-full h-full">
					<div class="w-3/5 h-3 mb-1 skeleton-unit"></div>
					<div class="w-3/5 h-3 skeleton-unit"></div>

					<div class="w-full h-3 mt-8 mb-1 skeleton-unit"></div>
					<div class="w-full h-3 skeleton-unit"></div>
					<div class="w-full h-3 my-1 skeleton-unit"></div>
					<div class="w-full h-3 mb-auto skeleton-unit"></div>

					<div class="w-1/2 mx-auto mt-auto rounded-lg skeleton-unit"></div>
				</div>

				<div class="flex items-center opacity-0">
					<p class="text-sm text-muted">&nbsp;</p>
					<p class="text-sm text-muted">&nbsp;</p>
				</div>
			</div>
		</template>
		<!-- <template v-slot:side>
      <div class="relative">
        <div class="absolute right-0">
          <div class="w-32 mt-1 mb-2 rounded-md h-7 skeleton-unit"></div>
          <div class="w-32 rounded-md h-7 skeleton-unit"></div>
        </div>
        <div class="flex flex-col items-stretch space-y-2 opacity-0">
          <Btn class="w-full">
            <span class="mr-1 text-base material-icons-outlined"> shield </span>
            {{ $t("courses.course_panel") }}
          </Btn>
          <Btn class="w-full">
            <span class="mr-0.5 text-base material-icons-outlined">
              chevron_right
            </span>
            {{ $t("courses.go_to_course") }}
          </Btn>
        </div>
      </div>
    </template> -->
	</Card>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import Card from "../Card.vue";
export default defineComponent({
	name: "CourseListItemSkeleton",
	components: { Card },
});
</script>

<style></style>

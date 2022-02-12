/* eslint-disable @typescript-eslint/no-explicit-any */
// import {
//   Course,
//   Event,
//   EventParticipation,
//   EventParticipationSlot,
//   EventTemplate,
//   EventType,
//   Exercise,
//   Tag,
//   User,
// } from '@/models';
// import { Commit, createStore } from 'vuex';
// import { getCourses, getTags } from '@/api/courses';
// import {
//   createExercise,
//   createExerciseChoice,
//   getExercises,
//   updateExercise,
//   updateExerciseChoice,
// } from '@/api/exercises';
// import axios from 'axios';
// import {
//   bulkPartialUpdateEventParticipation,
//   createEvent,
//   createEventTemplateRule,
//   getEvent,
//   getEvents,
//   partialUpdateEventParticipation,
//   partialUpdateEventParticipationSlot,
//   updateEvent,
//   updateEventTemplateRule,
// } from '@/api/events';
// import { SearchFilter } from '@/api/interfaces';
// import { mutations } from './mutations';
// import { getters } from './getters';
// import { actions as teacherActions } from './teacherActions';
// import { actions as studentActions } from './studentActions';

import { User } from '@/models';
import { createStore } from 'vuex';
import { sharedStore } from './shared';
import { teacherStore } from './teacher';
import { studentStore } from './student';

// import VuexPersistence from 'vuex-persist';

// const vuexLocal = new VuexPersistence({
//   storage: window.localStorage,
//   modules: ['shared'],
//   reducer: (state: { shared: any }) => ({
//     user: state.shared.user,
//     token: state.shared.token,
//     refreshToken: state.shared.refreshToken,
//   }),
// });
export default createStore({
  // plugins: [vuexLocal.plugin],
  // state: {
  //   /* shared state */
  //   user: {} as User,
  //   courses: [] as Course[],
  //   token: '',
  //   refreshToken: '',
  //   loading: false,
  //   saving: false,
  //   savingError: false,
  //   showSuccessFeedback: false,

  //   /* teachers-only state*/
  //   exercises: [] as Exercise[],
  //   events: [] as Event[],
  //   eventParticipations: [] as EventParticipation[], // participations to current event
  //   tags: [] as Tag[],
  //   currentExercisePage: 1, // for server-side pagination
  //   users: [] as User[], // for course permissions view

  //   /* students-only state */
  //   eventParticipation: null as EventParticipation | null,
  // },
  // getters,
  // mutations,
  // actions: {
  //   ...teacherActions,
  //   ...studentActions,
  //   // converts a token issued by Google to a token usable to authenticate requests to the backend
  //   convertToken: ({ commit }: { commit: Commit }, token: string) => {
  //     return new Promise((resolve, reject) => {
  //       axios
  //         .post('/users/auth/convert-token/', {
  //           token,
  //           grant_type: 'convert_token',
  //           client_id: process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_ID,
  //           client_secret:
  //             process.env.VUE_APP_GOOGLE_OAUTH_CLIENT_SECRET,
  //           backend: 'google-oauth2',
  //         })
  //         .then((response) => {
  //           commit('setToken', response.data.access_token);
  //           commit('setRefreshToken', response.data.refresh_token);
  //           resolve(response);
  //         })
  //         .catch((error) => {
  //           reject(error);
  //         });
  //     });
  //   },
  //   getUserData: ({ commit }: { commit: Commit }) => {
  //     return new Promise((resolve, reject) => {
  //       axios
  //         .get('/users/me/')
  //         .then((response) => {
  //           commit('setUser', { user: response.data });
  //           resolve(response);
  //         })
  //         .catch((error) => {
  //           reject(error);
  //         });
  //     });
  //   },
  //   getCourses: async ({ commit }: { commit: Commit }) => {
  //     const courses = await getCourses();
  //     commit('setCourses', courses);
  //   },
  //   partialUpdateEventParticipationSlot: async (
  //     { commit, state }: { commit: Commit; state: any },
  //     {
  //       courseId,
  //       eventId,
  //       participationId,
  //       slotId,
  //       changes,
  //       // true if action mutates the store state to reflect changes,
  //       //false if action only dispatches api call
  //       mutate = true,
  //     }: {
  //       courseId: string;
  //       eventId: string;
  //       participationId: string;
  //       slotId: string;
  //       changes: Record<keyof EventParticipationSlot, unknown>;
  //       mutate: boolean;
  //     }
  //   ) => {
  //     const response = await partialUpdateEventParticipationSlot(
  //       courseId,
  //       eventId,
  //       participationId, //state.eventParticipation?.id,
  //       slotId,
  //       changes
  //     );
  //     if (mutate) {
  //       commit('setEventParticipationSlot', {
  //         slotId,
  //         slot: response,
  //         participationId,
  //       });
  //     }
  //   },
  //   partialUpdateEventParticipation: async (
  //     { commit, state }: { commit: Commit; state: any },
  //     {
  //       courseId,
  //       changes,
  //       eventId = undefined,
  //       participationIds = undefined,
  //     }: {
  //       courseId: string;
  //       eventId?: string;
  //       changes: Record<keyof EventParticipation, unknown>;
  //       participationIds?: string[];
  //     }
  //   ) => {
  //     let response;
  //     if (participationIds && eventId) {
  //       // teacher usage with multiple ids
  //       response = await bulkPartialUpdateEventParticipation(
  //         courseId,
  //         eventId,
  //         participationIds,
  //         changes
  //       );
  //       response.forEach((p) => commit('setEventParticipation', p));
  //     } else {
  //       // student usage, implicit id as the event participation is in the store
  //       response = await partialUpdateEventParticipation(
  //         courseId,
  //         state.eventParticipation?.event.id,
  //         state.eventParticipation?.id,
  //         changes
  //       );
  //       commit('setEventParticipation', response);
  //     }
  //   },
  // },
  modules: {
    shared: sharedStore,
    teacher: teacherStore,
    student: studentStore,
  },
});

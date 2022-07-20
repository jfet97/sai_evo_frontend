import {
  normalizeIncomingEvent,
  normalizeIncomingEventParticipation,
} from "./converters";
import { Exercise } from "./../models/interfaces";
import { EventSearchFilter } from "./interfaces";
import {
  Event,
  EventParticipation,
  EventParticipationSlot,
  EventTemplate,
  EventTemplateRule,
  EventTemplateRuleClause,
  EventTemplateRuleType,
} from "@/models";
import { forceFileDownload } from "@/utils";
import axios from "axios";
import {
  convertEventTemplateRules,
  getEventUrlQueryParams,
  tagIdsToTags,
  tagNamesToTags,
} from "./utils";

export async function getEvents(
  courseId: string,
  filters?: EventSearchFilter
): Promise<Event[]> {
  const response = await axios.get(
    `/courses/${courseId}/events/${getEventUrlQueryParams(filters ?? null)}`
  );
  return (response.data as Event[]).map((e) => normalizeIncomingEvent(e));
}

export async function getEvent(
  courseId: string,
  eventId: string
): Promise<Event> {
  const response = await axios.get(`/courses/${courseId}/events/${eventId}/`);
  return normalizeIncomingEvent(response.data);
}

export async function getEventTemplate(
  courseId: string,
  templateId: string
): Promise<EventTemplate> {
  const response = await axios.get(
    `/courses/${courseId}/templates/${templateId}/`
  );
  const template = response.data as EventTemplate;
  const processedRules = convertEventTemplateRules(template.rules);
  return { ...template, rules: processedRules ?? [] };
}

export async function getEventTemplateRule(
  courseId: string,
  templateId: string,
  ruleId: string
): Promise<EventTemplateRule> {
  const response = await axios.get(
    `/courses/${courseId}/templates/${templateId}/rules/${ruleId}/`
  );
  const rule = response.data as EventTemplateRule;
  const processedRule = convertEventTemplateRules([
    rule,
  ]) as EventTemplateRule[];
  return processedRule[0];
}

export async function createEvent(
  courseId: string,
  event: Event
): Promise<Event> {
  const response = await axios.post(`courses/${courseId}/events/`, event);
  return response.data;
}

export async function updateEvent(
  courseId: string,
  eventId: string,
  event: Event
): Promise<Event> {
  const response = await axios.put(
    `courses/${courseId}/events/${eventId}/`,
    event
  );
  return response.data;
}

export async function getEventInstances(
  courseId: string,
  eventId: string,
  amount: number
): Promise<Exercise[][]> {
  const response = await axios.get(
    `courses/${courseId}/events/${eventId}/instances/?amount=${amount}`
  );
  return response.data;
}

// TODO change Record<keyof Event, unknown> to Partial<Event>
export async function partialUpdateEvent(
  courseId: string,
  eventId: string,
  changes: Record<keyof Event, unknown>
): Promise<Event> {
  const response = await axios.patch(
    `courses/${courseId}/events/${eventId}/`,
    changes
  );
  return response.data;
}

export async function deleteEvent(
  courseId: string,
  eventId: string
): Promise<void> {
  const response = await axios.delete(
    `/courses/${courseId}/events/${eventId}/`
  );
  return response.data;
}

export async function getCourseEventParticipations(
  courseId: string,
  includeDetails?: boolean,
  includeEvent?: boolean
): Promise<EventParticipation[]> {
  const response = await axios.get(
    `/courses/${courseId}/participations/${
      includeDetails ? "?include_details=" + includeDetails : ""
    }${includeEvent ? "&include_event=" + includeEvent : ""}`
  );
  return (response.data as EventParticipation[]).map((p) =>
    normalizeIncomingEventParticipation(p)
  );
}

export async function getEventParticipations(
  courseId: string,
  eventId: string,
  includeDetails?: boolean,
  forCsv?: boolean
): Promise<EventParticipation[]> {
  const response = await axios.get(
    `/courses/${courseId}/events/${eventId}/participations/${
      includeDetails ? "?include_details=" + includeDetails : ""
    }${forCsv ? "&for_csv=" + forCsv : ""}`
  );
  return (response.data as EventParticipation[]).map((p) =>
    normalizeIncomingEventParticipation(p)
  );
}

export async function getEventParticipation(
  courseId: string,
  eventId: string,
  participationId: string
): Promise<EventParticipation> {
  const response = await axios.get(
    `/courses/${courseId}/events/${eventId}/participations/${participationId}/`
  );
  return normalizeIncomingEventParticipation(
    response.data as EventParticipation
  );
}

export async function createEventTemplateRule(
  courseId: string,
  templateId: string,
  rule: EventTemplateRule
): Promise<EventTemplateRule> {
  const response = await axios.post(
    `courses/${courseId}/templates/${templateId}/rules/`,
    rule
  );
  return response.data;
}

export async function updateEventTemplateRule(
  courseId: string,
  templateId: string,
  ruleId: string,
  rule: EventTemplateRule
): Promise<EventTemplateRule> {
  const response = await axios.put(
    `/courses/${courseId}/templates/${templateId}/rules/${ruleId}/`,
    rule
  );
  return response.data;
}

export async function partialUpdateEventTemplateRule(
  courseId: string,
  templateId: string,
  ruleId: string,
  changes: Partial<EventTemplateRule>
): Promise<EventTemplateRule> {
  const response = await axios.put(
    `/courses/${courseId}/templates/${templateId}/rules/${ruleId}/`,
    changes
  );
  return response.data;
}

export async function deleteEventTemplateRule(
  courseId: string,
  templateId: string,
  ruleId: string
): Promise<EventTemplateRule> {
  const response = await axios.delete(
    `/courses/${courseId}/templates/${templateId}/rules/${ruleId}/`
  );
  return response.data;
}

export async function createEventTemplateRuleClause(
  courseId: string,
  templateId: string,
  ruleId: string,
  clause: EventTemplateRuleClause
): Promise<EventTemplateRuleClause> {
  const payload = {
    ...clause,
    tags: tagNamesToTags(clause.tags.map((t) => t.name)).map((t) => t.id),
  };
  const response = await axios.post(
    `courses/${courseId}/templates/${templateId}/rules/${ruleId}/clauses/`,
    payload
  );
  const data = response.data;
  return { ...data, tags: tagIdsToTags(data.tags) };
}

export async function updateEventTemplateRuleClause(
  courseId: string,
  templateId: string,
  ruleId: string,
  clause: EventTemplateRuleClause
): Promise<EventTemplateRuleClause> {
  const payload = {
    ...clause,
    tags: tagNamesToTags(clause.tags.map((t) => t.name)).map((t) => t.id),
  };
  const response = await axios.put(
    `courses/${courseId}/templates/${templateId}/rules/${ruleId}/clauses/${clause.id}/`,
    payload
  );
  const data = response.data;
  return { ...data, tags: tagIdsToTags(data.tags) };
}

export async function deleteEventTemplateRuleClause(
  courseId: string,
  templateId: string,
  ruleId: string,
  clauseId: string
): Promise<EventTemplateRuleClause> {
  const response = await axios.delete(
    `courses/${courseId}/templates/${templateId}/rules/${ruleId}/clauses/${clauseId}/`
  );
  return response.data;
}

export async function participateInEvent(
  courseId: string,
  eventId: string
): Promise<EventParticipation> {
  const response = await axios.post(
    `/courses/${courseId}/events/${eventId}/participations/`
  );
  return response.data;
}

export async function partialUpdateEventParticipation(
  courseId: string,
  eventId: string,
  participationId: string,
  changes: Record<keyof EventParticipation, unknown>
): Promise<EventParticipation> {
  const response = await axios.patch(
    `/courses/${courseId}/events/${eventId}/participations/${participationId}/`,
    changes
  );
  return response.data;
}

export async function bulkPartialUpdateEventParticipation(
  courseId: string,
  eventId: string,
  participationIds: string[],
  changes: Record<keyof EventParticipation, unknown>
): Promise<EventParticipation[]> {
  let url = `/courses/${courseId}/events/${eventId}/participations/`;
  url += `bulk_patch/?ids=${participationIds.join(",")}`;
  const response = await axios.patch(url, changes);
  return response.data;
}

export async function partialUpdateEventParticipationSlot(
  courseId: string,
  eventId: string,
  participationId: string,
  slotId: string,
  changes: Record<keyof EventParticipationSlot, unknown>,
  forceStudent = false
): Promise<EventParticipationSlot> {
  const response = await axios.patch(
    `/courses/${courseId}/events/${eventId}/participations/${participationId}/slots/${slotId}/${
      forceStudent ? "?as_student=1" : ""
    }`,
    changes
  );
  return response.data;
}

export async function getEventParticipationSlot(
  courseId: string,
  eventId: string,
  participationId: string,
  slotId: string,
  forceStudent = false
): Promise<EventParticipationSlot> {
  const response = await axios.get(
    `/courses/${courseId}/events/${eventId}/participations/${participationId}/slots/${slotId}/${
      forceStudent ? "?as_student=1" : ""
    }`
  );
  return response.data;
}

export async function downloadEventParticipationSlotAttachment(
  courseId: string,
  eventId: string,
  participationId: string,
  slotId: string
): Promise<any> {
  const response = await axios.get(
    `/courses/${courseId}/events/${eventId}/participations/${participationId}/slots/${slotId}/attachment/`,
    { responseType: "arraybuffer" }
  );
  console.log(
    "FILE",
    response,
    response.headers,
    "----",
    response.headers["content-disposition"],
    response.headers["content-disposition"]
      .split(/.*filename=(.*)/)[1]
      .replace(/"/g, "")
  );
  const fileName = response.headers["content-disposition"]
    .split(/.*filename=(.*)/)[1]
    .replace(/"/g, "");
  forceFileDownload(response, fileName);
}

export async function runEventParticipationSlotCode(
  courseId: string,
  eventId: string,
  participationId: string,
  slotId: string
): Promise<EventParticipationSlot> {
  const response = await axios.post(
    `/courses/${courseId}/events/${eventId}/participations/${participationId}/slots/${slotId}/run/?as_student=1`
  );
  return response.data;
}

export async function moveEventParticipationCurrentSlotCursor(
  courseId: string,
  eventId: string,
  participationId: string,
  direction: "forward" | "back"
): Promise<EventParticipationSlot> {
  const response = await axios.post(
    `/courses/${courseId}/events/${eventId}/participations/${participationId}/go_${direction}/`
  );
  return response.data;
}

import { EventState } from '@/models';

export const icons = {
  [EventState.DRAFT]: ['insert_drive_file-sm'],
  [EventState.PLANNED]: ['event_available-sm'],
  [EventState.OPEN]: ['more_horiz-sm'],
  [EventState.CLOSED]: ['lock-sm'],
  [EventState.RESTRICTED]: ['key-sm'],
};

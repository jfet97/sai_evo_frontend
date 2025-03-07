import { Exercise, ExerciseChoice, ExerciseTestCase } from "@/models";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { debounce, DebouncedFunc } from "lodash";
import {
	EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCED_FIELDS,
	EXERCISE_CHOICE_AUTO_SAVE_DEBOUNCE_TIME_MS,
} from "./const";

type RemotePatchFunction<T> = (changes: FieldValuesObject<T>) => Promise<void>;
type PatchFunction<T> = (changes: FieldValuesObject<T>, reverting?: boolean) => void;
export type FieldList<T> = (keyof T)[];
type FieldValuesObject<T> = Partial<T>;

enum AutoSaveManagerState {
	UP_TO_DATE,
	PENDING,
	ERROR,
}
export class AutoSaveManager<T> {
	instance: T;
	unsavedChanges: FieldValuesObject<T>;
	beforeChanges: FieldValuesObject<T>;
	remotePatchFunction: DebouncedFunc<RemotePatchFunction<T>>;
	localPatchFunction: PatchFunction<T>;
	errorFunction?: (e: any) => void;
	successFunction?: () => void;
	cleanupFunction?: () => void;
	debouncedFields: FieldList<T>;
	revertOnFailure: boolean;
	alwaysPatchLocal: boolean;
	state: AutoSaveManagerState;

	constructor(
		instance: T,
		remotePatchFunction: RemotePatchFunction<T>,
		localPatchFunction: PatchFunction<T>,
		debouncedFields: FieldList<T>,
		debounceTime: number,
		successFunction?: () => void,
		errorFunction?: (e: any) => void,
		cleanupFunction?: () => void,
		revertOnFailure = false,
		alwaysPatchLocal = true,
	) {
		this.instance = instance;
		this.localPatchFunction = localPatchFunction;
		this.remotePatchFunction = debounce(
			this.wrapRemotePatchFunction(remotePatchFunction),
			debounceTime,
		);
		this.debouncedFields = debouncedFields;
		this.unsavedChanges = {};
		this.beforeChanges = {};
		this.successFunction = successFunction;
		this.errorFunction = errorFunction;
		this.cleanupFunction = cleanupFunction;
		this.revertOnFailure = revertOnFailure;
		this.alwaysPatchLocal = alwaysPatchLocal;
		this.state = AutoSaveManagerState.UP_TO_DATE;
	}

	async onChange<K extends keyof T>({
		field,
		value,
	}: {
		field: K;
		value: T[K];
	}): Promise<void> {
		this.state = AutoSaveManagerState.PENDING;

		// record new change to field
		this.unsavedChanges[field] = value as any;

		// make deep copy of field about to change in case rollback becomes necessary
		// (only for non-debounced fields as it would be disconcerting to roll back
		// debounced changes like in text fields)
		if (!this.debouncedFields.includes(field)) {
			this.beforeChanges[field] = JSON.parse(JSON.stringify(this.instance[field]));
		}

		if (this.alwaysPatchLocal) {
			// instantly update in-memory instance
			this.localPatchFunction({ [field]: value } as any);
		}

		// dispatch update to backend
		await this.remotePatchFunction(this.unsavedChanges);
		if (!this.debouncedFields.includes(field)) {
			// field isn't to be debounced; call remote update immediately
			await this.remotePatchFunction.flush();
		}
	}

	async flush(): Promise<void> {
		if (this.state !== AutoSaveManagerState.UP_TO_DATE) {
			await this.remotePatchFunction.flush();
		}
	}

	isPending(): boolean {
		return this.state === AutoSaveManagerState.PENDING;
	}

	private wrapRemotePatchFunction(
		callback: RemotePatchFunction<T>,
	): RemotePatchFunction<T> {
		/**
		 * Wraps the callback into a function that awaits the callback first, and
		 * if it is successful, then empties the unsaved changes object
		 */
		return async (changes: FieldValuesObject<T>) => {
			try {
				await callback(changes);
				if (!this.alwaysPatchLocal) {
					// update in-memory instance
					this.localPatchFunction(changes);
				}
				// reset bookkeeping about recent changes
				this.unsavedChanges = {};
				this.beforeChanges = {};
				this.state = AutoSaveManagerState.UP_TO_DATE;

				// call user-supplied success callback
				this.successFunction?.();
			} catch (e) {
				// call user-supplied error callback
				this.errorFunction?.(e);

				if (this.revertOnFailure) {
					// roll back unsaved changes
					this.localPatchFunction(this.beforeChanges, true);
				}
				this.state = AutoSaveManagerState.ERROR;
			} finally {
				this.cleanupFunction?.();
			}
		};
	}
}

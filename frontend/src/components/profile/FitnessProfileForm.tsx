import type { ChangeEvent } from 'react';
import {
  experienceLevelOptions,
  fitnessGoalOptions,
  genderOptions,
  type FitnessProfileFormErrors,
  type FitnessProfileFormValues,
} from '../../utils/fitnessProfile';

interface FitnessProfileFormProps {
  values: FitnessProfileFormValues;
  errors: FitnessProfileFormErrors;
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const inputClassName =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100';

const errorClassName = 'mt-1 text-sm text-rose-600';

export default function FitnessProfileForm({
  values,
  errors,
  disabled = false,
  onChange,
}: FitnessProfileFormProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Full Name</label>
        <input name="fullName" value={values.fullName} onChange={onChange} disabled={disabled} className={inputClassName} />
        {errors.fullName ? <p className={errorClassName}>{errors.fullName}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Username</label>
        <input name="username" value={values.username} onChange={onChange} disabled={disabled} className={inputClassName} />
        {errors.username ? <p className={errorClassName}>{errors.username}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Age</label>
        <input name="age" type="number" value={values.age} onChange={onChange} disabled={disabled} className={inputClassName} min={10} max={100} />
        {errors.age ? <p className={errorClassName}>{errors.age}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Gender</label>
        <select name="gender" value={values.gender} onChange={onChange} disabled={disabled} className={inputClassName}>
          <option value="">Select gender</option>
          {genderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.gender ? <p className={errorClassName}>{errors.gender}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Height (cm)</label>
        <input name="height" type="number" value={values.height} onChange={onChange} disabled={disabled} className={inputClassName} min={100} max={250} step="0.1" />
        {errors.height ? <p className={errorClassName}>{errors.height}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Weight (kg)</label>
        <input name="weight" type="number" value={values.weight} onChange={onChange} disabled={disabled} className={inputClassName} min={25} max={300} step="0.1" />
        {errors.weight ? <p className={errorClassName}>{errors.weight}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Fitness Goal</label>
        <select name="fitnessGoal" value={values.fitnessGoal} onChange={onChange} disabled={disabled} className={inputClassName}>
          <option value="">Select goal</option>
          {fitnessGoalOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.fitnessGoal ? <p className={errorClassName}>{errors.fitnessGoal}</p> : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">Workout Experience</label>
        <select name="experienceLevel" value={values.experienceLevel} onChange={onChange} disabled={disabled} className={inputClassName}>
          <option value="">Select level</option>
          {experienceLevelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.experienceLevel ? <p className={errorClassName}>{errors.experienceLevel}</p> : null}
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-600">Sleep Hours</label>
        <input name="sleepHours" type="number" value={values.sleepHours} onChange={onChange} disabled={disabled} className={inputClassName} min={0} max={24} step="0.5" />
        {errors.sleepHours ? <p className={errorClassName}>{errors.sleepHours}</p> : null}
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-medium text-slate-600">Injury History</label>
        <textarea
          name="injuryHistoryText"
          value={values.injuryHistoryText}
          onChange={onChange}
          disabled={disabled}
          rows={4}
          className={`${inputClassName} resize-none`}
          placeholder="Add one injury or limitation per line"
        />
      </div>
    </div>
  );
}

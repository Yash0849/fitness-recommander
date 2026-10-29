import type { FitnessProfile, FitnessProfilePayload } from '../services/fitnessProfileService';

export interface FitnessProfileFormValues {
  fullName: string;
  username: string;
  age: string;
  gender: FitnessProfile['gender'] | '';
  height: string;
  weight: string;
  fitnessGoal: FitnessProfile['fitnessGoal'] | '';
  sleepHours: string;
  injuryHistoryText: string;
  experienceLevel: FitnessProfile['experienceLevel'] | '';
  profilePhoto: string;
}

export type FitnessProfileFormErrors = Partial<Record<keyof FitnessProfileFormValues, string>>;

export const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
] as const;

export const fitnessGoalOptions = [
  { value: 'weight-loss', label: 'Weight Loss' },
  { value: 'muscle-gain', label: 'Muscle Gain' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'general-fitness', label: 'General Fitness' },
] as const;

export const experienceLevelOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;

export const calculateBMI = (heightCm: number, weightKg: number) => {
  if (!heightCm || !weightKg) {
    return 0;
  }

  const heightInMeters = heightCm / 100;

  if (heightInMeters <= 0) {
    return 0;
  }

  return Math.round((weightKg / (heightInMeters * heightInMeters)) * 10) / 10;
};

export const toInjuryHistoryArray = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

export const toInjuryHistoryText = (value: string[] = []) => value.join('\n');

export const getEmptyFitnessProfileForm = (): FitnessProfileFormValues => ({
  fullName: '',
  username: '',
  age: '',
  gender: '',
  height: '',
  weight: '',
  fitnessGoal: '',
  sleepHours: '',
  injuryHistoryText: '',
  experienceLevel: '',
  profilePhoto: '',
});

export const mapProfileToFormValues = (profile: FitnessProfile | null | undefined): FitnessProfileFormValues => {
  if (!profile) {
    return getEmptyFitnessProfileForm();
  }

  return {
    fullName: profile.fullName || '',
    username: profile.username || '',
    age: profile.age ? `${profile.age}` : '',
    gender: profile.gender || '',
    height: profile.height ? `${profile.height}` : '',
    weight: profile.weight ? `${profile.weight}` : '',
    fitnessGoal: profile.fitnessGoal || '',
    sleepHours: profile.sleepHours ? `${profile.sleepHours}` : '',
    injuryHistoryText: toInjuryHistoryText(profile.injuryHistory),
    experienceLevel: profile.experienceLevel || '',
    profilePhoto: profile.profilePhoto || '',
  };
};

export const validateFitnessProfileForm = (values: FitnessProfileFormValues): FitnessProfileFormErrors => {
  const errors: FitnessProfileFormErrors = {};
  const age = Number(values.age);
  const height = Number(values.height);
  const weight = Number(values.weight);
  const sleepHours = Number(values.sleepHours);

  if (values.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  if (values.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  if (!Number.isFinite(age) || age < 10 || age > 100) {
    errors.age = 'Age must be between 10 and 100';
  }

  if (!values.gender) {
    errors.gender = 'Select a gender';
  }

  if (!Number.isFinite(height) || height < 100 || height > 250) {
    errors.height = 'Height must be between 100 cm and 250 cm';
  }

  if (!Number.isFinite(weight) || weight < 25 || weight > 300) {
    errors.weight = 'Weight must be between 25 kg and 300 kg';
  }

  if (!values.fitnessGoal) {
    errors.fitnessGoal = 'Select a fitness goal';
  }

  if (!Number.isFinite(sleepHours) || sleepHours < 0 || sleepHours > 24) {
    errors.sleepHours = 'Sleep hours must be between 0 and 24';
  }

  if (!values.experienceLevel) {
    errors.experienceLevel = 'Select your experience level';
  }

  return errors;
};

export const mapFormValuesToPayload = (values: FitnessProfileFormValues): FitnessProfilePayload => ({
  fullName: values.fullName.trim(),
  username: values.username.trim(),
  profilePhoto: values.profilePhoto,
  age: Number(values.age),
  gender: values.gender as FitnessProfile['gender'],
  height: Number(values.height),
  weight: Number(values.weight),
  fitnessGoal: values.fitnessGoal as FitnessProfile['fitnessGoal'],
  sleepHours: Number(values.sleepHours),
  injuryHistory: toInjuryHistoryArray(values.injuryHistoryText),
  experienceLevel: values.experienceLevel as FitnessProfile['experienceLevel'],
});

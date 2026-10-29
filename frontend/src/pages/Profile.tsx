import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileAPI } from '../lib/api';
import { Camera, Edit2, Loader2, Save, Target, User, X } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import FitnessProfileForm from '../components/profile/FitnessProfileForm';
import FitnessProfileStats from '../components/profile/FitnessProfileStats';
import { fitnessProfileService, type FitnessProfile } from '../services/fitnessProfileService';
import {
  calculateBMI,
  getEmptyFitnessProfileForm,
  mapFormValuesToPayload,
  mapProfileToFormValues,
  validateFitnessProfileForm,
  type FitnessProfileFormErrors,
  type FitnessProfileFormValues,
} from '../utils/fitnessProfile';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<FitnessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FitnessProfileFormValues>(getEmptyFitnessProfileForm());
  const [formErrors, setFormErrors] = useState<FitnessProfileFormErrors>({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const achievements = [
    { title: 'Recovery Aware', description: 'Keep injury history updated for safer plans', icon: Target },
    { title: 'Sleep Ready', description: 'Track nightly sleep to improve recommendations', icon: Target },
    { title: 'Goal Focused', description: 'Shape workouts around your current objective', icon: Target },
  ];

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setApiError('');

        const remoteProfile = await fitnessProfileService.getMyProfile();
        const fallbackProfile = profileAPI.get(user.id);

        const nextProfile: FitnessProfile | null = remoteProfile
          ? remoteProfile
          : fallbackProfile
            ? {
                fullName: fallbackProfile.fullName || '',
                username: fallbackProfile.username || user.email.split('@')[0],
                profilePhoto: fallbackProfile.profilePhoto || '',
                age: 10,
                gender: 'prefer-not-to-say',
                height: fallbackProfile.height || 100,
                weight: fallbackProfile.weight || 25,
                bmi: fallbackProfile.height && fallbackProfile.weight
                  ? calculateBMI(fallbackProfile.height, fallbackProfile.weight)
                  : calculateBMI(fallbackProfile.height || 100, fallbackProfile.weight || 25),
                fitnessGoal: (fallbackProfile.goal as FitnessProfile['fitnessGoal']) || 'general-fitness',
                sleepHours: 8,
                injuryHistory: [],
                experienceLevel: 'beginner',
              }
            : null;

        setProfile(nextProfile);
        setFormData(mapProfileToFormValues(nextProfile));
      } catch (error) {
        console.error('Failed to load profile:', error);
        setApiError('Unable to load your fitness profile right now.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const computedBmi = useMemo(() => calculateBMI(Number(formData.height), Number(formData.weight)), [formData.height, formData.weight]);
  const bmiDisplayValue = computedBmi || profile?.bmi || 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSuccessMessage('');
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name as keyof FitnessProfileFormValues]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    const errors = validateFitnessProfileForm(formData);
    setFormErrors(errors);
    setApiError('');
    setSuccessMessage('');

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsSaving(true);
      const savedProfile = await fitnessProfileService.saveMyProfile(mapFormValuesToPayload(formData));

      setProfile(savedProfile);
      setFormData(mapProfileToFormValues(savedProfile));
      profileAPI.save(
        user.id,
        {
          fullName: savedProfile.fullName,
          username: savedProfile.username,
          height: savedProfile.height,
          weight: savedProfile.weight,
          goal: savedProfile.fitnessGoal,
          profilePhoto: savedProfile.profilePhoto,
        },
        user.email
      );
      setSuccessMessage('Profile saved successfully.');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      const errorWithDetails = error as Error & { details?: FitnessProfileFormErrors };
      if (errorWithDetails.details) {
        setFormErrors((prev) => ({
          ...prev,
          ...errorWithDetails.details,
        }));
      }
      const message = error instanceof Error ? error.message : 'Failed to save profile';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(mapProfileToFormValues(profile));
    setFormErrors({});
    setApiError('');
    setSuccessMessage('');
    setIsEditing(false);
  };

  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setFormData(prev => ({
        ...prev,
        profilePhoto: base64String
      }));
    };
    reader.readAsDataURL(file);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-lg">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
          <span className="text-slate-700">Loading your fitness profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-8">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 via-indigo-900 to-cyan-700 p-8 text-white shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <ImageUpload
                  onImageSelect={handlePhotoUpload}
                  className="h-24 w-24 overflow-hidden rounded-full bg-white/20"
                >
                  {formData.profilePhoto ? (
                    <img
                      src={formData.profilePhoto}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-12 w-12" />
                    </div>
                  )}
                </ImageUpload>
                {isEditing && (
                  <div className="absolute bottom-0 right-0 rounded-full bg-white p-2 text-indigo-600 transition-colors hover:bg-indigo-50">
                    <Camera className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-100">Fitness Profile</p>
                <h1 className="mt-2 text-3xl font-bold">{profile?.fullName || formData.fullName || 'Complete Your Profile'}</h1>
                <p className="mt-1 text-indigo-100">{user?.email}</p>
                <p className="mt-3 max-w-2xl text-sm text-cyan-50/90">
                  Your profile powers safer workout suggestions, smarter nutrition insights, and more personalized AI recommendations.
                </p>
              </div>
            </div>
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="rounded-full bg-white p-3 text-indigo-600 transition-colors hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20"
              >
                <Edit2 className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <FitnessProfileStats
          bmi={computedBmi || profile?.bmi || 0}
          fitnessGoal={formData.fitnessGoal}
          sleepHours={formData.sleepHours}
          experienceLevel={formData.experienceLevel}
        />

        {apiError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {apiError}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[1.7fr_1fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/60">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Personal Health Details</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Keep these details current so future AI workout and diet features can adapt accurately.
                </p>
              </div>
            </div>

            {isEditing ? (
              <FitnessProfileForm
                values={formData}
                errors={formErrors}
                disabled={isSaving}
                onChange={handleInputChange}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: 'Full Name', value: profile?.fullName || 'Not set' },
                  { label: 'Username', value: profile?.username || 'Not set' },
                  { label: 'Age', value: profile?.age ? `${profile.age}` : 'Not set' },
                  { label: 'Gender', value: profile?.gender || 'Not set' },
                  { label: 'Height', value: profile?.height ? `${profile.height} cm` : 'Not set' },
                  { label: 'Weight', value: profile?.weight ? `${profile.weight} kg` : 'Not set' },
                  { label: 'Fitness Goal', value: profile?.fitnessGoal || 'Not set' },
                  { label: 'Sleep Hours', value: profile?.sleepHours ? `${profile.sleepHours} hrs` : 'Not set' },
                  { label: 'Experience Level', value: profile?.experienceLevel || 'Not set' },
                  { label: 'BMI', value: profile?.bmi ? `${profile.bmi}` : 'Not set' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">{item.label}</p>
                    <p className="mt-2 font-medium text-slate-900">{item.value}</p>
                  </div>
                ))}
                <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                  <p className="text-sm text-slate-500">Injury History</p>
                  <p className="mt-2 font-medium text-slate-900">
                    {profile?.injuryHistory?.length ? profile.injuryHistory.join(', ') : 'No injuries recorded'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/60">
              <h2 className="text-xl font-semibold text-slate-900">Profile Signals</h2>
              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Calculated BMI</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">
                    {bmiDisplayValue ? bmiDisplayValue.toFixed(1) : '--'}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">Automatically recalculated from height and weight.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Recommended focus</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    {formData.fitnessGoal ? formData.fitnessGoal.replace('-', ' ') : 'Complete your goal selection'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/60">
              <h2 className="text-xl font-semibold text-slate-900">Readiness Notes</h2>
              <div className="mt-4 space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-4 rounded-2xl bg-slate-50 p-4">
                    <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
                      <achievement.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{achievement.title}</p>
                      <p className="text-sm text-slate-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!profile && !isEditing ? (
              <div className="rounded-[2rem] border border-dashed border-indigo-300 bg-indigo-50 p-6 text-sm text-indigo-700">
                Your backend fitness profile has not been created yet. Press edit, fill in the form, and save to store it in MongoDB.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

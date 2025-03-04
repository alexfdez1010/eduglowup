import { LocalePagePropsWithId } from '@/app/[locale]/interfaces';
import { Avatar } from '@nextui-org/avatar';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { userService } from '@/lib/services/user-service';
import { notFound } from 'next/navigation';
import { profileService } from '@/lib/services/profile-service';
import { Link } from '@nextui-org/link';

export default async function ProfilePage({ params }: LocalePagePropsWithId) {
  const profileId = params.id;
  const profile = await profileService.getProfile(profileId);

  if (!profile) {
    notFound();
  }

  const user = await userService.getUserById(profile?.userId);

  return (
    <div className="container mx-auto p-4 my-10">
      <div className="flex flex-col justify-center items-center gap-6">
        <Avatar
          src={profile.imageUrl}
          name={user.name}
          size="lg"
          fallback={user.name.charAt(0).toUpperCase()}
          className="w-32 h-32"
          showFallback
        />
        <h1 className="text-3xl font-bold">{user.name}</h1>
        {profile.description && (
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            {profile.description}
          </p>
        )}
        {profile.linkedinUrl && (
          <p className="text-gray-600 dark:text-gray-400">
            LinkedIn:{' '}
            <Link
              href={profile?.linkedinUrl}
              color="primary"
              underline="always"
            >
              {profile?.linkedinUrl}
            </Link>
          </p>
        )}
        {profile.anotherUrl && (
          <p className="text-gray-600 dark:text-gray-400">
            Website:{' '}
            <Link href={profile?.anotherUrl} color="primary" underline="always">
              {profile?.anotherUrl}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

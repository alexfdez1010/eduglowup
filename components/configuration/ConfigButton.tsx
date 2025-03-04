'use client';

import { NavbarItem } from '@nextui-org/navbar';
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';

import NextImage from 'next/image';
import ConfigurationUser from './ConfigurationUser';
import { Key, ReactNode, useState } from 'react';

import { useRouter } from 'next/navigation';
import ConfigurationPomodoro from './ConfigurationPomodoro';
import { ConfigurationDto } from '@/lib/dto/configuration.dto';
import { InvitationDto } from '@/lib/dto/invitation.dto';
import ConfigurationInvitation from './ConfigurationInvitation';

import { useDictionary } from '@/components/hooks';
import { Badge } from '@nextui-org/badge';
import { Button } from '@nextui-org/button';
import {
  AlarmClock,
  ChartNoAxesCombined,
  FolderClosed,
  Gem,
  LogOut,
  TicketPlus,
  User,
  UserCircle,
  UserPlus,
  Trophy,
} from 'lucide-react';
import { useMoney } from '@/components/configuration/use-money';
import ModalWrapper, { ModalProps } from '@/components/modal/ModalWrapper';
import { useLaunchModal } from '@/components/modal/use-launch-modal';
import FAQs from '@/components/landing-page/FAQs';
import { faqsFromText } from '@/components/landing-page/utils';
import { ProfileDto } from '@/lib/dto/profile.dto';
import { UserDto } from '@/lib/dto/user.dto';
import ConfigurationProfile from '@/components/configuration/ConfigurationProfile';

interface ConfigButtonProps {
  configuration: ConfigurationDto;
  invitation: InvitationDto;
  user: UserDto;
  profile: ProfileDto;
}

interface ListItem {
  key: string;
  name: string;
  icon: ReactNode;
  function: () => void;
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'default';
  badgeNotification?: number;
}

export default function ConfigButton({
  configuration,
  invitation,
  user,
  profile,
}: ConfigButtonProps) {
  const router = useRouter();

  const dictionary = useDictionary('configuration');
  const dictionaryFaqs = useDictionary('faqs');

  const modals: ModalProps[] = [
    {
      keyModal: 'invitation',
      title: dictionary['invitation'],
      content: (
        <ConfigurationInvitation
          invitation={invitation}
          localeDictionary={dictionary}
        />
      ),
    },
    {
      keyModal: 'user',
      title: dictionary['user'],
      content: (
        <ConfigurationUser
          name={user.name}
          email={user.email}
          localeDictionary={dictionary}
        />
      ),
    },
    {
      keyModal: 'profile',
      title: dictionary['profile'],
      content: (
        <ConfigurationProfile profile={profile} localeDictionary={dictionary} />
      ),
    },
    {
      keyModal: 'pomodoro',
      title: dictionary['pomodoro'],
      content: (
        <ConfigurationPomodoro
          usesPomodoro={configuration.usesPomodoro}
          minutesWork={configuration.minutesWork}
          minutesRest={configuration.minutesRest}
          localeDictionary={dictionary}
        />
      ),
    },
    {
      keyModal: 'faqs',
      title: dictionaryFaqs['title'],
      content: <FAQs faqs={faqsFromText(dictionaryFaqs['faqs-app'])} />,
    },
  ];

  const money = useMoney();
  const launchModal = useLaunchModal();

  const listConfiguration: ListItem[] = [
    {
      key: 'money',
      name: money.toString(),
      icon: <Gem className="size-5" />,
      function: null,
    },
    {
      key: 'user',
      name: dictionary['user'],
      icon: <User className="size-5" />,
      function: () => launchModal('user'),
    },
    {
      key: 'profile',
      name: dictionary['profile'],
      icon: <UserCircle className="size-5" />,
      function: () => launchModal('profile'),
    },
    {
      key: 'invitation',
      name: dictionary['invitation'],
      icon: <UserPlus className="size-5" />,
      function: () => launchModal('invitation'),
      badgeNotification: 5 - invitation.invitationCount,
    },
    {
      key: 'statistics',
      name: dictionary['statistics'],
      icon: <ChartNoAxesCombined className="size-5" />,
      function: () => router.push('/app/statistics'),
    },
    {
      key: 'sessions',
      name: dictionary['sessions'],
      icon: <FolderClosed className="size-5" />,
      function: () => router.push('/app/sessions'),
    },
    {
      key: 'pomodoro',
      name: dictionary['pomodoro'],
      icon: <AlarmClock className="size-5" />,
      function: () => launchModal('pomodoro'),
    },
    {
      key: 'certificates',
      name: dictionary['certificates'],
      icon: <Trophy className="size-5" />,
      function: () => router.push('/app/certificates'),
    },
    {
      key: 'logout',
      name: dictionary['sign-out'],
      icon: <LogOut className="size-5" />,
      function: async () => {
        await fetch('/api/auth/logout', {
          method: 'POST',
        });
        router.push('/sign-in');
      },
      color: 'danger',
    },
  ];

  const actionDropdown = async (key: Key) => {
    const item = listConfiguration.find((item) => item.key === key);

    if (item.function) {
      item.function();
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const countNotifications = listConfiguration.reduce((acc, item) => {
    if (item.badgeNotification) {
      acc += item.badgeNotification;
    }
    return acc;
  }, 0);

  return (
    <NavbarItem>
      <Dropdown
        showArrow
        placement="bottom-end"
        isOpen={dropdownOpen}
        onOpenChange={setDropdownOpen}
        offset={30}
      >
        <DropdownTrigger>
          {countNotifications > 0 ? (
            <Badge content={countNotifications} color="danger" size="md">
              <AvatarConfiguration
                name={user.name}
                profileImage={profile?.imageUrl}
                onPress={() => setDropdownOpen(true)}
              />
            </Badge>
          ) : (
            <AvatarConfiguration
              name={user.name}
              profileImage={profile?.imageUrl}
              onPress={() => setDropdownOpen(true)}
            />
          )}
        </DropdownTrigger>
        <DropdownMenu
          onAction={actionDropdown}
          aria-label="Configuration"
          color="primary"
          variant="flat"
          data-cy="configuration-dropdown-menu"
        >
          {listConfiguration.map((item) => (
            <DropdownItem
              key={item.key}
              startContent={item.icon}
              color={item.color || 'primary'}
              data-cy={`${item.key}-configuration-dropdown-item`}
            >
              {item.badgeNotification ? (
                <div className="flex flex-row justify-between items-center gap-2">
                  <p>{item.name}</p>
                  <p className="bg-danger text-white text-sm rounded-full size-4 flex flex-row justify-center items-center">
                    {item.badgeNotification}
                  </p>
                </div>
              ) : (
                item.name
              )}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      {modals.map((modal) => (
        <ModalWrapper
          key={modal.keyModal}
          keyModal={modal.keyModal}
          title={modal.title}
          content={modal.content}
        />
      ))}
    </NavbarItem>
  );
}

function AvatarConfiguration({
  name,
  profileImage,
  onPress,
}: {
  name: string;
  profileImage: string;
  onPress?: () => void;
}) {
  return (
    <Avatar
      as={Button}
      isIconOnly
      ImgComponent={NextImage}
      imgProps={{ width: 160, height: 160 }}
      src={profileImage}
      name={name.charAt(0).toUpperCase()}
      alt={name}
      showFallback
      isFocusable
      className="text-xl"
      color="primary"
      data-cy={`profile-avatar-button`}
      onPress={onPress}
    />
  );
}

import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { UserDto } from '@/lib/dto/user.dto';
import ManagementUserBoard from '@/components/dashboard/ManagementUserBoard';
import { Divider } from '@nextui-org/divider';

interface UserProfileCardProps {
  user: UserDto;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <Card className="sm:w-96 w-80 h-72 p-4 my-2 mx-2">
      <CardBody className="flex flex-col justify-center items-center w-full h-full gap-3">
        <p className="text-lg break-all text-center">{user.email}</p>
        <p className="text-lg">Name: {user.name}</p>
        <p className="text-lg">Diamonds: {user.money} 💎</p>
        <ManagementUserBoard user={user} />
      </CardBody>
    </Card>
  );
}

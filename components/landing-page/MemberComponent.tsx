import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Avatar } from '@nextui-org/avatar';
import GitHub from '@/components/icons/GitHub';
import Instagram from '@/components/icons/Instagram';
import TikTok from '@/components/icons/TikTok';
import Twitter from '@/components/icons/Twitter';
import LinkedIn from '@/components/icons/LinkedIn';

interface MemberCompProps {
  image: string;
  name: string;
  role: string;
  description: string;
  socialNetworks?: Record<string, string>;
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
}

const getComponentFromType = (type: string, link: string, color: string) => {
  switch (type.toLowerCase()) {
    case 'github':
      return <GitHub link={link} color={color} />;
    case 'instagram':
      return <Instagram link={link} color={color} />;
    case 'tiktok':
      return <TikTok link={link} color={color} />;
    case 'x':
    case 'twitter':
      return <Twitter link={link} color={color} />;
    case 'linkedin':
      return <LinkedIn link={link} color={color} />;
    default:
      return <div>Unknown Type</div>;
  }
};

export default function MemberComponent({
  image,
  name,
  role,
  description,
  socialNetworks = {},
  color = 'default',
}: MemberCompProps) {
  const socialNetworkEntries = Object.entries(socialNetworks);

  return (
    <div className="flex flex-col justify-start lg:w-[400px] lg:h-[450px] gap-3 mt-5">
      <div className="flex flex-row items-center justify-between gap-3">
        <Avatar
          imgProps={{ width: 80, height: 80 }}
          src={image}
          className="h-20 w-20"
          isBordered
          color={color}
          name={name}
          showFallback
        />
        <h2 className="text-xl font-bold">
          {name} - {role}
        </h2>
      </div>
      <p className="text-md text-pretty">{description}</p>
      {socialNetworkEntries.length > 0 && (
        <div className="mt-5 flex flex-row gap-6 justify-center">
          {socialNetworkEntries.map(([network, url]) => (
            <div key={network}>
              {getComponentFromType(network, url, 'foreground')}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

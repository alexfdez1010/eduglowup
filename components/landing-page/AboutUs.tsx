import MemberComponent from './MemberComponent';

interface AboutUsProps {
  localeDictionary: Record<string, string>;
}

export default function AboutUs({ localeDictionary }: AboutUsProps) {
  const alexSocialNetworks: Record<string, string> = {
    github: 'https://www.github.com/alexfdez1010',
    instagram: 'https://instagram.com/alexfdez_01',
    linkedin: 'https://www.linkedin.com/in/alejandro-fernandez-camello/',
  };

  const oscarSocialNetworks: Record<string, string> = {
    github: 'https://www.github.com/Oscar-Banos-Campos',
    linkedin: 'https://www.linkedin.com/in/%C3%B3scar-ba%C3%B1os-campos/',
  };

  return (
    <div className="flex flex-wrap justify-evenly items-center gap-x-20 gap-y-3 lg:w-full mx-auto">
      <MemberComponent
        image="/images/members/alejandro.webp"
        name="Alejandro"
        role={localeDictionary['alex-role']}
        description={localeDictionary['alex-description']}
        socialNetworks={alexSocialNetworks}
        color="primary"
      />
      <MemberComponent
        image="/images/members/oscar.webp"
        name="Óscar"
        role={localeDictionary['oscar-role']}
        description={localeDictionary['oscar-description']}
        socialNetworks={oscarSocialNetworks}
        color="primary"
      />
      <MemberComponent
        image="/images/members/carlos.webp"
        name="Carlos"
        role={localeDictionary['carlos-role']}
        description={localeDictionary['carlos-description']}
        socialNetworks={{}}
        color="primary"
      />
    </div>
  );
}

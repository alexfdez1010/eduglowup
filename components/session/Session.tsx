import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import { deleteSession } from '@/lib/actions/sessions';
import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';
import ChipContainer from '@/components/general/ChipContainer';
import { StudySessionWithDocumentsNameDto } from '@/lib/dto/study-session.dto';
import { ForwardIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useDictionary } from '@/components/hooks';
import { Trash } from 'lucide-react';


interface SessionProps {
  session: StudySessionWithDocumentsNameDto;
}

export default function Session({ session }: SessionProps) {

  // Mismatch between server and client.
  // Props (Server side) are UTC, client may not be.
  const startMoment = new Date(session.startTime).toLocaleString();

  const [localTime, setLocalTime] = useState("");

  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");

  const dictionary = useDictionary('content');

  const exercisesNames = session.exercises.map(
    (name) => dictionary[name] || name,
  );

  console.log(session.startTime);

  useEffect(() => {
    const date = new Date(session.startTime);
    const formattedTime = date.toLocaleString(); // Local timezone conversion happens only on client
    setLocalTime(formattedTime);
  }, [session.startTime]);

  useEffect(() => {
    let [tempDate, tempHour] = localTime.split(',');
    let modifiedHour = (tempHour != undefined && tempHour.length > 3) ? tempHour.slice(0, -3) : "";
    setDate(tempDate);
    setHour(modifiedHour);
  }, [localTime]);


  return (
    <Card
      fullWidth={true}
      className="p-5 flex flex-col justify-between items-center my-3"
    >
      <CardBody className="flex flex-col justify-center items-center gap-5">
        <ChipContainer
          items={[session.documentName]}
          color="primary"
          variant="bordered"
        />
        <ChipContainer items={exercisesNames} variant="bordered" />
        <p className="font-bold">{date}</p>
        <p>{hour}</p>
        <div className="flex flex-row justify-evenly items-center w-full">
          <Button
            as={Link}
            href={`/app/sessions/${session.id}`}
            color="primary"
            isIconOnly
          >
            <ForwardIcon className="size-5" />
          </Button>
          <form action={deleteSession}>
            <input type="hidden" name="sessionId" value={session.id} />
            <ButtonWithSpinner
              color="danger"
              isActive={true}
              isIconOnly
              variant="ghost"
              dataCy={`delete-session-${session.id}-button`}
            >
              <Trash className="size-5" />
            </ButtonWithSpinner>
          </form>
        </div>
      </CardBody>
    </Card>
  );
}

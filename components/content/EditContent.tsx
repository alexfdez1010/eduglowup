import { DocumentDto } from '@/lib/dto/document.dto';
import { Input } from '@nextui-org/react';
import ButtonWithSpinner from '../general/ButtonWithSpinner';
import FormWithFeedbackManagement from '../general/FormWithFeedbackManagement';
import { deleteContent, updateNameDocument } from '@/lib/actions/content';
import { useState } from 'react';
import { useDictionary } from '@/components/hooks';
import ModalWrapper from '@/components/modal/ModalWrapper';

interface EditContentProps {
  content: DocumentDto;
}

export default function EditContent({ content }: EditContentProps) {
  const dictionary = useDictionary('content');

  const [name, setName] = useState(content.filename);
  const [nameOnDelete, setNameOnDelete] = useState('');

  return (
    <ModalWrapper
      keyModal={`edit-document-${content.id}`}
      title={dictionary['edit-document']}
      content={
        <>
          <FormWithFeedbackManagement
            action={updateNameDocument}
            className="flex flex-col gap-5 w-full justify-center items-center"
          >
            <Input
              name="name"
              variant="bordered"
              color="primary"
              label={dictionary['document-name']}
              value={name}
              onValueChange={(value) => setName(value)}
            />
            <input type="hidden" name="documentId" value={content.id} />
            <ButtonWithSpinner
              isActive={name.length > 0 && name.length <= 80}
              color="primary"
              variant="solid"
              className="w-fit"
            >
              {dictionary['update-document-name']}
            </ButtonWithSpinner>
          </FormWithFeedbackManagement>
          <FormWithFeedbackManagement
            action={deleteContent}
            className="flex flex-col gap-8 items-center"
          >
            <Input
              name="nameForDelete"
              variant="bordered"
              color="danger"
              label={dictionary['document-name']}
              value={nameOnDelete}
              onValueChange={(value) => setNameOnDelete(value)}
              description={dictionary['document-delete-description'].replace(
                '{name}',
                content.filename,
              )}
            />
            <input type="hidden" name="documentId" value={content.id} />
            <ButtonWithSpinner
              isActive={nameOnDelete === content.filename}
              color="danger"
              variant="solid"
            >
              {dictionary['delete-document']}
            </ButtonWithSpinner>
          </FormWithFeedbackManagement>
        </>
      }
    />
  );
}

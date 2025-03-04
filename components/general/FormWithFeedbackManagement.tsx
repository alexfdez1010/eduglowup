'use client';

import React, { useEffect, forwardRef } from 'react';
import { useFormState } from 'react-dom';
import { ActionWithState } from '@/lib/interfaces';
import { errorToast, successToast } from '@/components/ToastContainerWrapper';

interface FormWithFeedbackManagementProps {
  children: React.ReactNode;
  action: ActionWithState;
  className?: string;
  id?: string;
  errorAsToast?: boolean;
  executeOnFinish?: () => void;
}

const FormWithFeedbackManagement = forwardRef<
  HTMLFormElement,
  FormWithFeedbackManagementProps
>(
  (
    {
      children,
      action,
      className = '',
      id = '',
      errorAsToast = false,
      executeOnFinish,
    },
    ref,
  ) => {
    const [state, formAction] = useFormState(action, undefined);

    useEffect(() => {
      if (state && !state.isError) {
        successToast(state.message);
        executeOnFinish && executeOnFinish();
      } else if (state && state.isError && errorAsToast) {
        errorToast(state.message);
      }
    }, [state, errorAsToast, executeOnFinish]);

    return (
      <form
        ref={ref}
        action={formAction}
        className={className}
        {...(id && { id })}
      >
        {children}
        <div className="flex items-end" aria-live="polite" aria-atomic="true">
          {!errorAsToast && state && state.isError && (
            <p className="text-sm text-danger text-center">{state.message}</p>
          )}
        </div>
      </form>
    );
  },
);

FormWithFeedbackManagement.displayName = 'FormWithFeedbackManagement';

export default FormWithFeedbackManagement;

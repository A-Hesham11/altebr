/////////// IMPORTS
///
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";
import { boolean } from "yup";
///
/////////// Types
///
type ModalProps_TP = {
  isOpen: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
  blur?: `max-w-[${number}px]`;
};
/////////// HELPER VARIABLES & FUNCTIONS
///

///
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth,
  blur,
}: ModalProps_TP) => {
  /////////// VARIABLES
  ///

  ///
  /////////// CUSTOM HOOKS
  ///

  ///
  /////////// STATES
  ///

  ///
  /////////// SIDE EFFECTS
  ///

  /////////// FUNCTIONS | EVENTS | IF CASES
  ///

  ///
  return (
    <Transition.Root appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`fixed inset-0 bg-black bg-opacity-25 ${blur}`} />
        </Transition.Child>

        <div className={`fixed inset-0 overflow-y-auto mx-auto`}>
          <div
            className={`flex min-h-full items-center justify-center p-4 text-center sm:items-center ${maxWidth} mx-auto`}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-start align-middle shadow-xl transition-all sm:my-8 sm:max-w-6xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 relative mb-2 "
                >
                  {title}
                  <button
                    type="button"
                    //@ts-ignore
                    className={`absolute left-3 z-10 ${
                      children?.props?.title === undefined ? "top-3" : "top-5"
                    }  `}
                    onClick={() => onClose(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6 animate_scale animation_delay-11 text-gray-400 hover:text-gray-500 rounded-md hover:border-mainRed hover:border-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </Dialog.Title>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

import { useErrorModal } from "@/context/modal/ErrorModalProvider";
import { Button } from "../atoms";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

const ModalError = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { close, isOpen } = useErrorModal();

  const handleBack = () => {
    navigate(-1);
    close();
  };

  return (
    <Transition.Root appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative !z-50 " onClose={() => {}}>
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
            className={`flex min-h-full items-center justify-center p-4 text-center sm:items-center mx-auto`}
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
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-start align-middle shadow-xl transition-all sm:my-8 sm:max-w-xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 relative mb-2 "
                ></Dialog.Title>
                <div>
                  <div className="px-6 py-5">
                    <h3
                      id="modal-title"
                      className="text-lg font-semibold leading-6 text-mainRed text-center"
                    >
                      {t("An unexpected error occurred during processing")}
                    </h3>

                    <p className="mt-6 text-center text-gray-900">
                      {t("Contact the support team")}
                    </p>
                  </div>

                  <div className="px-6 pb-6 flex justify-center gap-3">
                    <Button type="button" action={handleBack}>
                      {t("back")}
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ModalError;

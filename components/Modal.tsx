import * as Dialog from '@radix-ui/react-dialog';
import { IoMdClose } from 'react-icons/io';

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onChange, title, description, children }) => {
  return (
    <Dialog.Root open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay 
          className="bg-background/80 backdrop-blur-sm fixed inset-0 z-50 animate-fade-in"
        />
        <Dialog.Content
          className="
            fixed z-50
            top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-full max-w-md
            max-h-[85vh] overflow-y-auto
            bg-card border border-border
            rounded-xl shadow-2xl shadow-black/50
            p-6
            animate-scale-in
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
          "
          aria-describedby="modal-description"
        >
          <Dialog.Title className="text-xl text-center font-bold mb-2 text-card-foreground">
            {title}
          </Dialog.Title>
          <Dialog.Description 
            id="modal-description"
            className="mb-5 text-sm leading-relaxed text-center text-muted-foreground"
          >
            {description}
          </Dialog.Description>
          <div>{children}</div>
          <Dialog.Close asChild>
            <button
              className="
                absolute top-4 right-4
                p-1.5 rounded-full
                text-muted-foreground hover:text-foreground
                hover:bg-secondary
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-primary
              "
              aria-label="Close modal"
            >
              <IoMdClose size={18} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

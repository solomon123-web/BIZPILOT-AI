import type { ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title ?? 'Modal'} onClick={(event) => event.stopPropagation()}>
        {title ? <h3 className="h3">{title}</h3> : null}
        <div>{children}</div>
        {footer ? <div>{footer}</div> : null}
      </div>
    </div>
  );
}

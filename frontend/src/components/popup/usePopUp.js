import React from "react";

export function usePopUp(props) {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const handleConfirm = () => {
        setOpen(false);
        props.onConfirm && props.onConfirm();
    };
    return {
        setTrue: () => setOpen(true),
        open,
        onClose: handleClose,
        onConfirm: handleConfirm,
    };
}
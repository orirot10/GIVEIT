'../../styles/components/Modal.css';

const DeleteConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
    <div className="modal">
        <div className="modal-content small">
        <p>Are you sure you want to delete?</p>
        <div className="modal-buttons">
            <button className="danger" onClick={onConfirm}>Delete</button>
            <button onClick={onCancel}>Cancel</button>
        </div>
        </div>
    </div>
    );
};

export default DeleteConfirmationModal;
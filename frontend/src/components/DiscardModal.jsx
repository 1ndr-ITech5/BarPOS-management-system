const DiscardModal = ({changeDiscardModal, setShowDiscard}) => {
    return(
        <div className="discard">
            <h2>Do you want to discard changes?</h2>
            <div className="buttons">
                <button onClick={() => changeDiscardModal()}>Yes</button>
                <button onClick={() => setShowDiscard(false)}>No</button>
            </div>
        </div>
    )
}

export default DiscardModal;
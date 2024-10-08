import { useMutation } from "@apollo/client";
import { ADD_PROMPT } from "../graphql/mutations";
import { GET_USER_PROMPTS, GET_ALL_PROMPTS } from "../graphql/queries";

function ImageModal(props) {
  const [addPrompt] = useMutation(ADD_PROMPT, {
    refetchQueries: [GET_USER_PROMPTS, GET_ALL_PROMPTS]
  });

  const saveGeneration = async () => {
    await addPrompt({
      variables: {
        ...props.formData,   // Existing form data
        imageUrl: props.imageUrl  // Explicitly include the imageUrl
      }
    });
    props.setModalOpen(false);
    props.setFormData(props.initialFormData);  // Reset the form data after saving
  };
  

  function closeModal() {
    props.setModalOpen(false);
  }

  return (
    <div className={`modal ${props.modalOpen ? 'is-active' : ''}`}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <p className="image is-4by3">
          <img src={props.imageUrl} alt="Generated image" />
        </p>
        {props.isNewImage && (  // Conditionally render buttons based on isNewImage
          <div className="is-flex-direction-row mt-3 ">
            <button onClick={props.handleSubmit} className="button is-warning mr-3">Regenerate</button>
            <button onClick={saveGeneration} className="button is-primary">Save</button>
          </div>
        )}
      </div>
      <button onClick={closeModal} className="modal-close is-large" aria-label="close"></button>
    </div>
  );
}

export default ImageModal;

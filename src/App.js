import { useState } from "react";

// Components
import Navigation from "./components/Navigation/Navigation";
import MintForm from "./components/Form/MintForm";
import ImageView from "./components/Image/ImageView";
import MetadataView from "./components/Metadata/MetadataView";

// Utils
import createImage from "./utils/createImage";
import uploadImage from "./utils/uploadImage";
import mintImage from "./utils/mintImage";
import useBlockchainData from "./hooks/useBlockchainData";
import Modal from "./components/UI/Modal";

import { MESSAGES } from "./constants/messages.js";

const App = () => {
  const { provider, nft } = useBlockchainData();
  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    image: null,
    url: null,
  });
  const [status, setStatus] = useState({
    message: MESSAGES.addDataToForm,
    isWaiting: false,
  });

  const [isModalOpen, setModalOpen] = useState(false); // State to control the modal

  const updateMetadata = (key, value) => {
    setMetadata((prev) => ({ ...prev, [key]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (metadata.name === "" || metadata.description === "") {
      setStatus({
        ...status,
        message: MESSAGES.provideNameAndDescription,
      });
      setModalOpen(true); // Open the modal if validation fails
      return;
    }

    setStatus({ ...status, isWaiting: true });

    try {
      const imageData = await createImage(
        metadata.description,
        setStatus,
        updateMetadata
      );

      const url = await uploadImage(
        imageData,
        metadata.name,
        metadata.description,
        setStatus
      );

      updateMetadata("url", url);

      await mintImage(url, provider, nft, setStatus);
    } catch (error) {
      console.error("Error in submission:", error);
      setStatus({ message: MESSAGES.errorOccurred, isWaiting: false });
      setModalOpen(true); // Open the modal if an error occurs
    }
  };

  const closeModal = () => setModalOpen(false); // Function to close the modal

  return (
    <div>
      <Navigation />
      <div className="container">
        <MintForm
          updateMetadata={updateMetadata}
          handleSubmit={submitHandler}
          isWaiting={status.isWaiting}
        />
        <ImageView image={metadata.image} status={status} />
      </div>
      <MetadataView isWaiting={status.isWaiting} url={metadata.url} />
      <Modal open={isModalOpen} onClose={closeModal}>
        <h2>{status.message}</h2>
      </Modal>
    </div>
  );
};

export default App;

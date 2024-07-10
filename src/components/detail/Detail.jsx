import React from "react";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase";
import { useUserStore } from "../../lib/userStore";
import CustomModal from "../customModal/CustomModal";
import "./Detail.css";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import {
  Fullscreen,
  Download,
  Zoom,
  Thumbnails,
} from "yet-another-react-lightbox/plugins";

const Detail = () => {
  const { chatId, user, changeBlock, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();
  const [chat, setChat] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  React.useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      const data = res.data();
      setChat(data);
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  let slides = [];
  const [index, setIndex] = React.useState(0);

  chat.messages?.forEach((mes) => {
    if (mes.img)
      slides.push({
        src: mes.img,
        title: "Message img",
        description: "Message img ",
      });
  });

  const handleOpen = (mes) => {
    setIsOpen(true);
    for (let i = 0; i < slides.length; i++)
      if (mes.img === slides[i].src) setIndex(i);
  };
  const handleBlock = () => {
    setIsModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    changeBlock();
    try {
      const userRef = doc(db, "users", currentUser.id);

      if (!isReceiverBlocked) {
        await updateDoc(userRef, {
          blocked: arrayUnion(user.id),
        });
      } else {
        await updateDoc(userRef, {
          blocked: arrayRemove(user.id),
        });
      }
    } catch (error) {
      console.log(error);
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user.avatar || "./avatar.png"} alt="" />
        <h2>{user.username}</h2>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img src="./arrowUp.png" alt="" />
          </div>
          <div className="photos">
            {chat?.messages?.map((mes, index) => {
              if (mes.img) {
                return (
                  <div className="photoItems" key={index}>
                    <img src={mes.img} alt="" onClick={() => handleOpen(mes)} />
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        {!isReceiverBlocked ? (
          <button onClick={handleBlock}>Block</button>
        ) : (
          <button style={{ backgroundColor: "green" }} onClick={handleBlock}>
            Unblock
          </button>
        )}

        <button className="logout" onClick={() => auth.signOut()}>
          Logout
        </button>
      </div>
      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmBlock}
        message={`Are you sure you want to ${
          isReceiverBlocked ? "unblock" : "block"
        } this user?`}
      />
      <Lightbox
        open={isOpen}
        slides={slides}
        index={index}
        plugins={[Fullscreen, Download, Zoom, Thumbnails]}
        close={() => setIsOpen(false)}
      />
    </div>
  );
};

export default Detail;

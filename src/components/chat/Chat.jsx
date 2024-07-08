import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";

const Chat = () => {
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [chat, setChat] = React.useState([]);
  const endRef = React.useRef(null);

  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  React.useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      const data = res.data();
      setChat(data);
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText(text + e.emoji);
  };
  const handleSend = async (e) => {
    if (text === "") return;
    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text: text,
          createdAt: new Date(),
        }),
      });

      const userIds = [currentUser.id, user.id];

      userIds.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (ch) => ch.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            currentUser.id === id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>Jane Doe</span>
            <p>Lorem ipsum dolor sit amet consectetur..</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat.messages?.map((mes) => (
          <div
            className={`message ${
              mes.senderId === currentUser.id ? "own" : ""
            }`}
            key={mes?.createdAt}
          >
            <div className="texts">
              {mes.img && <img src={mes.img} alt="" />}
              {mes.text && <p>{mes.text}</p>}
              {/* <span>{mes.createdAt}</span> */}
            </div>
          </div>
        ))}

        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className="emoji">
          <img onClick={() => setOpen((p) => !p)} src="./emoji.png" alt="" />

          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={(e) => handleEmoji(e)} />
          </div>
        </div>
        <button className="sendButton" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
